import { ActionSchema, SolidityType } from "@stackr/sdk";

export const SetMyRestrictions = new ActionSchema("setMyRestrictions", {
  event: SolidityType.STRING,
  restrictions: SolidityType.UINT,
  timestamp: SolidityType.UINT
});

export const CreateEvent = new ActionSchema("createEvent", {
  name: SolidityType.STRING,
  startAt: SolidityType.UINT,
  endAt: SolidityType.UINT
});

export const UpdateEvent = new ActionSchema("updateEvent", {
  id: SolidityType.STRING,
  cancelledAt: SolidityType.UINT,
  timestamp: SolidityType.UINT,
  participants: SolidityType.BYTES
});

export const schemas = {
  createEvent: CreateEvent,
  setMyRestrictions: SetMyRestrictions,
  updateEvent: UpdateEvent
}