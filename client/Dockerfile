# ---------- Stage 1: Base ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# Copy workspace metadata for dependency caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY client/package.json ./client/

# Cache dependencies
RUN pnpm fetch


# ---------- Stage 2: Builder ----------
FROM base AS builder

COPY . .

# Install dependencies offline using the cache from pnpm fetch
RUN pnpm install --offline --frozen-lockfile
RUN pnpm --filter client build


# ---------- Stage 3: Runner (Nginx) ----------
FROM nginx:stable-alpine AS runner

WORKDIR /usr/share/nginx/html

# Clean the default html folder
RUN rm -rf ./*

# Copy build files from builder stage
COPY --from=builder /app/client/dist ./

# Custom nginx config for SPA routing and non-root user
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Configure Nginx to run as a non-privileged user for security
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
