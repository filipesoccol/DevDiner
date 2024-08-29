import { ActionConfirmationStatus, ActionSchema } from "@stackr/sdk";
import { HDNodeWallet, Wallet } from "ethers";
import { mru } from "./stackr/mru.ts";
import { SetMyRestrictions } from "./stackr/schemas.ts";
import { signMessage } from "./utils.ts";


const main = async () => {
  mru.init()

  // Create a random wallet
  const wallet = Wallet.createRandom();
  const inputs = {
    restrictions: 64,
  };

  const signature = await signMessage(wallet, SetMyRestrictions, inputs);
  const setMyRestrictions = SetMyRestrictions.actionFrom({
    inputs,
    signature,
    msgSender: wallet.address,
  });
  console.log(setMyRestrictions)

  const ack = await mru.submitAction("setMyRestrictions", setMyRestrictions);
  console.log(ack.hash);

  // leverage the ack to wait for C1 and access logs & error from STF execution
  const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1);
  console.log({ logs, errors });

};

main();


