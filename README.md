## Development

Install:

```sh
pnpm i
```

Run the database (suggested with docker compose, do what you prefer):

```sh
docker-compose up -d
```

Setup your environment

```sh
cp .env.template .env
```

Run migrations:

```
pnpm prisma migrate dev
pnpm prisma generate
pnpm tsx prisma/seed.ts
```

Run the dev server:

```sh
pnpm dev
```
