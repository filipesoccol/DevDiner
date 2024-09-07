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
        <div style={{ display: 'flex' }}>{data.name}</div>
        <div style={{ display: 'flex', fontSize: 10 }}>Participants: {data.participantCount}</div>
        <div style={{ display: 'flex', flexDirection: 'row', width: '80%', justifyContent: 'flex-start', paddingTop: 5 }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '10%', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
            {Object.entries(data.restrictionsSum).map(([restriction, count]) => (
              <div style={{
                display: 'flex',
                fontSize: '10px',
                height: '15px',
                whiteSpace: 'nowrap',
                textAlign: 'right',
                borderRadius: '15px',
                paddingRight: '20px'
              }}>
                {count ? ((count / data.participantCount) * 100).toFixed(1) : '0.00'}%
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '90%', justifyContent: 'flex-start' }}>
            {Object.entries(data.restrictionsSum).map(([restriction, count], index) => (
              <div key={index} style={{
                width: `${(count / data.participantCount) * 90}%`,
                height: '10px',
                fontSize: '10px',
                backgroundColor: ['#40AABF', '#8AB34C', '#D6BF29', '#DB4439', '#F39C12', '#9B59B6', '#3498DB', '#2ECC71'][index % 8],
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '3px',
                paddingLeft: '5px'
              }}>{restriction}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Redirect location={`https://devdiner.filipe.contact/event/${slug}`}>Go To {data.name}</Button.Redirect>,
    ]
  })
})

export const GET = handle(app)
export const POST = handle(app)
