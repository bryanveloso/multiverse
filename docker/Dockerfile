FROM oven/bun:latest AS base

# Main stage
FROM base AS builder
WORKDIR /app

# Copy all files
COPY . .
# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install all dependencies
RUN bun install --frozen-lockfile

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
