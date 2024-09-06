import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { machine, APPID } from "./machine";
import { CreateEvent, schemas, SetMyRestrictions, UpdateEvent } from "./schemas";
import { Playground } from "@stackr/sdk/plugins";
import express, { Request, Response } from "express";
import cors from "cors";
import { verifyTypedData } from "ethers";

// INITIALIZING EXPRESS
const app = express();
app.use(express.json());
app.use(cors());

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

app.get("/get-types/:action", (req: Request, res: Response) => {
  const { action } = req.params;
  console.log(action)
  if (action in schemas) {
    const eip712Types = schemas[action as keyof typeof schemas].EIP712TypedData.types;
    return res.send({ eip712Types });
  }
  return res.status(400).send({ error: "Invalid action" });
});

app.post("/submit-action/:schemaName", async (req: Request, res: Response) => {
  try {
    const { schemaName } = req.params;
    const { inputs, signature, msgSender } = req.body;

    if (!(schemaName in schemas)) {
      return res.status(400).json({ success: false, error: "Invalid schema name" });
    }

    const schema = schemas[schemaName as keyof typeof schemas];
    const action = schema.actionFrom({
      inputs,
      signature,
      msgSender,
    });

    const ack = await mru.submitAction(schemaName, action);

    res.status(200).json({ success: true, hash: ack.hash });
  } catch (error) {
    console.error(`Error in submit-action for schema ${req.params.schemaName}:`, error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

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

