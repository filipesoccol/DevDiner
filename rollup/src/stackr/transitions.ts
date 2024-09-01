import { STF, Transitions } from "@stackr/sdk/machine";
import { DevDinerState } from "./state";
import { slugifyString } from "./utils";

const setMyRestrictions: STF<DevDinerState> = {
  handler: ({ inputs, state, msgSender, emit }) => {
    const event = state.events.find((event) => event.id === inputs.event)
    if (!event) throw new Error(`Event with name ${inputs.event} not found`);

    if (!event.participants.find((p) => p === msgSender))
      event.participants.push(msgSender);

    state.developers.push({
      address: msgSender,
      modifiedAt: inputs.timestamp,
      restrictions: inputs.restrictions,
    });
    emit({ name: "Added Developer", value: msgSender });
    return state;
  },
};

const createEvent: STF<DevDinerState> = {
  handler: ({ inputs, state, emit }) => {

    const id = slugifyString(inputs.name)
    if (state.events.find((event) => event.id === slugifyString(inputs.name)))
      throw new Error(`Event with name ${inputs.name} already exists`);

    state.events.push({
      id,
      name: inputs.name,
      startAt: inputs.startAt,
      endAt: inputs.endAt,
      cancelledAt: 0,
      modifiedAt: Date.now(),
      participants: [],
    });
    emit({ name: "Event Id", value: id });
    return state;
  },
};


export const transitions: Transitions<DevDinerState> = {
  setMyRestrictions,
  createEvent,
};
