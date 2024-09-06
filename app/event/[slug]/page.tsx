import Footer from '@/app/components/Footer'
import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import DietaryRestrictionsForm from '@/app/components/DietaryRestrictionsForm'
import { getEventBySlug } from '@/app/services/rollup'
import PieChart from '@/app/components/PieChart'

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

    console.log(event)
    const data = [20, 10, 15, 30, 5, 10, 5, 5];
    const colors = ['#40AABF', '#8AB34C', '#D6BF29', '#DB4439', '#40AABF', '#8AB34C', '#D6BF29', '#DB4439'];
    const labels = ['Gluten Free', 'Dairy Free', 'Sugar Free', 'Vegan', 'Kosher', 'Halal', 'Food allergies', 'Low Sodium'];

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
                <h2 className='border-b-2 border-orange self-end w-full text-right'>{event.eventWithRestrictions.name}</h2>
            </div>
            <div className='flex flex-col bg-orange gap-4 w-100 p-6 items-center' >
                <div className="text-center text-sm mb-4 text-beige">
                    This event starts at: {new Date(event.eventWithRestrictions.startAt).toLocaleString()}, and ends at: {new Date(event.eventWithRestrictions.endAt).toLocaleString()}. Number of participants in this survey currently is {event.eventWithRestrictions.participants.length}. {event.eventWithRestrictions.cancelledAt ? `This event was cancelled on ${new Date(event.eventWithRestrictions.cancelledAt).toLocaleString()}.` : ''}
                </div>
                <div>Select here your food restrictions and submit.</div>
                <DietaryRestrictionsForm slug={slug} />
            </div>
            <hr className='w-full border-solid border-orange border self-end' />
            <div className='flex flex-col bg-orange gap-4 w-100 p-6 items-center' >
                <h4 className="text-xl font-semibold mb-2">Dietary Restrictions for this event</h4>
                <PieChart data={data} colors={colors} labels={labels} width={600} height={400} />
            </div>
            <hr className='w-full border-solid border-orange border self-end' />
            <Footer />
        </div>
    )
}

export default Event;