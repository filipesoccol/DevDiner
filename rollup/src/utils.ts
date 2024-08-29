import { ActionSchema, AllowedInputTypes } from "@stackr/sdk";
import { HDNodeWallet } from "ethers";
import { SetMyRestrictions } from "./stackr/schemas.ts";

export const signMessage = async (
  wallet: HDNodeWallet,
  schema: ActionSchema,
  payload: AllowedInputTypes
) => {
  const signature = await wallet.signTypedData(
    schema.domain,
    schema.EIP712TypedData.types,
    payload
  );
  return signature;
};
