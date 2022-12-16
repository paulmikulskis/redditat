# Redditat

A framework for interacting with online platforms and generating novel content.

## Quickstart

Our default development tool and package manager is `yarn`. To get going, start the docker container with the postgres image. You'll also need an updated .env file.  
Run

```
docker compose -f docker-compose.yml up -d --build --remove-orphans
```

then run `yarn run build` at least once  
Then to get the webapp running, run `yarn run dev`. This will first run any migrations, and then start the application.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc.
> :warning: this is not active yet, but a planned section when deployment begins.


### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
# redditat
