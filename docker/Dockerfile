FROM oven/bun:latest AS base

# Main stage
FROM base AS builder
WORKDIR /app

# Install build dependencies first (better caching)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package.json bun.lock ./
COPY turbo.json ./

# Create all necessary directories
RUN mkdir -p packages/config packages/data packages/shared packages/ui apps/avalonstar.com apps/bryanvelo.so apps/omnyist.com apps/avalonstar.tv

# Copy all package.json files (needed for lockfile integrity)
COPY packages/config/package.json ./packages/config/
COPY packages/data/package.json ./packages/data/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/avalonstar.com/package.json ./apps/avalonstar.com/
COPY apps/bryanvelo.so/package.json ./apps/bryanvelo.so/
COPY apps/omnyist.com/package.json ./apps/omnyist.com/
COPY apps/avalonstar.tv/package.json ./apps/avalonstar.tv/

# Install all dependencies (this layer will be cached if dependencies don't change)
RUN bun install --frozen-lockfile

# Now copy all source files
COPY . .

# Build with proper type checking
ARG APP_NAME
RUN cd apps/${APP_NAME} && bun run astro build

# Runner stage 
FROM base AS runner
WORKDIR /app

# Note: Bun image already has a non-root user named 'bun'

# Copy built assets and server script
ARG APP_NAME
COPY --from=builder /app/apps/${APP_NAME}/dist ./dist
COPY --from=builder /app/docker/server.ts ./server.ts

# Set permissions
RUN chown -R bun:bun /app

# Switch to non-root user
USER bun

# Set the environment variable for the dist path
ENV DIST_PATH="./dist"

# Expose port
EXPOSE 3000
CMD ["bun", "run", "server.ts"]
