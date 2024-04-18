const OpenAI = require('openai');
const OPENAI_API_KEY = `${process.env.API_KEY}`;

const axios = require('axios');

async function prompt(playerMove) {
    const prompt = `Let's simulate playing a game of chess! In this game, we will take turns saying our move, in the format: piece, start position, end position. Please separate the information only with a comma and do not say anything other than the three pieces of information I mentioned.\n\n${playerMove}`;

    if(invalidString != "")
        prompt_text += `\n\n${invalidString}\n\nThe previous move attempt was invalid due to no piece being present at the specified start square or the move was not legal. The valid moves are [${validMoves}]. Please suggest a new move:`;


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
        body: JSON.stringify(data)
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', data, config);
        const jsonResponse = response.data;
        let move = jsonResponse.choices[0].text.trim();
        
        // check that move is legal
        // let moveResult = 

        if (moveResult === null) {
            /* if move was not legal, prompt chatgpt saying 
                "The previous move attempt was invalid due to no piece being present at the specified start square 
                or the move was not legal. The valid moves are [${validMoves}]. Please suggest a new move:" */
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

module.exports = { prompt };
