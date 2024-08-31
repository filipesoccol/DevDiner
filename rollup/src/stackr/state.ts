import { State } from "@stackr/sdk/machine";
import { hexlify, keccak256, solidityPackedKeccak256, ZeroHash } from "ethers";
import { MerkleTree } from "merkletreejs";

export enum Restrictions {
  GLUTEN_FREE = 0b1,
  LACTOSE_FREE = 0b1 << 1,
  LOW_SUGAR = 0b1 << 2,
  LOW_SODIUM = 0b1 << 3,
  KOSHER = 0b1 << 4,
  HALAL = 0b1 << 5,
  FODMAPS = 0b1 << 6,
}

export type Developer = {
  address: string;
  modifiedAt: number;
  restrictions: number;
};

export type Event = {
  id: string;
  name: string;
  modifiedAt: number;
  startAt: number;
  endAt: number;
  cancelledAt: number;
  participants: string[];
};

export type DevDiner = {
  developers: Developer[];
  events: Event[];
};

class DevDinerWrapper {
  public merkletreeDevelopers: MerkleTree;
  public merkletreeEvents: MerkleTree;

  public events: Event[];
  public developers: Developer[];

  constructor(developers: Developer[], events: Event[]) {
    let { merkletreeDevelopers, merkletreeEvents } = this.createTree(
      developers,
      events
    );

    this.merkletreeDevelopers = merkletreeDevelopers;
    this.merkletreeEvents = merkletreeEvents;

    this.events = events;
    this.developers = developers;
  }

  createTree(developers: Developer[], events: Event[]) {
    const hashedLeavesDevelopers = developers.map((leaf: Developer) => {
      return solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [leaf.address, leaf.modifiedAt, leaf.restrictions]
      );
    });

    let merkletreeDevelopers = new MerkleTree(hashedLeavesDevelopers);
    const hashedLeavesEvents = events.map((leaf: Event) => {
      return solidityPackedKeccak256(
        ["string", "string", "uint256", "uint256", "uint256", "uint256", "address[]"],
        [leaf.id, leaf.name, leaf.modifiedAt, leaf.startAt, leaf.endAt, leaf.cancelledAt, leaf.participants]
      );
    });
    let merkletreeEvents = new MerkleTree(hashedLeavesEvents);
    return { merkletreeDevelopers, merkletreeEvents };
  }
}

export class DevDinerState extends State<DevDiner, DevDinerWrapper> {
  constructor(state: DevDiner) {
    super(state);
  }

  transformer(): {
    wrap: () => DevDinerWrapper;
    unwrap: (wrappedState: DevDinerWrapper) => DevDiner;
  } {
    return {
      wrap: () => {
        return new DevDinerWrapper(
          this.state.developers,
          this.state.events
        );
      },
      unwrap: (wrappedState: DevDinerWrapper) => {
        return {
          developers: wrappedState.developers,
          events: wrappedState.events,
        };
      },
    };
  }

  getRootHash() {
    // if (this.state.developers.length === 0 && this.state.events.length === 0) {
    //   return ZeroHash;
    // }
    // return new MerkleTreeWrapper(this.state).merkleTree.getRoot();
    return solidityPackedKeccak256(
      ["bytes", "bytes"],
      [
        this.transformer().wrap().merkletreeDevelopers.getHexRoot(),
        this.transformer().wrap().merkletreeEvents.getHexRoot(),
      ]
    );
  }
}
