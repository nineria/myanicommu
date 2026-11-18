# MyAniCommu

[https://myanimecommunity.vercel.app](https://myanimecommunity.vercel.app)

<div align='center'>
<img src="https://myanimecommunity.vercel.app/background.png">
</div>

## Description

MyAniCommu website purpose is to bring together people who like anime. They can come in and talk and exchange knowledge about anime, manga and light novels.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, `proxy.ts`) + React 19, TypeScript
- [Clerk](https://clerk.com/) auth (replaces Firebase Auth) with a webhook + lazy user sync
- [Prisma 7](https://www.prisma.io/) + PostgreSQL (replaces Firestore)
- [tRPC 11](https://trpc.io/) + TanStack Query, superjson
- Tailwind CSS 4 + shadcn/ui (Radix), lucide-react, sonner
- Tiptap rich text editor (HTML storage, sanitized with sanitize-html)
- Images stored in Postgres (`Image` table, served from `/api/images/[id]`)
- Biome (lint + format), bun as package manager

## Getting started

```bash
cp .env.example .env.local   # fill in Clerk, DB and S3 values
bun install
bunx prisma migrate dev
bun run db:seed              # optional sample content
bun run dev
```

Clerk dashboard: enable *Username*, Google/Facebook social login, and add a webhook to
`/api/webhooks/clerk` (events `user.updated`, `user.deleted`).
Set `ADMIN_EMAILS` so the first admin gets the ADMIN role on sign-up.

Note: scripts run Next on Node (`next dev/build`), not `bun --bun`, because Bun 1.3.x
currently fails `next build` for this Next version.

## Workflow

PRs go against `main`. When CI passes and there is no conflict, the PR is squash-merged automatically.
`develop` is only a local scratch branch for previewing deploys; it is not part of the release flow.

Notifications (CI, merged PRs, deploys) go to Telegram through the shared `nineria/telegram-notify` relay via a repo webhook.

