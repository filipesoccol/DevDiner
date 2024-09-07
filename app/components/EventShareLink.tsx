'use client'

import React, { useEffect, useState } from 'react';

interface EventShareLinkProps {
    slug: string;
}

const EventShareLink: React.FC<EventShareLinkProps> = ({ slug }) => {
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        setShareUrl(`${typeof window !== 'undefined' ? window.location.origin : ''}/event/${slug}`);
    }, [slug]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
    };

    return (
        <div className="flex flex-col items-center">
            <p className="text-beige mb-2">Share this event with others:</p>
            <div className="flex items-center bg-beige text-black px-4 py-2 rounded">
                {shareUrl ? (
                    <span className="mr-2 text-xs font-mono break-all">{shareUrl}</span>
                ) : (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-4"></div>
                )}
                <button
                    onClick={copyToClipboard}
                    className="bg-orange text-beige px-2 py-1 rounded hover:bg-opacity-80 transition-colors"
                >
                    Copy
                </button>
            </div>
        </div>
    );
};

export default EventShareLink;