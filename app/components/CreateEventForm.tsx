"use client"

import React, { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import WalletComponent from './WalletComponent';
import EthersRPC from '../services/EthersRPC';
import EventCreatedDialog from './EventCreatedDialog';

import { rollupPost } from '@/app/services/rollup';

const CreateEventForm: React.FC = () => {
    const wallet = useContext(WalletContext);
    const [formData, setFormData] = useState({
        name: '',
        startAt: '',
        endAt: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [createdEventId, setCreatedEventId] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('')
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet?.account || !wallet?.provider) return;

        setIsSubmitting(true);
        try {

            const actionName = 'createEvent';
            // Create message using CreateEvent schema
            const message = {
                name: formData.name,
                startAt: new Date(formData.startAt).getTime(),
                endAt: new Date(formData.endAt).getTime()
            };

            const signature = await EthersRPC.signMessage(wallet.provider, actionName, message);

            console.log('signature', signature);
            // Send to rollupService
            const response = await rollupPost(actionName, {
                inputs: message,
                signature,
                msgSender: wallet.account
            });

            console.log('Event created:', response);

            // Assuming the response includes the created event's ID
            setCreatedEventId(response.confirmation.logs[0].value);
            setIsDialogOpen(true);

        } catch (error) {
            console.error('Error creating event:', error);
            setError('Error creating event. Please try again with a different name.')
        } finally {
            setIsSubmitting(false);
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
                        <button
                            type="submit"
                            className='special-button flex items-center justify-center'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2">Creating...</span>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                </>
                            ) : (
                                error ? 'Retry' : 'Create Event Survey'
                            )}
                        </button>
                        {error && (
                            <div className="text-beige text-xs rounded p-2 max-w-60 animate-pulse">
                                {error}
                            </div>
                        )}
                    </div>
                </form>
            )}
            <EventCreatedDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                eventId={createdEventId}
            />
        </>
    );
};

export default CreateEventForm;