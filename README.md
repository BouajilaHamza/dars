# Dars (درس)

Open-source community MOOC platform for Tunisia, engineered to run at $0 hosting cost on Cloudflare.

## Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Edge Backend**: Hono on Cloudflare Pages Functions
- **Database**: Cloudflare D1 (Serverless SQLite)
- **Object Storage**: Cloudflare R2 (Zero-egress media storage)
- **Offline / PWA**: Web Worker & IndexedDB offline caching

## Features

- Bilingual interface: Arabic (native RTL), French, English
- Interactive lesson player with video, markdown reading, and quizzes
- Offline mode: save lessons locally for study without internet
- Creator studio: build courses and tag AI-generated educational content
- 100% free and open-source for the community

## Local Development

```bash
bun install
bun run dev
```

To run with Cloudflare Pages Functions locally:

```bash
bun run pages:dev
```
