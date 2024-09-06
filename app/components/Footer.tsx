import Image from 'next/image';

export default function Footer() {
    return (
        <div className='flex flex-col md:flex-row w-full'>
            <div className='flex flex-col gap-2 w-full md:w-1/2 p-2 min-h-40 items-center'>
                <h1 className=''>created by</h1>
                <a href="https://filipe.contact" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/creator.png"
                        alt="Creator Avatar"
                        width={80}
                        height={80}
                        priority
                    />
                </a>
            </div>
            <div className='flex flex-col gap-2 w-full md:w-1/2 p-2 min-h-40 items-center'>
                <h1 className=''>powered by</h1>
                <div className='flex gap-4 items-center'>
                    <div className='bg-orange rounded-full w-16 h-16 flex items-center justify-center'>
                        <a href="https://www.stackrlabs.xyz/" target="_blank" rel="noopener noreferrer">
                            <div className='w-10 h-10 relative'>
                                <Image
                                    src="/stackr-logo.svg"
                                    alt="Stackr Logo"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>
                        </a>
                    </div>
                    <div className='bg-orange rounded-full w-16 h-16 flex items-center justify-center'>
                        <a href="https://web3auth.io/" target="_blank" rel="noopener noreferrer">
                            <div className='w-10 h-10 relative'>
                                <Image
                                    src="/web3auth-logo.svg"
                                    alt="Web3Auth Logo"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}