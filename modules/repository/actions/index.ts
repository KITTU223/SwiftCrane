"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createWebhook, getRepositories } from "@/modules/github/lib/github";
import { inngest } from "@/inngest/client";
import {
  canConnectRepository,
  decrementRepositoryCount,
  incrementRepositoryCount,
} from "@/modules/payment/lib/subscription";

export const fetchRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const githubRepos = await getRepositories(page, perPage);

  const dbRepos = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedReposIds = new Set(dbRepos.map((repo) => repo.githubId));

  return githubRepos.map((repo: any) => ({
    ...repo,
    isConnected: connectedReposIds.has(BigInt(repo.id)),
  }));
};

export const connectRepository = async (
  owner: string,
  repo: string,
  githubId: number
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // check if user can connect more repositories
  const canConnect = await canConnectRepository(session.user.id);

  if (!canConnect) {
    throw new Error(
      "Repositories limite reached. please upgrade to PRO for unlimited repositories."
    );
  }

  const webhook = await createWebhook(owner, repo);

  if (webhook) {
    await prisma.repository.create({
      data: {
        githubId: BigInt(githubId),
        name: repo,
        owner,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId: session.user.id,
      },
    });

    // INCREMENT REPOSITORY COUNT FOR USEAGE TRACKING
    await incrementRepositoryCount(session.user.id);

    // TRIGGER REPOSITORY INDEXING FOR RAG
    try {
      await inngest.send({
        name: "repository.connected",
        data: {
          owner,
          repo,
          userId: session.user.id,
        },
      });
    } catch (error) {
      console.error("Failed to trigger repository indexing:", error);
    }
  }
  return webhook;
};
