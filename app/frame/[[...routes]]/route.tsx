/** @jsxImportSource frog/jsx */

// import { domain } from '@/app/services/EthersRPC'
import { getEventBySlug } from '@/app/services/rollup'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

export const domain = {
  name: "DevDiner v0",
  version: "1",
  chainId: 11155111,
  verifyingContract: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" as `0x${string}`,
}

type State = {
  eventName: string,
  eventSlug: string,
  participantCount: number,
  restrictionsSum: number[],
}

const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/frame',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  title: 'Dev Diner Frame',
  initialState: {
    eventName: '',
    eventSlug: '',
    participantCount: 0,
    restrictionsSum: [],
  }
})

// Uncomment to use Edge Runtime
export const runtime = 'edge'

app.frame('/:slug', async (c) => {
  const { deriveState } = c
  const slug = c.req.param('slug');
  const event = await getEventBySlug(slug);
  const data = event.eventWithRestrictions.restrictionsSum;
  const state = deriveState(previousState => {
    previousState.eventName = event.eventWithRestrictions.name;
    previousState.eventSlug = slug;
    previousState.participantCount = event.eventWithRestrictions.participantCount;
    previousState.restrictionsSum = Object.values(event.eventWithRestrictions.restrictionsSum);
  })
  return c.res({
    action: `/finish/${slug}`,
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Event Name: {state.eventName}
        Participants: {data.participantCount}
      </div>
    ),
    intents: [
      <Button.Signature target="/sign" >Sign</Button.Signature >,
    ]
  })
})

app.frame('/finish/', async (c) => {

  const { transactionId, deriveState } = c
  const state = deriveState()
  const event = await getEventBySlug(state.eventSlug);

  const data = Object.values(event.eventWithRestrictions.restrictionsSum);

  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Signature: {JSON.stringify(data)}
      </div>
    )
  })
})

app.signature('/sign/', async (c) => {

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_ROLLUP_URL}/get-types/setMyRestrictions`
  // );
  // const types = await response.json();
  // console.log(types.eip712Types);

  // return c.signTypedData({
  //   chainId: 'eip155:11155111',
  //   domain,
  //   types: {
  //     setMyRestrictions: {
  //       event: 'string',
  //       restrictions: 'uint256',
  //       timestamp: 'uint256'
  //     }
  //   },
  //   primaryType: 'setMyRestrictions',
  //   message: {
  //     from: {
  //       event: 'my-nice-event',
  //       restriction: 32,
  //       timestamp: Date.now(),
  //     },
  //   },
  // })
  return c.signTypedData({
    chainId: 'eip155:11155111',
    domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    types: {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
        { name: 'balance', type: 'uint256' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    primaryType: 'Mail',
    message: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        balance: BigInt(0),
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        balance: BigInt(0),
      },
      contents: 'Hello, Bob!',
    },
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
