"use client"

import React, { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import WalletComponent from './WalletComponent';
import EthersRPC from '../services/EthersRPC';

import { createEventPost } from '@/app/services/rollupService';

const CreateEventForm: React.FC = () => {
    const wallet = useContext(WalletContext);
    const [formData, setFormData] = useState({
        name: '',
        startAt: '',
        endAt: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet?.account) return;
        if (!wallet?.provider) return;

        try {
            // Create message using CreateEvent schema
            const message = {
                name: formData.name,
                startAt: new Date(formData.startAt).getTime(),
                endAt: new Date(formData.endAt).getTime()
            };

            const signature = await EthersRPC.signMessage(wallet.provider, 'createEvent', message);

            console.log('signature', signature);
            // Send to rollupService
            const response = await createEventPost({
                inputs: message,
                signature,
                msgSender: wallet.account
            });

            console.log('Event created:', response);
            // Handle success (e.g., show a success message, reset form, etc.)
        } catch (error) {
            console.error('Error creating event:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <>
            <WalletComponent />
            {wallet?.loggedIn && (
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full animate-in fade-in zoom-in'>
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
                        <label htmlFor='name'>Event Name</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            className='p-2 rounded-md text-black bg-beige'
                            placeholder='My Cool Event'
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-3 w-full'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='startAt'>Start Date</label>
                            <input
                                type='date'
                                id='startAt'
                                name='startAt'
                                className='p-2 rounded-md text-black bg-beige'
                                value={formData.startAt}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='endAt'>End Date</label>
                            <input
                                type='date'
                                id='endAt'
                                name='endAt'
                                className='p-2 rounded-md text-black bg-beige'
                                value={formData.endAt}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex gap-6'>
                        <button type="submit" className='special-button'>Create Event Survey</button>
                    </div>
                </form>
            )}
        </>
    );
};

export default CreateEventForm;