# Base stage with pnpm setup
FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Production dependencies stage
FROM base AS prod-deps
COPY package.json ./
# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Build stage - install all dependencies and build
FROM base AS build
COPY package.json ./
# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm run build

# Final stage - Deploy output to Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
# Start Nginx server
