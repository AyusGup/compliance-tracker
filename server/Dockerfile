# ---------- Stage 1: Base ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# Metadata first for cache
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY server/package.json ./server/

# Cache dependencies
RUN pnpm fetch


# ---------- Stage 2: Builder ----------
FROM base AS builder

COPY . .

RUN pnpm install --offline --frozen-lockfile

RUN pnpm --filter server build

RUN pnpm deploy --filter server --prod /prod


# ---------- Stage 3: Production ----------
# Using distroless for a minimal, secure, and slim image (no shell)
FROM gcr.io/distroless/nodejs20 AS production
WORKDIR /app

# Copy the isolated production folder from builder
COPY --from=builder --chown=nonroot:nonroot /prod ./

USER nonroot

ENV NODE_ENV=production

EXPOSE 3000

CMD ["dist/index.js"]
