import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { machine, APPID } from "./machine";
import { CreateEvent, SetMyRestrictions, UpdateEvent } from "./schemas";
import { Playground } from "@stackr/sdk/plugins";
import express, { Request, Response } from "express";


// INITIALIZING EXPRESS
const app = express();
app.use(express.json());

// INITIALIZING MICRO-ROLLUP
const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [SetMyRestrictions, CreateEvent, UpdateEvent],
  stateMachines: [machine]
});

type DevDiner = typeof machine;
await mru.init();
const { actions, chain, events } = mru;
const state = mru.stateMachines.get<DevDiner>(APPID);

// ADDING PLAYGROUND FUNCTIONS
if (process.env.NODE_ENV === "development") {
  const playground = Playground.init(mru);

  playground.addGetMethod(
    "/custom/developers",
    async (_req: Request, res: Response) => {
      return res.send(state?.state.developers);
    }
  );

  playground.addGetMethod(
    "/custom/events",
    async (_req: Request, res: Response) => {
      return res.send(state?.state.events);
    }
  );
}

// Adding Real functions
app.get("/root-hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  // const event = state?.events.find((e) => e.fid === Number(fid));
  const root = state?.stateRootHash;
  return res.send({ root });
});

app.listen(5050, () => {
  console.log("listening on port 5050");
});

export { mru };
