# base node image
FROM node:16-bullseye-slim as base
# ENV NODE_ENV production
ARG RUN_WITH_VECTOR=false
ENV RUN_WITH_VECTOR=${RUN_WITH_VECTOR}
ARG COG_SERVICE_BUILD_NAME=workers
ENV COG_SERVICE_BUILD_NAME=${COG_SERVICE_BUILD_NAME}
RUN apt-get update && apt-get install -y curl bash openssl pkg-config libpixman-1-dev libcairo2-dev libxt-dev libjpeg-dev libgif-dev libpango1.0-dev
RUN apt-get install -y python3 g++ make
RUN yarn global add turbo

FROM base as pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@yungsten/cog --docker

LABEL maintainer="Yungsten Tech" \
      version="1.0" \
      description="(workers) - a declarative job scheduling API stack in Typescript" \
      git-repo="https://github.com/paulmikulskis/redditat" \
      git-sha="$(git rev-parse --short HEAD)" \
      git-branch="$(git rev-parse --abbrev-ref HEAD)"

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
RUN turbo run build --filter=cog

FROM builder as runner
COPY *.env .
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.vector.dev | bash -s -- -y
CMD ["apps/cog/startup.sh", "workers"]
