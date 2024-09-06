"use client"

import React, { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import WalletComponent from './WalletComponent';
import EthersRPC from '../services/EthersRPC';
import { rollupPost } from '@/app/services/rollup';
import { Restrictions } from '@/rollup/src/stackr/state';

interface DietaryRestrictionsFormProps {
    slug: string;
}

const DietaryRestrictionsForm: React.FC<DietaryRestrictionsFormProps> = ({ slug }) => {
    const wallet = useContext(WalletContext);
    const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const restrictions = [
        'Gluten Free', 'Dairy Free', 'Sugar Free', 'Vegan',
        'Kosher', 'Halal', 'Food allergies', 'Low Sodium'
    ];

    const handleRestrictionToggle = (restriction: string) => {
        setSelectedRestrictions(prev =>
            prev.includes(restriction)
                ? prev.filter(r => r !== restriction)
                : [...prev, restriction]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet?.account || !wallet?.provider) return;

        setIsSubmitting(true);
        try {
            const actionName = 'setMyRestrictions';

            // Encode restrictions to binary
            const encodedRestrictions = selectedRestrictions.reduce((acc, restriction) => {
                switch (restriction) {
                    case 'Gluten Free': return acc | Restrictions.GLUTEN_FREE;
                    case 'Dairy Free': return acc | Restrictions.LACTOSE_FREE;
                    case 'Sugar Free': return acc | Restrictions.LOW_SUGAR;
                    case 'Low Sodium': return acc | Restrictions.LOW_SODIUM;
                    case 'Kosher': return acc | Restrictions.KOSHER;
                    case 'Halal': return acc | Restrictions.HALAL;
                    case 'Food allergies': return acc | Restrictions.FODMAPS;
                    default: return acc;
                }
            }, 0);

            const message = {
                event: slug,
                restrictions: encodedRestrictions,
                timestamp: Date.now()
            };

            const signature = await EthersRPC.signMessage(wallet.provider, actionName, message);

            const response = await rollupPost(actionName, {
                inputs: message,
                signature,
                msgSender: wallet.account
            });

            console.log('Dietary restrictions submitted:', response);
            // Handle success (e.g., show a success message, reset form, etc.)
        } catch (error) {
            console.error('Error submitting dietary restrictions:', error);
            // Handle error (e.g., show error message to user)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <WalletComponent />
            {wallet?.loggedIn && (
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full animate-in fade-in zoom-in'>
                    <div className='flex flex-wrap gap-2'>
                        {restrictions.map((restriction) => (
                            <button
                                key={restriction}
                                type="button"
                                onClick={() => handleRestrictionToggle(restriction)}
                                className={`p-2 rounded-md ${selectedRestrictions.includes(restriction)
                                    ? 'bg-green text-white'
                                    : 'bg-beige text-black'
                                    }`}
                            >
                                {restriction}
                            </button>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className='special-button flex items-center justify-center'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="mr-2">Submitting...</span>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            </>
                        ) : (
                            'Submit Dietary Restrictions'
                        )}
                    </button>
                </form>
            )}
        </>
    );
};

export default DietaryRestrictionsForm;