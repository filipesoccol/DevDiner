import Footer from '@/app/components/Footer'
import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import DietaryRestrictionsForm from '@/app/components/DietaryRestrictionsForm'
import { getEventBySlug } from '@/app/services/rollup'
import PieChart from '@/app/components/PieChart'
import { Restrictions } from '@/rollup/src/stackr/state';
import { PieColors, RestrictionLabels } from '@/app/interfaces'
import EventShareLink from '@/app/components/EventShareLink'
import BarChart from '@/app/components/BarChart'

export async function generateMetadata(): Promise<Metadata> {
    const frameTags = await getFrameMetadata(
        `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
    )
    return {
        other: frameTags,
    }
}

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
                <BarChart data={data} total={event.eventWithRestrictions.participantCount} width={350} height={350} />
                <div className="mt-4 text-sm">
                    <h5 className="font-semibold mb-2">Legend:</h5>
                    <ul className="grid grid-cols-2 gap-2">
                        {RestrictionLabels.map((label, index) => (
                            <li key={index} className="flex items-center">
                                <span
                                    className="inline-block w-4 h-4 mr-2"
                                    style={{ backgroundColor: PieColors[index] }}
                                ></span>
                                {label}: {((data[index] / event.eventWithRestrictions.participantCount) * 100).toFixed(1)}%
                            </li>
                        ))}
                    </ul>
                </div>
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