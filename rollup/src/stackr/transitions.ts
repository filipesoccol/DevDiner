import { STF, Transitions } from "@stackr/sdk/machine";
import { DevDinerState } from "./state";

const setMyRestrictions: STF<DevDinerState> = {
  handler: ({ inputs, state, msgSender, emit }) => {
    state.developers.push({
      address: msgSender,
      modifiedAt: Date.now(),
      restrictions: inputs.restrictions,
    });
    emit({ name: "Developers", value: JSON.stringify(state) });
    return state;
  },
};

const createEvent: STF<DevDinerState> = {
  handler: ({ inputs, state, emit }) => {
    state.events.push(inputs);
    // emit({ name: "ValueAfterIncrement", value: state });
    return state;
  },
};


export const transitions: Transitions<DevDinerState> = {
  setMyRestrictions,
  createEvent,
};
