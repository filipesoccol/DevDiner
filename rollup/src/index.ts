import { ActionConfirmationStatus } from "@stackr/sdk";
import { Wallet } from "ethers";
import { mru } from "./stackr/mru.ts";
import { CreateEvent, SetMyRestrictions } from "./stackr/schemas.ts";
import { signMessage } from "./utils.ts";



const main = async () => {
  mru.init()

  // Create a random wallet
  const wallets = new Array(2).fill(0).map(() => Wallet.createRandom());

  for (const e of ['My Nice Event', 'My Nice Event 2', 'My Nice Event 3']) {
    const inputs = {
      name: e,
      startAt: new Date(2024, 10, 1).getTime(),
      endAt: new Date(2025, 0, 1).getTime(),
    };

    const signature = await signMessage(wallets[0], CreateEvent, inputs);
    const createEvent = CreateEvent.actionFrom({
      inputs: inputs,
      signature: signature,
      msgSender: wallets[0].address,
    });
    const ack = await mru.submitAction("createEvent", createEvent);

    // leverage the ack to wait for C1 and access logs & error from STF execution
    const res = await ack.waitFor(ActionConfirmationStatus.C1);
  }

  let nonce = Date.now();
  for (const w of wallets) {
    const inputs = {
      event: 'my-nice-event',
      restrictions: 64, // Math.floor(Math.random() * 64),
      timestamp: nonce++,
    };

    const signature = await signMessage(w, SetMyRestrictions, inputs);
    const setMyRestrictions = SetMyRestrictions.actionFrom({
      inputs,
      signature,
      msgSender: w.address,
    });

    const ack = await mru.submitAction("setMyRestrictions", setMyRestrictions);

    // leverage the ack to wait for C1 and access logs & error from STF execution
    const res = await ack.waitFor(ActionConfirmationStatus.C1);
  }



};

main();


