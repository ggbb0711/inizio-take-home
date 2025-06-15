require('dotenv').config()

exports.handler = async (event) => {
    try {
        // Get query parameter from URL
        const searchQuery = event.queryStringParameters.q;
        
        if (!searchQuery) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing search query parameter' })
            };
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CX;
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${searchQuery}`);        
        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data' }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};
