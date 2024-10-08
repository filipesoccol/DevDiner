// createEvent function parameter
interface CreateEventParams {
    inputs: {
        name: string;
        startAt: number;
        endAt: number;
    };
    signature: string;
    msgSender: string;
}

// New interfaces for other schemas
interface SetMyRestrictionsParams {
    inputs: {
        event: string;
        restrictions: number;
        timestamp: number;
    };
    signature: string;
    msgSender: string;
}

interface UpdateEventParams {
    inputs: {
        id: string;
        cancelledAt: number;
        timestamp: number;
        participants: string; // Assuming BYTES is represented as a hex string
    };
    signature: string;
    msgSender: string;
}

// New generic type for all possible params
type RollupParams = CreateEventParams | SetMyRestrictionsParams | UpdateEventParams;

// New generic function to handle all types of requests
export const rollupPost = async <T extends RollupParams>(endpoint: string, params: T) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROLLUP_URL}/submit-action/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in rollup request to ${endpoint}:`, error);
        throw error;
    }
};


// Type definition for the event data returned by getEventBySlug
export type EventWithRestrictions = {
    success: boolean;
    eventWithRestrictions: {
        id: string;
        name: string;
        startAt: number;
        endAt: number;
        cancelledAt: number;
        modifiedAt: number;
        restrictionsSum: {
            [key: string]: number;
        };
        participantCount: number;
    };
};

// Function to get event information by slug
export const getEventBySlug = async (slug: string) => {
    console.log(`${process.env.NEXT_PUBLIC_ROLLUP_URL}/event/${slug}?${Date.now()}`);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROLLUP_URL}/event/${slug}?${Date.now()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json() as EventWithRestrictions;
    } catch (error) {
        console.error(`Error fetching event with slug ${slug}:`, error);
        throw error;
    }
};

// Type definition for the summary data returned by getSummary
export type SummaryData = {
    success: boolean;
    summary: {
        total: number;
        restrictionsSum: {
            [key: string]: number;
        };
    };
};

// Function to get summary information related to entire database
export const getSummary = async (): Promise<SummaryData> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROLLUP_URL}/summary?${Date.now() / 1000}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {

            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as SummaryData;
    } catch (error) {
        console.error('Error fetching summary:', error);
        throw error;
    }
};


// Example usage:
// const createEventResult = await rollupPost('createEvent', createEventParams);
// const setRestrictionsResult = await rollupPost('setMyRestrictions', setMyRestrictionsParams);
// const updateEventResult = await rollupPost('updateEvent', updateEventParams);