import { ActionConfirmationStatus, ActionSchema } from "@stackr/sdk";
import { HDNodeWallet, solidityPackedKeccak256, Wallet } from "ethers";
import { mru } from "./stackr/mru.ts";
import { CreateEvent, SetMyRestrictions } from "./stackr/schemas.ts";
import { signMessage } from "./utils.ts";
import { timeStamp } from "console";
import MerkleTree from "merkletreejs";


const main = async () => {
  mru.init()

  // Create a random wallet
  const wallets = new Array(100).fill(0).map(() => Wallet.createRandom());

  new MerkleTree(
    [
      "0xeb4142ed0559140c26c848e86f0afc8f883713200769bbd5fc9c751bbe8b2912",
      "0x249e098be492cbe52e106998269ab3708327f3dc7af463aef142b2ea633944ee"
    ]
  );

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
    console.log(ack.hash);

    // leverage the ack to wait for C1 and access logs & error from STF execution
    const res = await ack.waitFor(ActionConfirmationStatus.C1);
    console.log(res);
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
    console.log(ack.hash);

    // leverage the ack to wait for C1 and access logs & error from STF execution
    const res = await ack.waitFor(ActionConfirmationStatus.C1);
    // console.log(res);
    // await new Promise((r) => setTimeout(r, 5000));
  }



};

main();


