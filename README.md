# SmartNotes

SmartNotes is a Next.js app that lets users create/search notes and chat with an AI assistant that can:
- Retrieve relevant notes (Pinecone vector search + Prisma/MongoDB)
- Create notes via tools from the chat UI

## Tech Stack
- Next.js (App Router)
- Prisma + MongoDB
- Clerk Auth
- Pinecone (vector index: `smartnotes`)
- Google Gemini (AI + embeddings)
- shadcn/ui + Tailwind

## Prerequisites
- Node.js 20+ recommended
- pnpm
- Accounts/keys:
  - MongoDB connection string
  - Clerk keys
  - Pinecone API key + an index named `smartnotes`
  - Gemini API key (see env vars below)

## Quickstart
```bash
pnpm install
cp .env.example .env
pnpm dev
```

Then open `http://localhost:3000`.

## Environment Variables
Copy `.env.example` to `.env` and fill these:

| Variable | Required | Notes |
|---|---:|---|
| `DATABASE_URL` | ✅ | MongoDB connection string for Prisma |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key |
| `PINECONE_API_KEY` | ✅ | Pinecone API key (index name must be `smartnotes`) |
| `GEMINI_API_KEY` | ✅ | Used by `lib/geminiai.ts` for embeddings |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ⚠️ | Optional; only needed if you switch providers/config to use it |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ⛔ | Defaults to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ⛔ | Defaults to `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | ⛔ | Defaults to `/notes` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | ⛔ | Defaults to `/notes` |

## Pinecone Setup
This project queries the Pinecone index named `smartnotes` (see `lib/db/pinecone.ts`).

Notes are embedded with `gemini-embedding-2` at `outputDimensionality: 1024`, so your Pinecone index should match that dimension.

## Scripts
```bash
pnpm dev        # start local dev server
pnpm build      # prisma generate + next build
pnpm start      # start production server
pnpm typecheck  # tsc
pnpm lint       # eslint (may require local config fixes)
```

`prisma generate` is run in:
- `postinstall` (local installs)
- `pnpm build` (helps on Vercel where dependencies are cached)

## Common Issues

### Prisma Client outdated on Vercel
If you see a `PrismaClientInitializationError` about Vercel caching dependencies, this repo already includes `prisma generate` in `build`. Verify Vercel is running the `build` script from `package.json`.

### Chat streaming doesn’t update
Chat streaming is already implemented using the AI SDK UI message SSE protocol.

If you modify `app/api/chat/route.ts`, make sure you keep returning a UI message stream response (e.g. `createUIMessageStreamResponse(...)` / `toUIMessageStreamResponse()`), not a plain text stream (`toTextStreamResponse()`), otherwise the `useChat()` UI may stop updating/streaming.
