"use client"

import React, { useContext } from 'react';
import { WalletContext } from './WalletProvider';
import WalletComponent from './WalletComponent';

interface CreateEventProps {
}

const CreateEventForm: React.FC<CreateEventProps> = ({ }) => {

    const wallet = useContext(WalletContext);

    return (
        <>
            <WalletComponent />
            {wallet?.loggedIn && (
                < form className='flex flex-col gap-4 w-full animate-in fade-in zoom-in'>
                    <div className='flex flex-col'>
                        <label htmlFor='eventName'>Event Organizer</label>
                        <input
                            type='text'
                            id='eventName'
                            name='eventName'
                            className='p-2 rounded-md text-black bg-beige'
                            placeholder='My Cool Event'
                            value={wallet?.account || 'Connect your wallet'}
                            disabled
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='eventName'>Event Name</label>
                        <input
                            type='text'
                            id='eventName'
                            name='eventName'
                            className='p-2 rounded-md text-black bg-beige'
                            placeholder='My Cool Event'
                        />
                    </div>
                    <div className='flex gap-3 w-full'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='startDate'>Start Date</label>
                            <input type='date' id='startDate' name='startDate' className='p-2 rounded-md text-black bg-beige' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='endDate'>End Date</label>
                            <input type='date' id='endDate' name='endDate' className='p-2 rounded-md text-black bg-beige' />
                        </div>
                    </div>
                    <div className='flex gap-6'>
                        <button type="submit" className='special-button'>Create Event Survey</button>
                    </div>
                </form >
            )}
        </>
    );
};

export default CreateEventForm;