// prompt to start game with AI
function initialChessPrompt({ color, move }) {
    const playerColor = chessColor(color);
    const computerColor = chessColor(color === "w" ? "b" : "w");
    return `Let's play chess. I will play as white and you will play as black. I will suggest a move, and you will suggest a move in response as the game progresses. 
  Only respond with the chess notation of the move that you will make. Do not include any explanation for your move. The response should only return the move, no text before or after.
      
  For example, if it is 'Black' player's (your) move and White (me) has just played the 1st move, then the response should be in the following format:
      
  e.g.
  // White's input
  Move: e4
  
  // Black's response
  Move: e5
  
  In this game, I will play as '${playerColor}', and you will play as '${computerColor}'. 
  
  As an additional instruction, I also do not require that you provide any commentary on whether any of my moves are valid. Only your moves will be validated.
      
  ${
    move
      ? `So, for my first move...
    Move: ${move}`
      : `What is your first move as ${computerColor}? The response should be in the format explained previously`
  }`;
}

// prompt fo next move
const nextMovePrompt = ({ move }) => {
    return `Move: ${move}`;
};