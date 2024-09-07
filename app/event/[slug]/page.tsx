import Footer from '@/app/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import DietaryRestrictionsForm from '@/app/components/DietaryRestrictionsForm'
import { getEventBySlug } from '@/app/services/rollup'
import EventShareLink from '@/app/components/EventShareLink'
import BarChart from '@/app/components/BarChart'
import RestrictionLegend from '@/app/components/RestrictionLegend'


interface EventProps {
    params: { slug: string }
}

async function Event({ params }: EventProps) {
    const { slug } = params;
    const event = await getEventBySlug(slug);

    const data = Object.values(event.eventWithRestrictions.restrictionsSum);

    return (
        <div className="w-full flex flex-col p-4 gap-2">
            <div className='flex gap-4 w-100'>
                <Link href='/'><Image
                    src="/logo.svg"
                    alt="Dev Diner Logo"
                    width={50}
                    height={50}
                    priority
                /></Link>
                <h1 className='border-b-2 border-orange self-end w-full text-right text-xl'><b>{event.eventWithRestrictions.name}</b></h1>
            </div>
            <div className='flex flex-col bg-orange gap-4 w-100 p-6 items-center' >
                <div className="text-center text-sm mb-4 text-beige">
                    This event starts at: {new Date(event.eventWithRestrictions.startAt).toLocaleString()}, and ends at: {new Date(event.eventWithRestrictions.endAt).toLocaleString()}. Number of participants in this survey currently is {event.eventWithRestrictions.participantCount}. {event.eventWithRestrictions.cancelledAt ? `This event was cancelled on ${new Date(event.eventWithRestrictions.cancelledAt).toLocaleString()}.` : ''}
                </div>
                <EventShareLink slug={slug} />
            </div>
            <hr className='w-full border-solid border-orange border self-end' />
            <div className='flex flex-col bg-beige gap-4 w-100 p-6 items-center' >
                <h4 className="text-xl font-semibold mb-2">Dietary Restrictions for {event.eventWithRestrictions.participantCount} participants</h4>
                <BarChart data={data} total={event.eventWithRestrictions.participantCount} />
                <RestrictionLegend data={data} total={event.eventWithRestrictions.participantCount} />
            </div>
            <hr className='w-full border-solid border-orange border self-end' />
            <div className='flex flex-col bg-orange gap-4 w-100 p-6 items-center' >
                <div className='text-beige'>Select here your food restrictions and submit.</div>
                <DietaryRestrictionsForm slug={slug} />
            </div>
            <hr className='w-full border-solid border-orange border self-end' />
            <Footer />
        </div>
    )
}

export default Event;