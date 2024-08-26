import { State } from "@stackr/sdk/machine";
import { solidityPackedKeccak256 } from "ethers";

export enum Restrictions {
  GLUTEN_FREE = 0b1,
  LACTOSE_FREE = 0b1 << 1,
  LOW_SUGAR = 0b1 << 2,
  LOW_SODIUM = 0b1 << 3,
  KOSHER = 0b1 << 4,
  HALAL = 0b1 << 5,
  FODMAPS = 0b1 << 6,
}

export type Event = {
  id: number;
  name: string;
  modifiedAt: number;
  startAt: number;
  endAt: number;
  participants: string[];
};

export type Developer = {
  address: string;
  modifiedAt: number;
  restrictions: number;
};

export type BaseState = {
  developers: Developer[];
  events: Event[];
}

export class DevDinerState extends State<BaseState> {
  constructor(state: BaseState) {
    super(state);
  }

  // Here since the state is simple and doesn't need wrapping, we skip the transformers to wrap and unwrap the state

  // transformer() {
  //   return {
  //     wrap: () => this.state,
  //     unwrap: (wrappedState: number) => wrappedState,
  //   };
  // }

  getRootHash() {
    return solidityPackedKeccak256(["uint256"], [this.state]);
  }
}
