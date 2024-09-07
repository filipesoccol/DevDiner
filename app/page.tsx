import Image from 'next/image'

import Link from 'next/link';
import Footer from './components/Footer';
import { getSummary } from './services/rollup';

import BarChart from './components/BarChart';
import RestrictionLegend from './components/RestrictionLegend';

export default async function Home() {

  const randomImage = () => {
    const images = ['/image1.png', '/image2.png', '/image3.png', '/image4.png'];
    const randomIndex = Math.floor(Math.random() * images.length);
    return `url(${images[randomIndex]})`;
  }

  const { summary } = await getSummary();
  const backgroundImage = randomImage();

  const data = Object.values(summary.restrictionsSum);

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
        <h1 className=''>Current {summary.total} tracked restrictions</h1>
        <BarChart data={data} total={summary.total} />
        <RestrictionLegend data={data} total={summary.total} />
      </div>
      <hr className='w-full border-solid border-orange border self-end' />
      <Footer />
    </div>
  )
}
