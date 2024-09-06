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

// Example usage:
// const createEventResult = await rollupPost('create-event', createEventParams);
// const setRestrictionsResult = await rollupPost('set-my-restrictions', setMyRestrictionsParams);
// const updateEventResult = await rollupPost('update-event', updateEventParams);