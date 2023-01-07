# base node image
FROM node:16-bullseye-slim as base
# ENV NODE_ENV production
RUN apt-get update && apt-get install -y openssl pkg-config libpixman-1-dev libcairo2-dev libxt-dev libjpeg-dev libgif-dev libpango1.0-dev
RUN apt-get install -y python3 g++ make
RUN yarn global add turbo

FROM base as pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@yungsten/cog --docker


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
RUN turbo db:generate
RUN turbo run build --filter=@yungsten/cog

FROM builder as runner
EXPOSE 3000
EXPOSE 15000
COPY *.env .
CMD ["yarn", "--cwd", "apps/cog", "start:api"]


# ADD packages/database/prisma .
# RUN yarn add -W prisma
# RUN yarn prisma generate