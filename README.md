# node-ts-template

Node.js + TypeScript + Express 5 + PostgreSQL starter template.

Includes JWT auth, Zod validation, database migrations, Docker setup, structured logging (Pino), and integration tests.

## Development

### With Docker (recommended)

```bash
cp .env.example .env
pnpm docker
```

This starts the app (with hot-reload) and a PostgreSQL database. The app runs on `http://localhost:4001`.

Run migrations inside the container:

```bash
pnpm app
# inside container:
pnpm migrate up
```

### Without Docker

Requires Node 22+ and a running PostgreSQL instance.

```bash
cp .env.example .env
# edit .env with your local DATABASE_URL
pnpm install
pnpm migrate up
pnpm dev
```

### Useful scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with hot-reload + pretty logs |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:docker` | Run tests inside Docker |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm migrate up` | Run pending migrations |
| `pnpm migrate:create` | Create a new migration file |
| `pnpm database` | Open psql shell in Docker |
| `pnpm reset` | Destroy volumes and rebuild containers |

## Production

### With Docker

```bash
docker build -t myapp .
docker run -p 4001:4001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgres://user:pass@host:5432/dbname \
  -e JWT_SECRET=your-production-secret \
  -e CORS_ORIGIN=https://yourdomain.com \
  myapp
```

The production Dockerfile uses a multi-stage build, compiles TypeScript, and runs as a non-root user.

### Without Docker

```bash
pnpm install --frozen-lockfile
pnpm build
NODE_ENV=production \
  DATABASE_URL=postgres://user:pass@host:5432/dbname \
  JWT_SECRET=your-production-secret \
  CORS_ORIGIN=https://yourdomain.com \
  pnpm start
```

**Note:** `JWT_SECRET` must be explicitly set in production -- the app will refuse to start with the default value.
