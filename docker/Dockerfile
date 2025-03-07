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
FROM node:slim AS runner
WORKDIR /app

# Install serve before switching to non-root user
RUN npm install -g serve

# Create a non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Copy built assets
ARG APP_NAME
COPY --from=builder /app/apps/${APP_NAME}/dist ./dist

# Set permissions
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000
CMD ["serve", "dist", "-p", "3000"]
