/** @jsxImportSource frog/jsx */

import { getEventBySlug } from '@/app/services/rollup'
import { Button, Frog } from 'frog'
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
  imageOptions: {
    width: 320,
    height: 240,
  },
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
  const slug = c.req.param('slug');
  const event = await getEventBySlug(slug);
  const data = event.eventWithRestrictions;
  return c.res({
    image: (
      <div style={{ background: '#F1E7DB', color: '#2C263D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, padding: 10, height: '100%' }}>
        <div style={{ display: 'flex' }}>Join us at {data.name}</div>
        <div style={{ display: 'flex', fontSize: 10 }}>Participants: {data.participantCount}</div>
      </div>
    ),
    intents: [
      <Button.Redirect location={`https://devdiner.filipe.contact/event/${slug}`}>Go To {data.name}</Button.Redirect>,
    ]
  })
})

export const GET = handle(app)
export const POST = handle(app)
