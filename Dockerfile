# ---- Build Stage ----
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---- Production Stage ----
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=4001

EXPOSE ${PORT}

USER appuser

CMD ["node", "dist/index.js"]
