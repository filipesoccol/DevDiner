import Footer from '@/app/components/Footer'
import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
    const frameTags = await getFrameMetadata(
        `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
    )
    return {
        other: frameTags,
    }
}

const Event = () => {

    const data = [20, 10, 15, 30, 5, 5, 5, 5];
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
                <h2 className='border-b-2 border-orange self-end w-full text-right'>Create your event</h2>
            </div>
            <div className='flex flex-col  gap-4 w-100 p-6 items-center' >
                <p>Connect your wallet then fill the form. After that you will be served with some links to share on your social networks. No transaction is required to create the event.</p>
            </div>
            <hr className='w-full border-solid border-orange border self-end' />
            <Footer />
        </div>
    )
}

export default Event;