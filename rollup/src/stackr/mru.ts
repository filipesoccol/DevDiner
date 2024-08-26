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

type SurveyMachine = typeof machine;
await mru.init();

// ADDING PLAYGROUND FUNCTIONS
if (process.env.NODE_ENV === "development") {
  const playground = Playground.init(mru);

  playground.addGetMethod(
    "/custom/hello",
    async (_req: Request, res: Response) => {
      res.json({
        message: "Hello from the custom route",
      });
    }
  );
}

const { actions, chain, events } = mru;
const state = mru.stateMachines.get<SurveyMachine>(APPID);

app.get("/event/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  const event = state?.events.find((e) => e.fid === Number(fid));
  return res.send({ userScore });
});

export { mru };
