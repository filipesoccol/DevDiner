import { STF, Transitions } from "@stackr/sdk/machine";
import { DevDinerState } from "./state";

const increment: STF<DevDinerState> = {
  handler: ({ state, emit }) => {
    state += 1;
    emit({ name: "ValueAfterIncrement", value: state });
    return state;
  },
};

const decrement: STF<DevDinerState> = {
  handler: ({ state, emit }) => {
    state -= 1;
    emit({ name: "ValueAfterDecrement", value: state });
    return state;
  },
};

export const transitions: Transitions<DevDinerState> = {
  increment,
  decrement,
};
