"use client"

import React, { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import WalletComponent from './WalletComponent';
import EthersRPC from '../services/EthersRPC';
import { rollupPost } from '@/app/services/rollup';
import { Restriction, RestrictionLabels } from '../interfaces';

interface DietaryRestrictionsFormProps {
    slug: string;
}

const DietaryRestrictionsForm: React.FC<DietaryRestrictionsFormProps> = ({ slug }) => {
    const wallet = useContext(WalletContext);
    const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    case Restriction.GlutenFree: return acc | (1 << 0);
                    case Restriction.DairyFree: return acc | (1 << 1);
                    case Restriction.SugarFree: return acc | (1 << 2);
                    case Restriction.LowSodium: return acc | (1 << 3);
                    case Restriction.Kosher: return acc | (1 << 4);
                    case Restriction.Halal: return acc | (1 << 5);
                    case Restriction.Vegan: return acc | (1 << 6);
                    case Restriction.Vegetarian: return acc | (1 << 7);
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-md mx-auto animate-in fade-in zoom-in'>
                    <div className='p-6 rounded-lg'>
                        <div className='space-y-2'>
                            {RestrictionLabels.map((restriction) => (
                                <div key={restriction} className='flex items-center justify-between'>
                                    <span className='text-lg text-beige'>{restriction}</span>
                                    <div className='flex-grow mx-2 border-b border-dotted border-gray-300'></div>
                                    <input
                                        type="checkbox"
                                        checked={selectedRestrictions.includes(restriction)}
                                        onChange={() => handleRestrictionToggle(restriction)}
                                        className='form-checkbox h-5 w-5 text-green'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className='special-button flex items-center justify-center mt-4'
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