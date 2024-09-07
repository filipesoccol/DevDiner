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

app.get("/summary", async (_req: Request, res: Response) => {
  try {
    if (!state || !state.state || !state.state.developers) {
      return res.status(500).json({ success: false, error: "State is not initialized" });
    }

    const developers = state.state.developers;
    const total = developers.length;

    const restrictionsSum = developers.reduce((sum, dev) => {
      return {
        GlutenFree: sum.GlutenFree + (dev.restrictions & Restrictions.GlutenFree ? 1 : 0),
        DairyFree: sum.DairyFree + (dev.restrictions & Restrictions.DairyFree ? 1 : 0),
        SugarFree: sum.SugarFree + (dev.restrictions & Restrictions.SugarFree ? 1 : 0),
        LowSodium: sum.LowSodium + (dev.restrictions & Restrictions.LowSodium ? 1 : 0),
        Kosher: sum.Kosher + (dev.restrictions & Restrictions.Kosher ? 1 : 0),
        Halal: sum.Halal + (dev.restrictions & Restrictions.Halal ? 1 : 0),
        Vegan: sum.Vegan + (dev.restrictions & Restrictions.Vegan ? 1 : 0),
        Vegetarian: sum.Vegetarian + (dev.restrictions & Restrictions.Vegetarian ? 1 : 0),
      };
    }, {
      GlutenFree: 0,
      DairyFree: 0,
      SugarFree: 0,
      LowSodium: 0,
      Kosher: 0,
      Halal: 0,
      Vegan: 0,
      Vegetarian: 0,
    });

    const summary = {
      total,
      restrictionsSum,
    };

    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
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
          GlutenFree: sum.GlutenFree + (dev.restrictions & Restrictions.GlutenFree ? 1 : 0),
          DairyFree: sum.DairyFree + (dev.restrictions & Restrictions.DairyFree ? 1 : 0),
          SugarFree: sum.SugarFree + (dev.restrictions & Restrictions.SugarFree ? 1 : 0),
          LowSodium: sum.LowSodium + (dev.restrictions & Restrictions.LowSodium ? 1 : 0),
          Kosher: sum.Kosher + (dev.restrictions & Restrictions.Kosher ? 1 : 0),
          Halal: sum.Halal + (dev.restrictions & Restrictions.Halal ? 1 : 0),
          Vegan: sum.Vegan + (dev.restrictions & Restrictions.Vegan ? 1 : 0),
          Vegetarian: sum.Vegetarian + (dev.restrictions & Restrictions.Vegetarian ? 1 : 0),
        };
      }, {
        GlutenFree: 0,
        DairyFree: 0,
        SugarFree: 0,
        LowSodium: 0,
        Kosher: 0,
        Halal: 0,
        Vegan: 0,
        Vegetarian: 0,
      });

    // Calculate the total number of participants
    const participantCount = event.participants.length;

    // Remove the participants array from the event object
    const { participants, ...eventWithoutParticipants } = event;

    // Create the event object with restrictions sum and participant count
    const eventWithRestrictions = {
      ...eventWithoutParticipants,
      restrictionsSum,
      participantCount,
    };

    console.log(eventWithRestrictions)
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

