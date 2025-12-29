import { inngest } from "../client";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/modules/github/lib/github";
import { retrieveContext } from "@/modules/ai/lib/rag";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import prisma from "@/lib/db";

export const generateReview = inngest.createFunction(
  {
    id: "generate-review",
    concurrency: 5,
  },
  { event: "pr.review.requested" },

  async ({ event, step }) => {
    const { owner, repo, prNumber, userId } = event.data;

    const { diff, title, description, token } = await step.run(
      "fetch-pr-data",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId: userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No Github access token found");
        }

        const data = await getPullRequestDiff(
          account.accessToken,
          owner,
          repo,
          prNumber
        );

        return {
          ...data,
          token: account.accessToken,
        };
      }
    );

    const context = await step.run("retrieve-context", async () => {
      const query = `${title}\n${description}`;

      return await retrieveContext(query, `${owner}/${repo}`);
    });

    const review = await step.run("generate-ai-review", async () => {
      const prompt = `You are a Senior Software Architect and Code Reviewer. Your goal is to review the following Pull Request with a focus on code quality, security, maintainability (SOLID/DRY principles), and performance.

PR Title: ${title}
PR Description: ${description || "No description provided"}

Context from Codebase:
${context.join("\n\n")}

Code Changes:
\`\`\`diff
${diff}
\`\`\`

Instructions:
1. Analyze the logic, not just the syntax.
2. If the code looks bug-free but hard to maintain, flag it.
3. Be specific. Don't just say "fix this," provide the corrected code snippet.

Output Format (Markdown):

## 1. Executive Summary
- A 2-sentence high-level overview of what this PR achieves.
- **Impact Assessment**: (Low/Medium/High risk).

## 2. Visual Logic Flow (Mermaid JS)
Create a sequence diagram visualizing the *new* logical flow.
**CRITICAL MERMAID RULES**:
- Use \`\`\`mermaid ... \`\`\` block.
- Keep labels short and alphanumeric ONLY.
- **ABSOLUTELY NO** special characters (quotes, braces, parentheses, apostrophes) inside node labels or notes.
- If the flow is too simple for a diagram, simply write "Logic is linear; no diagram needed."

## 3. Code Walkthrough
- Go through the changes file-by-file. Explain *why* the change was made, not just *what* changed.

## 4. Code Review Findings
Group your feedback into these categories:
- 🔴 **Critical Issues**: Bugs, security vulnerabilities, or major logic flaws.
- 🟡 **Improvements**: Refactoring suggestions for performance or readability.
- 🟢 **Praises**: Clever solutions or good practices observed.

## 5. Refactoring Suggestions
- Provide specific code blocks showing how to fix the "Critical Issues" or "Improvements" mentioned above.

## 6. The Verdict
- **Approve** / **Request Changes** / **Comment Only**

---
### 🤖 The Code Poet
(A short, creative poem summarizing the changes)
Format your response in markdown.
`;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      return text;
    });

    await step.run("post-comment", async () => {
      await postReviewComment(token, owner, repo, prNumber, review);
    });

    await step.run("save-review", async () => {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repo,
        },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            prNumber,
            prTitle: title,
            prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
            review,
            status: "completed",
          },
        });
      }
    });

    return { success: true };
  }
);
