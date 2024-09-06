import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { machine, APPID } from "./machine";
import { CreateEvent, schemas, SetMyRestrictions, UpdateEvent } from "./schemas";
import { Playground } from "@stackr/sdk/plugins";
import express, { Request, Response } from "express";
import cors from "cors";
import { verifyMessage, verifyTypedData } from "ethers";

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

app.get("/getTypes/:action", (req: Request, res: Response) => {
  const { action } = req.params;
  console.log(action)
  if (action in schemas) {
    const eip712Types = schemas[action as keyof typeof schemas].EIP712TypedData.types;
    return res.send({ eip712Types });
  }
  return res.status(400).send({ error: "Invalid action" });
});

// Adding Real functions
app.get("/root-hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  // const event = state?.events.find((e) => e.fid === Number(fid));
  const root = state?.stateRootHash;
  return res.send({ root });
});

app.post("/set-restriction", async (req: Request, res: Response) => {
  try {
    const { inputs, signature, address } = req.body;

    const setMyRestrictions = SetMyRestrictions.actionFrom({
      inputs,
      signature,
      msgSender: address,
    });

    const ack = await mru.submitAction("setMyRestrictions", setMyRestrictions);
    console.log(ack.hash);

    res.status(200).json({ success: true, hash: ack.hash });
  } catch (error) {
    console.error("Error in set-my-restrictions:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post("/create-event", async (req: Request, res: Response) => {
  try {
    const { inputs, signature, msgSender } = req.body;

    const domain = {
      name: "DevDiner v0",
      version: "1",
      verifyingContract: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" as `0x${string}`,
    }

    const eip712Types = schemas['createEvent'].EIP712TypedData.types;

    const signerAddr = await verifyTypedData(domain, eip712Types, inputs, signature);
    if (signerAddr !== msgSender) {
      console.log("Invalid signature")
    } else {
      console.log("Valid signature")
    }

    const createEvent = CreateEvent.actionFrom({
      inputs,
      signature,
      msgSender,
    });

    const ack = await mru.submitAction("createEvent", createEvent);
    console.log(ack.hash);

    res.status(200).json({ success: true, hash: ack.hash });
  } catch (error) {
    console.error("Error in create-event:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.listen(5050, () => {
  console.log("listening on port 5050");
});

export { mru };

