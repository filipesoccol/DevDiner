# DevDiner

A project to provide a survey application for collecting developers data related to their diets. This is important to track that data to serve different meal options during in-person events.

The stack includes Web3Auth for wallet authentication, XMTP tools for users to sign their submissions on Frames and a Micro-rollup backend using Stackr.

Test our [LIVE DEMO](https://devdiner.filipe.contact/)

## Installation Front-end/Frames

```sh
npm install
```

## Installation Stackr Micro-rollups

```sh
curl -fsSL https://bun.sh/install | bash
npm i -g @stackr/cli
```

Access stackr folder:

```sh
cd rollup
cp .env.example .env
```

Fill the required informations inside the `.env` file according to your environment. You can fetch Vulkan RPC and Registry Address [here](https://docs.stf.xyz/build/references/providers-and-rpc/).

For more informations on how to config your app please go [here](https://docs.stf.xyz/build/zero-to-one/build-your-first-mru).

If everything is set and ready just run de micro-rollup using Bun:

```
bun start
```

You can test your rollup in this [playground](https://playground.stf.xyz/)

## Running the app itself

```sh
npm run dev
```

## Running DevTools

In another terminal window you should run

```sh
npx frog dev
```

Inside developer tool head to http://localhost:3000/api

## Navigating the app

To see the default page where you can register events please navigate to the default page http://localhost:3000.
