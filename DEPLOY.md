# Deploy Guide

This project is ready for a simple split deployment:

- Frontend: Vercel
- Backend + MySQL: Railway

## Frontend on Vercel

Create a Vercel project from the repository root.

Use these settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Add this environment variable in Vercel:

```env
VITE_API_URL="https://your-backend-domain.up.railway.app/api"
```

The SPA rewrite is already configured in `vercel.json`, so routes like `/topics` and `/dashboard` work on refresh.

## Backend on Railway

Create a Railway project for the `server` directory.

Recommended settings:

- Root directory: `server`
- Install command: `npm install`
- Start command: `npm run start:prod`

Add these environment variables in Railway:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DB_NAME"
OPENAI_API_KEY="your-new-openai-key"
CLIENT_URL="https://your-frontend-domain.vercel.app"
PORT="5050"
```

`start:prod` runs `prisma db push` before starting the server, so your MySQL tables are created automatically.

## MySQL

Because the backend is already prepared for MySQL, you can use a hosted MySQL database with Railway or any other provider.

The Prisma schema used for deployment is:

`server/prisma/schema.mysql.prisma`

## Deploy Order

1. Deploy the backend first.
2. Copy the Railway public URL.
3. Add it to Vercel as `VITE_API_URL`.
4. Deploy the frontend.
5. Update `CLIENT_URL` in Railway to the final Vercel URL.
6. Redeploy Railway once so CORS is aligned with the frontend domain.

## Quick Check After Deploy

Open these pages and test in order:

1. `/profile`
2. `/topics`
3. `/practice`
4. `/dashboard`
5. `/study-plan`
6. `/assistant`

## Important Notes

- Rotate the old OpenAI key before deploying.
- The current email-based auth is okay for a demo, but not secure enough for a real public product.
- AI responses still depend on OpenAI billing being active.
