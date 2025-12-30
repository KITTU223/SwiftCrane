# AI Code Reviewer

An intelligent, AI-powered code review platform that automatically analyzes GitHub pull requests using advanced language models and retrieval-augmented generation (RAG) to provide comprehensive, context-aware code reviews.

## Description

AI Code Reviewer integrates with GitHub repositories to automatically review pull requests using Google's Gemini AI model. The platform leverages Pinecone vector database to index and retrieve relevant codebase context, enabling AI reviews that understand your project's architecture and coding patterns. Reviews are automatically posted as comments on pull requests, helping teams maintain code quality and catch issues early.

## Live Demo

<!-- Add your live demo URL here -->
**Live Demo**: [https://your-demo-url.com](https://your-demo-url.com)

<!-- Add screenshots here -->
<!-- ![Dashboard Screenshot](./screenshots/dashboard.png) -->
<!-- ![Review Example](./screenshots/review-example.png) -->

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Background Jobs**: Inngest
- **Authentication**: Better Auth
- **Database ORM**: Prisma 7
- **Database**: PostgreSQL

### AI & ML
- **AI SDK**: Vercel AI SDK
- **Language Model**: Google Gemini 2.5 Flash (via @ai-sdk/google)
- **Embeddings**: Google Text Embedding Model (text-embedding-004)
- **Vector Database**: Pinecone

### Integrations
- **GitHub**: Octokit
- **Payment Processing**: Polar.sh
- **Package Manager**: Bun (or npm/yarn)

## Features

- **GitHub OAuth Integration**: Secure authentication via GitHub
- **Repository Management**: Connect and manage multiple GitHub repositories
- **Automatic PR Reviews**: Webhook-triggered reviews on pull request events
- **Context-Aware Reviews**: RAG-powered reviews that understand your codebase
- **Comprehensive Review Format**: Structured reviews including:
  - Executive summary with impact assessment
  - Visual logic flow diagrams (Mermaid)
  - Code walkthrough
  - Categorized findings (Critical, Improvements, Praises)
  - Refactoring suggestions with code examples
  - Review verdict
- **Dashboard Analytics**: Track repositories, commits, PRs, and AI reviews
- **Contribution Graph**: Visualize coding activity over time
- **Monthly Activity Charts**: View commits, PRs, and reviews trends
- **Subscription Management**: Integrated billing via Polar.sh
- **Usage Tracking**: Monitor repository and review usage

## Folder Structure

```
ai-code-reviewer/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                  # Auth routes
│   │   └── login/
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── inngest/            # Inngest webhook handler
│   │   └── webhooks/           # External webhooks
│   │       └── github/         # GitHub webhook handler
│   ├── dashboard/              # Dashboard pages
│   │   ├── repository/         # Repository management
│   │   ├── reviews/           # Review history
│   │   ├── settings/          # User settings
│   │   └── subscriptions/     # Subscription management
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # React components
│   ├── ui/                     # Reusable UI components (Radix UI)
│   ├── providers/              # Context providers
│   └── app-sidebar.tsx         # Application sidebar
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── auth.ts                 # Better Auth configuration
│   ├── auth-client.ts          # Client-side auth
│   ├── db.ts                   # Prisma client
│   ├── pinecone.ts             # Pinecone client
│   └── generated/              # Generated Prisma client
│       └── prisma/
├── modules/                     # Feature modules
│   ├── ai/                     # AI review logic
│   │   ├── actions/            # Server actions
│   │   └── lib/                # RAG implementation
│   ├── auth/                   # Authentication module
│   ├── dashboard/              # Dashboard features
│   ├── github/                 # GitHub integration
│   ├── payment/                # Payment/subscription logic
│   ├── repository/             # Repository management
│   ├── review/                 # Review management
│   └── settings/               # User settings
├── inngest/                     # Inngest background jobs
│   ├── client.ts               # Inngest client
│   └── functions/              # Background functions
│       └── review.ts           # Review generation job
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma           # Prisma schema
│   └── migrations/             # Database migrations
├── public/                      # Static assets
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites

- **Node.js** 18+ or **Bun** latest
- **PostgreSQL** database
- **GitHub OAuth App** credentials
- **Pinecone** account and API key
- **Google Cloud** account with AI API access
- **Polar.sh** account (for payments, optional)
- **Inngest** account (for background jobs)

### Clone Repository

```bash
git clone https://github.com/Kittu223/SwiftCrane.git
cd SwiftCrane
```

### Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_code_reviewer?schema=public"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Pinecone Vector Database
PINECONE_DB_API_KEY="your_pinecone_api_key"

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your_random_secret_key"

# Application URLs
NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Polar.sh (Payment Processing - Optional)
POLAR_ACCESS_TOKEN="your_polar_access_token"
POLAR_WEBHOOK_SECRET="your_polar_webhook_secret"
POLAR_SUCCESS_URL="http://localhost:3000/dashboard/subscriptions?success=true"

# Inngest (Background Jobs)
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"
```

### Database Setup

Run Prisma migrations to set up the database:

```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate deploy
```

Or using npm:
```bash
npx prisma generate
npx prisma migrate deploy
```

### Run Locally

Start the development server:

```bash
bun dev
```

Or:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage Instructions

1. **Sign In**: Click "Sign In" and authenticate with your GitHub account
2. **Connect Repository**: Navigate to Dashboard → Repository and connect your GitHub repositories
3. **Automatic Reviews**: When you open or update a pull request, the system will automatically:
   - Index your codebase (if not already indexed)
   - Fetch the PR diff
   - Retrieve relevant codebase context using RAG
   - Generate an AI-powered review
   - Post the review as a comment on the PR
4. **View Reviews**: Check your review history in Dashboard → Reviews
5. **Monitor Activity**: View statistics and charts in the Dashboard

## API Endpoints

### Authentication
- `POST /api/auth/sign-in/github` - GitHub OAuth sign-in
- `POST /api/auth/sign-out` - Sign out

### Webhooks
- `POST /api/webhooks/github` - GitHub webhook handler for PR events
- `POST /api/inngest` - Inngest webhook handler for background jobs

### Internal API Routes
- All dashboard data is fetched via server actions (Next.js App Router pattern)

## Environment Variables Explanation

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | Yes |
| `PINECONE_DB_API_KEY` | Pinecone API key for vector database | Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key for Gemini | Yes |
| `BETTER_AUTH_URL` | Base URL for Better Auth (usually same as app URL) | Yes |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session encryption | Yes |
| `NEXT_PUBLIC_APP_BASE_URL` | Public base URL of your application | Yes |
| `NEXT_PUBLIC_APP_URL` | Public URL for redirects | Yes |
| `POLAR_ACCESS_TOKEN` | Polar.sh API access token | Optional |
| `POLAR_WEBHOOK_SECRET` | Secret for Polar.sh webhook verification | Optional |
| `POLAR_SUCCESS_URL` | Redirect URL after successful payment | Optional |
| `INNGEST_EVENT_KEY` | Inngest event key for background jobs | Yes |
| `INNGEST_SIGNING_KEY` | Inngest webhook signing key | Yes |

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` / `npm run dev` | Start development server |
| `bun build` / `npm run build` | Build for production |
| `bun start` / `npm start` | Start production server |
| `bun lint` / `npm run lint` | Run ESLint |

## Deployment Guide

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Railway**: Connect GitHub repo and configure environment variables
- **Render**: Create a Web Service and set environment variables
- **AWS Amplify**: Connect repository and configure build settings
- **Docker**: Create a Dockerfile and deploy to any container platform

### Database Migration

Before deploying, ensure your production database is set up:

```bash
bunx prisma migrate deploy
```

### Inngest Setup

1. Create an Inngest account
2. Set up your Inngest app
3. Configure webhook endpoint: `https://your-domain.com/api/inngest`
4. Add `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to environment variables

### GitHub Webhook Setup

For each repository you want to review:

1. Go to repository Settings → Webhooks
2. Add webhook: `https://your-domain.com/api/webhooks/github`
3. Content type: `application/json`
4. Events: Select "Pull requests"
5. The application will automatically create webhooks when you connect a repository

## Future Improvements / Roadmap

- [ ] Support for multiple AI models (OpenAI, Anthropic, etc.)
- [ ] Custom review templates and rules
- [ ] Team collaboration features
- [ ] Review history search and filtering
- [ ] Integration with more Git providers (GitLab, Bitbucket)
- [ ] Code quality metrics and trends
- [ ] Custom AI prompts per repository
- [ ] Review approval workflows
- [ ] Email notifications for reviews
- [ ] CLI tool for local reviews
- [ ] VS Code extension
- [ ] API for third-party integrations
- [ ] Advanced analytics and reporting

## Contributing Guidelines

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style**: Use TypeScript, follow existing patterns
3. **Write meaningful commits**: Use conventional commit messages
4. **Test your changes**: Ensure the application runs locally
5. **Update documentation**: Update README or relevant docs if needed
6. **Submit a Pull Request**: Provide a clear description of changes

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test locally: `bun dev`
4. Commit: `git commit -m "feat: add your feature"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting (if configured)
- Write self-documenting code with clear variable names
- Add comments for complex logic

## License

<!-- Add your license here -->
This project is licensed under the MIT License - see the LICENSE file for details.

## Author / Maintainer

<!-- Add your information here -->
**Your Name**
- GitHub: [@Kittu223](https://github.com/Kittu223)
- Email: kittu2000.me@gmail.com
- Website: [https://portfolio.krutarthchauhan.shop](https://portfolio.krutarthchauhan.shop)

---

**Note**: This project is actively maintained. For issues, feature requests, or questions, please open an issue on GitHub.
