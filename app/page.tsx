import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Image from 'next/image'

import PieChart from './components/PieChart';
import Link from 'next/link';
import Footer from './components/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {

  const randomImage = () => {
    const images = ['/image1.png', '/image2.png', '/image3.png', '/image4.png'];
    const randomIndex = Math.floor(Math.random() * images.length);
    return `url(${images[randomIndex]})`;
  }

  const backgroundImage = randomImage();

  const data = [20, 10, 15, 30, 5, 10, 5, 5];
  const colors = ['#40AABF', '#8AB34C', '#D6BF29', '#DB4439', '#40AABF', '#8AB34C', '#D6BF29', '#DB4439'];
  const labels = ['Gluten Free', 'Dairy Free', 'Sugar Free', 'Vegan', 'Kosher', 'Halal', 'Food allergies', 'Low Sodium'];

  return (
    <div className="w-full flex flex-col p-4 gap-2">
      <div className='flex gap-4 w-100'>
        <Link href='/'><Image
          src="/logo.svg"
          alt="Dev Diner Logo"
          width={100}
          height={137}
          priority
        /></Link>
        <hr className='w-full border-solid border-orange border self-end' />
      </div>
      <div className='flex gap-4 w-100 bg-orange text-beige p-6 min-h-60 items-center header-background' style={{ backgroundImage: backgroundImage }} >
        <h1 className='text-2xl md:text-4xl'>Feed your devs<br /> responsibly.</h1>
      </div>
      <hr className='w-full border-solid border-orange border self-end' />
      <div className='flex flex-col bg-orange text-beige gap-4 w-100 p-6 items-center' >
        <p>A project to serve a survey application for collecting developers data related to their diets. This is important to track that data to serve different meal options during in-person events.</p>
        <div className='flex gap-6'>
          <Link href='/event'>
            <div className='bg-black rounded-full pb-2'>
              <button className='special-button'>Create an Event</button>
            </div>
          </Link>
          <div className='bg-black rounded-full pb-2'>
            <button className='special-button'>Browse</button>
          </div>

        </div>
      </div>
      <hr className='w-full border-solid border-orange border self-end' />
      <div className='flex flex-col w-100 gap-4 w-100  text-orange p-2 min-h-40 items-center' >
        <h1 className=''>Current tracked restrictions</h1>
        <PieChart data={data} colors={colors} labels={labels} width={400} height={300} />
      </div>
      <hr className='w-full border-solid border-orange border self-end' />
      <Footer />
    </div>
  )
}
