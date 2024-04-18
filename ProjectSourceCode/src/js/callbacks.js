//Callbacks .js. This file contains the functions that are called when various js files need to communicate

// FROM means the file will call it
// TO means the file will be called by that function 
//
//
//

//This function is called when a peice has moved, white or black
//MovesArray is an array of all the moves that have been made in the game
//IndexOfMove is the index of the move that has been made in the movesArray
//To find the moved one you can check the moves array at the index of the move
/*  {
    "color": "WHITE",
    "piece": "PAWN",
    "from": "E2",
    "to": "E4",
    "rating": 3
  },
  */
function ChessHandlerFROM_PieceMoved(movesArray, indexOfMove){

}

//Peice color can be of White - "WHITE" , Black - "BLACK"
//Peice position is the position of the peice on the board - in "E2" format
//Peice type can be of Pawn - "PAWN", Rook - "ROOK", Knight - "KNIGHT", Bishop - "BISHOP", Queen - "QUEEN", King - "KING"
function ChessHandlerTO_MovePiece(peiceColor, peicePosition, peiceType){

}

//Game type can be of Player vs Player - "PVP" , Player vs AI - "PVAI" , AI vs AI - "AIVAI"
//Player difficulty can be of Easy - "EASY", Medium - "MEDIUM", Hard - "HARD"
function ChessHandlerFROM_GameStarted(gameType, playerDifficulty){

}

