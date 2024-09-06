import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { machine, APPID } from "./machine";
import { CreateEvent, schemas, SetMyRestrictions, UpdateEvent } from "./schemas";
import { Playground } from "@stackr/sdk/plugins";
import express, { Request, Response } from "express";
import cors from "cors";
import { verifyTypedData } from "ethers";
import { Restrictions } from "./state";

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

app.get("/event/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!state || !state.state || !state.state.events) {
      return res.status(500).json({ success: false, error: "State is not initialized" });
    }

    const event = state.state.events.find((e) => e.id === slug);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    // Calculate the sum of restrictions for developers participating in this event
    const restrictionsSum = state.state.developers
      .filter(dev => event.participants.includes(dev.address))
      .reduce((sum, dev) => {
        return {
          GLUTEN_FREE: sum.GLUTEN_FREE + (dev.restrictions & Restrictions.GLUTEN_FREE ? 1 : 0),
          LACTOSE_FREE: sum.LACTOSE_FREE + (dev.restrictions & Restrictions.LACTOSE_FREE ? 1 : 0),
          LOW_SUGAR: sum.LOW_SUGAR + (dev.restrictions & Restrictions.LOW_SUGAR ? 1 : 0),
          LOW_SODIUM: sum.LOW_SODIUM + (dev.restrictions & Restrictions.LOW_SODIUM ? 1 : 0),
          KOSHER: sum.KOSHER + (dev.restrictions & Restrictions.KOSHER ? 1 : 0),
          HALAL: sum.HALAL + (dev.restrictions & Restrictions.HALAL ? 1 : 0),
          FODMAPS: sum.FODMAPS + (dev.restrictions & Restrictions.FODMAPS ? 1 : 0),
        };
      }, {
        GLUTEN_FREE: 0,
        LACTOSE_FREE: 0,
        LOW_SUGAR: 0,
        LOW_SODIUM: 0,
        KOSHER: 0,
        HALAL: 0,
        FODMAPS: 0,
      });

    const eventWithRestrictions = {
      ...event,
      restrictionsSum,
    };
    return res.status(200).json({ success: true, eventWithRestrictions });
  } catch (error) {
    console.error(`Error fetching event with slug ${req.params.slug}:`, error);
    return res.status(500).json({ success: false, error: "Internal server error" });
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

