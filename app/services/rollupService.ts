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

export const createEventPost = async (params: CreateEventParams) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROLLUP_URL}/create-event`, {
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
        console.error('Error creating event:', error);
        throw error;
    }
};