const axios = require('axios');

// Set your OpenAI API key
const apiKey = 'sk-proj-dQp4n6PykG7nWjsBYs5HT3BlbkFJ206YJX5UlMPDI5uQ4Fow';

// Function to send a prompt to OpenAI API
async function sendMessage(prompt) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci/completions',
            {
                prompt: prompt,
                max_tokens: 150
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error:', error.response.data);
        return null;
    }
}

// Example usage
async function main() {
    const prompt = "Q: How do you make a JavaScript file? \nA:";
    const response = await sendMessage(prompt);
    console.log(response);
}

// Run the main function
main();