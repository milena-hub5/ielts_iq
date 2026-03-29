# MAMP Setup

This project can run against MAMP MySQL without removing the current SQLite setup.

## 1. Create the database in MAMP

Open phpMyAdmin from MAMP and create a database named:

`ielts_iq`

You can choose another name if you want, but then update `DATABASE_URL`.

## 2. Create a local env for MAMP

Copy the example:

```bash
cp .env.mamp.example .env
```

Then edit `.env` if your MAMP settings differ.

Default MAMP values are usually:

- host: `127.0.0.1`
- port: `8889`
- user: `root`
- password: `root`

Example:

```env
DATABASE_URL="mysql://root:root@127.0.0.1:8889/ielts_iq"
OPENAI_API_KEY="your-new-key"
```

## 3. Generate Prisma client for MySQL

```bash
npm run db:mysql:generate
```

## 4. Push schema into MySQL

```bash
npm run db:mysql:push
```

This creates the tables in your MAMP database.

## 5. Start the backend

```bash
npm start
```

## Notes

- The current SQLite schema remains available in `prisma/schema.prisma`.
- The MySQL-ready schema lives in `prisma/schema.mysql.prisma`.
- If you switch back to SQLite later, restore the old `.env` with:

```env
DATABASE_URL="file:./dev.db"
```

- The OpenAI key that was previously used in this project should be rotated and replaced.
