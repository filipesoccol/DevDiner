import React from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, title, message }) => {
    const handleClose = () => {
        onClose();
        scrollTo(0, 0);
        window.location.reload();
    };

    return (
        isOpen && (

            <div className="fixed inset-0 backdrop-blur-sm flex">
                <dialog open={isOpen} className="p-6 rounded-lg shadow-lg bg-black text-beige">
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    <p className="mb-6">{message}</p>
                    <div className='bg-black rounded-full pb-2'>
                        <button
                            onClick={handleClose}
                            className="special-button bg-orange w-full"
                        >
                            Close
                        </button>
                    </div>
                </dialog>
            </div>
        )
    );
};

export default ConfirmationDialog;