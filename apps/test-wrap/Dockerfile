# base node image
FROM node:16-bullseye-slim as base
# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl git python3 make g++

# Install openssl for Prisma
RUN yarn global add turbo

FROM base as pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@yungsten/test-wrap --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base as installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

# Install only the deps needed to build the target
RUN yarn install

FROM base as builder
WORKDIR /app
COPY --from=pruner /app/.git ./.git
COPY --from=pruner /app/out/full .
COPY --from=installer /app/ .
RUN turbo run build --filter=test-wrap...

FROM builder as production
CMD ["yarn", "--cwd", "apps/test-wrap", "start"]