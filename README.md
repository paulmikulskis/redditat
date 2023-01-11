# Redditat

### The main Typescript monorepo for Yungsten Tech

This monorepo contains a variety of packages, applications, and pieces of documentation that all relate and import from one another.

You will find applications that belong to the YouTube Spam Control group such as the NextJS landing page for https://spamcntrl.com, or packages such as @yungsten/utils, containing useful utility functions that have been built up over time accross personal and professional projects.

This main README goes over some basics of this monorepo, but also includes other ancillary technologies that APIs, apps, or packages inside this monorepo might interact with.

## Quickstart

The monorepo is built using [turborepo](https://turbo.build/repo/docs/handbook/what-is-a-monorepo).

To check and make sure your system can install and run everything, do the following:

```bash
yarn install # does for every app in '/apps' and pkg in '/packages'
yarn install # once more just to make sure everything is linked
yarn build # runs 'yarn build' in each '/apps' + '/packages'
```

<hr>

## Continuous Integration and Deployment

We heavily rely on GitHub Actions and Docker (like most) for CI/CD.

Typically, GitHub Actions will build the Docker images using GitHub Secrets for environment variables. The Docker image will then be pushed to our private registry at `registry.yungstentech.com`

> if you want to see images that are floating around, check out our UI at https://registryui.yungstentech.com. Note that we are still porting one or two projects over to the private registry.

Once the our private registry has the new `:latest` image, the GitHub action will SSH into the node that is running the application or docker-compose stack, and deploy it.

> We plan to move to Ansible in the future using composable Actions, but for now this is how it's done

Once an administrator up an account for you, you can check the status of processes at https://healthchecks.yungstentech.com

> :warning: There are some projects that packages or applications in this monorepo interact with such as the YouTube Spam Core API, which deploys on GCP Cloud Run. Ancillary deploy processes like this will soon all be migrates to use the standard GitHub Actions deploy.

<hr>

## BaaS Providers and Databases

As this is a monorepo and includes several applications, we have several backends that you might be interacting with.

- the spamcntrl landing page uses Firebase for its DB, Auth, etc..
- the spamcntrl Core API (though not in this repo yet) uses Firebase
- the prisma package and database package uses Supabase for Auth and Postgresql
- the dyana application uses Supabase
- we use AWS for random things and will expand into AWS as needed (i.e. the _gravitiny_ project)

## Manually Testing, Interacting

The first thing many would want to do with these supposed apps, APIs, etc, is _touch them!_

Contact a maintainer to add you to one of our Postman Collections.

## Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete.

## Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save.
