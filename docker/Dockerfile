FROM oven/bun:latest AS base

# First stage: Pruning
FROM base AS builder
# Add dependencies for node-gyp and other build tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Install turbo globally
RUN bun install -g turbo
COPY . .
# Prune the workspace for the specific app we're building
ARG APP_NAME
RUN turbo prune --scope=$APP_NAME --docker

# Second stage: Installing dependencies
FROM base AS installer
WORKDIR /app

# Copy package.json files from pruned workspace
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lockb ./bun.lockb
# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code from pruned workspace
COPY --from=builder /app/out/full/ .

# Optional: Enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Build the project
RUN bun run turbo run build --filter=$APP_NAME...

# Third stage: Runner
FROM node:slim AS runner
WORKDIR /app

# Create a non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
USER nodejs

# Copy built assets
ARG APP_NAME
COPY --from=installer /app/apps/$APP_NAME/dist ./dist
# Install serve for static file serving
RUN npm install -g serve

# Expose port
EXPOSE 3000
CMD ["serve", "dist", "-p", "3000"]
