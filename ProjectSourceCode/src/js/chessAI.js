const OpenAI = require('openai');
const OPENAI_API_KEY = `${process.env.API_KEY}`;

const axios = require('axios');

async function prompt(playerMove) {
    const prompt = `Let's simulate playing a game of chess! In this game, we will take turns saying our move, in the format: piece, start position, end position. Please separate the information only with a comma and do not say anything other than the three pieces of information I mentioned.\n\n${playerMove}`;

    const data = {
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 1,
        max_tokens: 64,
        top_p: 1,
        frequency_penalty: 0.6,
        presence_penalty: 0.6,
    };

    const options = {
        method: 'POST',
        url: 'https://api.openai.com/v1/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        data: data
    };

    try {
        const response = await axios(options);
        const chatGPTResponse = response.data.choices[0].text.trim();
        return chatGPTResponse;
    } catch (error) {
        console.error("Error while calling OpenAI API:", error);
        return null;
    }
}

module.exports = { prompt };
