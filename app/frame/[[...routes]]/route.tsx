/** @jsxImportSource frog/jsx */

import { getEventBySlug } from '@/app/services/rollup'
import { Button, Frog, TextInput } from 'frog'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'

type State = {
  eventName: string,
  eventSlug: string,
  participantCount: number,
  restrictionsSum: number[],
}

const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/frame',
  browserLocation: '/',
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ROLLUP_URL}/get-types/setMyRestrictions`
  );
  const types = await response.json();
  console.log(types.eip712Types);

  return c.signTypedData({
    chainId: 'eip155:11155111',
    domain: {
      name: "DevDiner v0",
      version: "1",
      chainId: 11155111,
      verifyingContract: "0x0000000000000000000000000000000000000000",
      salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    },
    types: {
      setMyRestrictions: {
        event: 'string',
        restrictions: 'uint256',
        timestamp: 'uint256'
      }
    },
    primaryType: 'setMyRestrictions',
    message: {
      from: {
        event: 'my-nice-event',
        restriction: 32,
        timestamp: Date.now(),
      },
    },
  })
})

export const GET = handle(app)
export const POST = handle(app)
