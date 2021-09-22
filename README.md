# qc-spice

Name is subject to change.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Tech Stack (versions)

- [Node LTS](https://nodejs.org/en/) (14.17.6 as of Sept 2021)
- [npm LTS](https://docs.npmjs.com/cli/v7/configuring-npm/install) (7.24.0 as of Sept 2021)  

The following will be installed when you run `npm install` or `npm ci`:
- [React 17.0.2](https://reactjs.org/)
- [Next.js 11.1.2](https://nextjs.org/)
- [ReactFlow 9.6.7](https://reactflow.dev/)
- [SASS 1.42.0](https://sass-lang.com/)
- [TypeScript 4.4.3](https://www.typescriptlang.org/)

## Environment Setup

You can use any editor/IDE and operating system you'd like. There are some steps to take to ensure that all development environments are the same:

### EditorConfig

[EditorConfig](https://editorconfig.org/) is a tool that standardizes settings across editors. Some editors have native support and will automatically detect the `.editorconfig` file in this repository. Others need extensions or plug-ins to be installed. Check the EditorConfig webpage to see what your editor of choice needs.

### Node version management 

A helpful tool for managing Node installations is [nvm](https://github.com/nvm-sh/nvm). This repository has a `.nvmrc` file that nvm can use. You'll just have to run `nvm install-latest-npm` in addition, to ensure you have npm 7.

### Prettier and ESLint

Linters to enforce code styles. [Prettier](https://prettier.io/) is a code formatter focusing mostly on "syntactic sugar," while [ESLint](https://eslint.org/) is a linter that enforces best coding practices and statically analyzes your code for errors.  
Both are installed with `npm install` or `npm ci`, but you can configure your editor so that Prettier runs on save, and that ESLint runs as you code.


## Getting Started

In the root folder (where you are now), run
```
npm ci
```
for a clean installation of the Node packages needed for this project. Then you're ready to run the app.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

