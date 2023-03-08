# Install dependencies only when needed
FROM node:16-bullseye-slim as builder
RUN apt-get update && apt-get install -y openssl pkg-config libpixman-1-dev libcairo2-dev libxt-dev libjpeg-dev libgif-dev libpango1.0-dev
RUN apt-get install -y python3 g++ make
# build-time arguments that NextJS needs when transpiling:
# sets yarn to version 3.x
ENV NODE_ENV production
WORKDIR /app
RUN yarn global add turbo
RUN yarn set version stable
COPY . .
RUN turbo prune --scope=@yungsten/spamcntrl-langingpage --docker
RUN yarn set version stable
RUN yarn install
RUN yarn build --filter=@yungsten/spamcntrl-langingpage

EXPOSE 3000
ENV PORT 3000

# Run the NextJS start script
CMD ["yarn", "--cwd", "apps/spamcntrl-landingpage", "next", "start"]