import React from 'react';
import { useRouter } from 'next/navigation';

interface EventCreatedDialogProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
}

const EventCreatedDialog: React.FC<EventCreatedDialogProps> = ({ isOpen, onClose, eventId }) => {
    const router = useRouter();

    const handleConfirm = () => {
        onClose();
        router.push(`/event/${eventId}`);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 backdrop-blur-sm flex">
                <dialog open={isOpen} className="p-6 rounded-lg shadow-lg bg-black text-beige">
                    <h2 className="text-2xl font-bold mb-4">Event Created Successfully!</h2>
                    <p className="mb-6">Your event has been created. Click the button below to view the event page.</p>
                    <div className='bg-black rounded-full pb-2'>
                        <button
                            onClick={handleConfirm}
                            className="special-button bg-orange w-full"
                        >
                            Go to Event Page
                        </button>
                    </div>
                </dialog>
            </div>
        )
    );
};

export default EventCreatedDialog;