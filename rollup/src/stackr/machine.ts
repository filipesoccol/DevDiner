import { StateMachine } from "@stackr/sdk/machine";
import * as genesisState from "../../genesis-state.json";
import { DevDinerState } from "./state";
import { transitions } from "./transitions";

const APPID = 'dev-diner'

const machine = new StateMachine({
  id: APPID,
  stateClass: DevDinerState,
  initialState: genesisState,
  on: transitions,
});

export { machine, APPID };
