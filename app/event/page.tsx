import Image from 'next/image'
import CreateEventForm from '../components/CreateEventForm'
import Link from 'next/link'
import Footer from '../components/Footer'

const CreateEvent = () => {

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
                <h1 className='border-b-2 border-orange self-end w-full text-right text-xl'><b>Create your event</b></h1>
            </div>
            <div className='flex flex-col bg-orange text-beige gap-4 w-100 p-6 items-center' >
                <p>Connect your wallet then fill the form. After that you will be served with some links to share on your social networks. No transaction is required to create the event.</p>
                <CreateEventForm></CreateEventForm>
            </div>
            <hr className='w-full border-solid border-orange border self-end' />
            <Footer />
        </div>
    )
}

export default CreateEvent;