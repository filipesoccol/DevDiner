import { ActionSchema, SolidityType } from "@stackr/sdk";

export const SetMyRestrictions = new ActionSchema("set-my-restrictions", {
  restrictions: SolidityType.UINT,
  timestamp: SolidityType.UINT,
});

export const CreateEvent = new ActionSchema("create-event", {
  name: SolidityType.STRING,
  startAt: SolidityType.UINT,
  endAt: SolidityType.UINT,
  timestamp: SolidityType.UINT,
  participantsHash: SolidityType.BYTES32
});

export const UpdateEvent = new ActionSchema("update-event", {
  startAt: SolidityType.UINT,
  endAt: SolidityType.UINT,
  timestamp: SolidityType.UINT,
  participantsHash: SolidityType.BYTES32
});
