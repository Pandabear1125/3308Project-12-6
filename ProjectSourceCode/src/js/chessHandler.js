// const fetch = require('node-fetch');

const BOARD_WIDTH = 8;  //width = 50*8 = 400 pixels
const BOARD_HEIGHT = 8;
const TILE_SIZE = 100; //in pixels 400/8 = 50 pixels 800/8 = 100 pixels

let WHITE_TILE_COLOR = "rgb(240, 217, 181)";
let BLACK_TILE_COLOR = "rgb(181, 136, 99 )";
let HIGHLIGHT_COLOR_FOCUS = "rgba(255, 255, 255,1)";
let HIGHLIGHT_COLOR_TAKE = "rgba(255, 99, 99,.9)";

let HIGHLIGHT_DOT_COLOR = "rgba(22, 22, 22,.9)";//color(255,5,5);// rgba(166, 166, 166,.9);
let HIGHLIGHT_DOT_RADIUS = 7;

const WHITE = 0;
const BLACK = 1;

const PLAYER = 'player';
const COMPUTER = 'computer';

const EMPTY = -1;

const PAWN = 0;
const KNIGHT = 1;
const BISHOP = 2;
const ROOK = 3;
const QUEEN = 4;
const KING = 5;

const INVALID = 0;
const VALID = 1;
const VALID_CAPTURE = 2;

let blackPieceImages = [];
let whitePieceImages = [];

const piecesCharacters = {
    0: '♙',
    1: '♘',
    2: '♗',
    3: '♖',
    4: '♕',
    5: '♔'
};

//Route to get chess pieces or make them ourselfs. 
let chessCanvas;
let chess2dContext;
let currentTeamText;
let whiteCasualitiesText;
let blackCasualitiesText;
let totalVictoriesText;

let board;
let currentTeam;
let GAME_STARTED = false;

let curX;
let curY;

let whiteCasualities;
let blackCasualities;

let whiteVictories;
let blackVictories;

let fen = "";

let blackCheck = false;
let whiteCheck = false;

document.addEventListener("DOMContentLoaded", onLoad);

function getURLPlayType(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
let playType = getURLPlayType('play-type');
// console.log("playType:", playType);

function onLoad() {
    chessCanvas = document.getElementById("chessCanvas");
    chess2dContext = chessCanvas.getContext("2d");
    chessCanvas.addEventListener("click", onClick);
    chessCanvas.addEventListener("mouseleave", onLeave);

    currentTeamText = document.getElementById("currentTeamText");

    whiteCasualitiesText = document.getElementById("whiteCasualities");
    blackCasualitiesText = document.getElementById("blackCasualities");

    totalVictoriesText = document.getElementById("totalVictories");
    whiteVictories = 0;
    blackVictories = 0;

}

function loadChessPieceImages(){
  
    const pieceNames = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
  
    // Load black chess piece images
    for (const piece of pieceNames) {
      const img = new Image();
      img.src = `../resources/img/svgs/basic-set/black_${piece}.svg`;
      img.addEventListener('load', function(){
        reRenderBoard();
    });
      blackPieceImages.push(img);
    }

    for (const piece of pieceNames) {
        const img = new Image();
        img.src = `../resources/img/svgs/basic-set/white_${piece}.svg`;
        img.addEventListener('load', function(){
            reRenderBoard();
        });
        whitePieceImages.push(img);
      }
};

function getPieceImages() {
    loadChessPieceImages();
}

function startGame() {

    let btt = document.getElementById("startGameButton");
    btt.hidden = true;

    board = new Board();
    curX = -1;
    curY = -1;
    
    currentTeam = WHITE;
    currentTeamText.textContent = "White's turn";

    whiteCasualities = [0, 0, 0, 0, 0];
    blackCasualities = [0, 0, 0, 0, 0];

    getPieceImages();
    reRenderBoard();
    updateWhiteTakes();
    updateBlackTakes();
    updateTotalVictories();

    GAME_STARTED = true;

    ChessHandler_GameStarted();
}

function endGame(){
    GAME_STARTED = false;
    let btt = document.getElementById("startGameButton");
    btt.hidden = false;
    currentTeamText.textContent = "Game Over";
    ChessHandler_GameEnded();
}

function onLeave(){
    curX = -1;
    curY = -1;
    
    if (GAME_STARTED){
        reRenderBoard();
    }
}

function onClick(event) {
    if (playType === PLAYER || (playType === COMPUTER && currentTeam === WHITE) ){
        console.log(playType)
        if (GAME_STARTED === false) {
            return;
        }

        let chessCanvasX = chessCanvas.getBoundingClientRect().left;
        let chessCanvasY = chessCanvas.getBoundingClientRect().top;

        let x = Math.floor((event.clientX - chessCanvasX) / TILE_SIZE);
        let y = Math.floor((event.clientY - chessCanvasY) / TILE_SIZE);

        // console.log('x:', x);
        // console.log('y:', y);

        if (checkValidMovement(x, y) === true) {
            if (checkValidCapture(x, y) === true) {
                if (blackCheck === true) {

                } else if (whiteCheck === true) {

                }
                if (board.tiles[y][x].pieceType === KING) {
                    if (currentTeam === WHITE) 
                        whiteVictories++;
                    else 
                        blackVictories++;

                    endGame();
                    return;
                }


                if (currentTeam === WHITE) {
                    blackCasualities[board.tiles[y][x].pieceType]++;
                    updateBlackTakes();
                } else {
                    whiteCasualities[board.tiles[y][x].pieceType]++;
                    updateWhiteTakes();
                }
            }
            fen = moveSelectedPiece(x, y);
            changeCurrentTeam();
            reRenderBoard();

            if (playType === "computer" && currentTeam === BLACK) {
                // console.log(playType)
                handleComputerMove();
            }

        } else {
            curX = x;
            curY = y;
            reRenderBoard();
        }
    }
}

function parseMove(moveString) {
    if (!/^([a-h][1-8]){2}$/.test(moveString)) {
        throw new Error('Invalid move string');
    }

    const source = moveString.slice(0, 2);
    const destination = moveString.slice(2, 4);

    return [source, destination];
}


async function handleComputerMove() {
    try {
        console.log('called handleComputerMove');
        // example: fen = "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b - -"; 
        console.log("fen:", fen);

        // if chess-api.com is not working, redirect to "Player vs Player"
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, 2500);
        });

        timeoutPromise.catch((error) => {
            console.log("Chess API is not responding. Redircting to 'Player vs Player' mode...")
            window.location.href = '/game?game-type=standard&play-type=player';
        });

        const response = await fetch(`http://localhost:3000/aiResponse?fen=${encodeURIComponent(fen)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const aiMove = data.move;
    
        // example: should be d7d5
        console.log('AI Move:', aiMove); 

        const [source, destination] = parseMove(aiMove);

        // update the board state to reflect the AI's move
        const sourceX = source.charCodeAt(0) - 97; // convert file from letter to index
        const sourceY = 8 - parseInt(source[1]);  // convert rank from number to index
        const x = destination.charCodeAt(0) - 97;
        const y = 8 - parseInt(destination[1]);

        // console.log('source x:', sourceX);
        // console.log('source y:', sourceY);
        // console.log('x:', x);
        // console.log('y:', y);


        if (board.tiles[y][x].pieceType === KING) {
            if (currentTeam === WHITE) {
                whiteVictories++;
            } else {
                blackVictories++;
            }
            startGame();
        }

                
        if (currentTeam === WHITE) {
            blackCasualities[board.tiles[y][x].pieceType]++;
            updateBlackTakes();
        } else {
            whiteCasualities[board.tiles[y][x].pieceType]++;
            updateWhiteTakes();
        }
        fen = moveAIPiece(sourceX, sourceY, x, y);
            
        changeCurrentTeam();
        
        reRenderBoard();
    } catch (error) {
        console.error("Error:", error);
    }
}

function checkPossiblePlays() {
    if (curX < 0 || curY < 0) return;

    let tile = board.tiles[curY][curX];
    if (tile.team === EMPTY || tile.team !== currentTeam) return;

    drawTile(curX, curY, HIGHLIGHT_COLOR_FOCUS);

    board.resetValidMoves();

    if (tile.pieceType === PAWN) checkPossiblePlaysPawn(curX, curY);
    else if (tile.pieceType === KNIGHT) checkPossiblePlaysKnight(curX, curY);
    else if (tile.pieceType === BISHOP) checkPossiblePlaysBishop(curX, curY);
    else if (tile.pieceType === ROOK) checkPossiblePlaysRook(curX, curY);
    else if (tile.pieceType === QUEEN) checkPossiblePlaysQueen(curX, curY);
    else if (tile.pieceType === KING) checkPossiblePlaysKing(curX, curY);
}

function checkPossiblePlaysPawn(curX, curY) {
    let direction;

    if (currentTeam === WHITE) direction = -1;
    else direction = 1;

    if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

    // Advance one tile
    checkPossibleMove(curX, curY + direction);

    // First double move
    if (curY === 1 || curY === 6) {
        checkPossibleMove(curX, curY + 2 * direction);
    }

    // Check diagonal left capture
    if (curX - 1 >= 0) checkPossibleCapture(curX - 1, curY + direction);

    // Check diagonal right capture
    if (curX + 1 <= BOARD_WIDTH - 1) checkPossibleCapture(curX + 1, curY + direction);
}

function checkPossiblePlaysKnight(curX, curY) {
    // Far left moves
    if (curX - 2 >= 0) {
        // Upper move
        if (curY - 1 >= 0) checkPossiblePlay(curX - 2, curY - 1);

        // Lower move
        if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 2, curY + 1);
    }

    // Near left moves
    if (curX - 1 >= 0) {
        // Upper move
        if (curY - 2 >= 0) checkPossiblePlay(curX - 1, curY - 2);

        // Lower move
        if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 2);
    }

    // Near right moves
    if (curX + 1 <= BOARD_WIDTH - 1) {
        // Upper move
        if (curY - 2 >= 0) checkPossiblePlay(curX + 1, curY - 2);

        // Lower move
        if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 2);
    }

    // Far right moves
    if (curX + 2 <= BOARD_WIDTH - 1) {
        // Upper move
        if (curY - 1 >= 0) checkPossiblePlay(curX + 2, curY - 1);

        // Lower move
        if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 2, curY + 1);
    }
}

function checkPossiblePlaysRook(curX, curY) {
    // Upper move
    for (let i = 1; curY - i >= 0; i++) {
        if (checkPossiblePlay(curX, curY - i)) break;
    }

    // Right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
        if (checkPossiblePlay(curX + i, curY)) break;
    }

    // Lower move
    for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
        if (checkPossiblePlay(curX, curY + i)) break;
    }

    // Left move
    for (let i = 1; curX - i >= 0; i++) {
        if (checkPossiblePlay(curX - i, curY)) break;
    }
}

function checkPossiblePlaysBishop(curX, curY) {
    // Upper-right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
        if (checkPossiblePlay(curX + i, curY - i)) break;
    }

    // Lower-right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1; i++) {
        if (checkPossiblePlay(curX + i, curY + i)) break;
    }

    // Lower-left move
    for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
        if (checkPossiblePlay(curX - i, curY + i)) break;
    }

    // Upper-left move
    for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
        if (checkPossiblePlay(curX - i, curY - i)) break;
    }
}

function checkPossiblePlaysQueen(curX, curY) {
    checkPossiblePlaysBishop(curX, curY);
    checkPossiblePlaysRook(curX, curY);
}

function checkPossiblePlaysKing(curX, curY) {
    for (let i = -1; i <= 1; i++) {
        if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

        for (let j = -1; j <= 1; j++) {
            if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
            if (i == 0 && j == 0) continue;

            checkPossiblePlay(curX + j, curY + i);
        }
    }
}

function checkPossiblePlay(x, y) {
    if (checkPossibleCapture(x, y)) return true;

    return !checkPossibleMove(x, y);
}

function checkPossibleMove(x, y) {
    if (x < 0 || x > BOARD_WIDTH - 1 || y < 0 || y > BOARD_HEIGHT - 1) return false;
    if (board.tiles[y][x].team !== EMPTY) return false;

    board.validMoves[y][x] = VALID;
    drawCircle(x, y, HIGHLIGHT_DOT_COLOR);
    return true;
}

function checkPossibleCapture(x, y) {
    if (board.tiles[y][x].team !== getOppositeTeam(currentTeam)) return false;
    if (board.tiles[y][x].pieceType === KING){  
        setKingCap();
    }
    board.validMoves[y][x] = VALID_CAPTURE;
    drawCorners(x, y, HIGHLIGHT_COLOR_TAKE);
    return true;
}

function setKingCap(){
    if (currentTeam === WHITE) {
        whiteCheck = false;
        blackCheck = true;
    } else {
        whiteCheck = true;
        blackCheck = false
    }
}

function checkValidMovement(x, y) {
    if (x < 0 || x > BOARD_WIDTH - 1 || y < 0 || y > BOARD_HEIGHT - 1) return false;

    if (board.validMoves[y][x] === VALID || board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function checkValidCapture(x, y) {
    if (board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function generateFEN(board) {
    let fenString = '';
    let activeColor = ''; // Assume White is the active color by default

  
    // Loop through rows
    for (let y = 0; y < 8; y++) {
      let emptyCount = 0;
  
      // Loop through columns
      for (let x = 0; x < 8; x++) {
        const tile = board.tiles[y][x];
  
        if (tile.pieceType != EMPTY) {

          if (emptyCount > 0) {
            fenString += emptyCount;
            emptyCount = 0;
          }

          let pieceChar = tile.pieceType;
          if (pieceChar === PAWN){
            pieceChar = 'p';
          } else if (pieceChar === KNIGHT){
            pieceChar = 'n';
            } else if (pieceChar === BISHOP){
            pieceChar = 'b';
            } else if (pieceChar === ROOK){
            pieceChar = 'r';
            } else if (pieceChar === QUEEN){
            pieceChar = 'q';
            } else if (pieceChar === KING){
            pieceChar = 'k';
            }
          
            if (tile.team === WHITE) {
              pieceChar = pieceChar.toUpperCase();
            }

          fenString += pieceChar;

        } else {

          emptyCount++;

        }
      }
  
      if (emptyCount > 0) {
        fenString += emptyCount;
      }
  
      if (y < 7) {
        fenString += '/';
      }
    }
    console.log(currentTeam);

    if (currentTeam === WHITE) {
        console.log('White is the active color');
        activeColor = 'b';
      } else {
        console.log('black is the active color');

        activeColor = 'w'; 
      }

    // Add active color component
    fenString += ' ' + activeColor;
  
    fenString += ' - -';
  
    return fenString;
  }

function moveSelectedPiece(x, y) {
    board.tiles[y][x].pieceType = board.tiles[curY][curX].pieceType;
    board.tiles[y][x].team = board.tiles[curY][curX].team;
    board.tiles[curY][curX].pieceType = EMPTY;
    board.tiles[curY][curX].team = EMPTY;

    const fenPosition = generateFEN(board,x,y);
    console.log(fenPosition); // Output: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

    curX = -1;
    curY = -1;
    board.resetValidMoves();
    return fenPosition;
}

async function moveAIPiece(sourceX, sourceY, x, y) {
    board.tiles[y][x].pieceType = board.tiles[sourceY][sourceX].pieceType;
    board.tiles[y][x].team = board.tiles[sourceY][sourceX].team;
    board.tiles[sourceY][sourceX].pieceType = EMPTY;
    board.tiles[sourceY][sourceX].team = EMPTY;

    const fenPosition = generateFEN(board,x,y);
    console.log(fenPosition); // Output: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

    drawBoard();
    drawPieces();

    curX = -1;
    curY = -1;
    board.resetValidMoves();
    return fenPosition;
}

function changeCurrentTeam() {
    if (currentTeam === WHITE) {
        currentTeamText.textContent = "Black's turn";
        currentTeam = BLACK;
    } else {
        currentTeamText.textContent = "White's turn";
        currentTeam = WHITE;
    }

    ChessHandler_TeamChange(currentTeam);
}

function reRenderBoard() {
    drawBoard();
    checkPossiblePlays();
    drawPieces();
}

function drawBoard() {
    chess2dContext.fillStyle = WHITE_TILE_COLOR;
    chess2dContext.fillRect(0, 0, BOARD_WIDTH * TILE_SIZE, BOARD_HEIGHT * TILE_SIZE);

    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            if ((i + j) % 2 === 1) {
                drawTile(j, i, BLACK_TILE_COLOR);
            }
        }
    }
}

function drawTile(x, y, fillStyle) {
    chess2dContext.fillStyle = fillStyle;
    chess2dContext.fillRect(TILE_SIZE * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
}

function drawCircle(x, y, fillStyle) {
    chess2dContext.fillStyle = fillStyle;
    chess2dContext.beginPath();
    chess2dContext.arc(TILE_SIZE * (x + 0.5), TILE_SIZE * (y + 0.5), HIGHLIGHT_DOT_RADIUS, 0, 2 * Math.PI);
    chess2dContext.fill();
}

function drawCorners(x, y, fillStyle) {
    chess2dContext.fillStyle = fillStyle;

    chess2dContext.beginPath();
    chess2dContext.moveTo(TILE_SIZE * x, TILE_SIZE * y);
    chess2dContext.lineTo(TILE_SIZE * x + 15, TILE_SIZE * y);
    chess2dContext.lineTo(TILE_SIZE * x, TILE_SIZE * y + 15);
    chess2dContext.fill();

    chess2dContext.beginPath();
    chess2dContext.moveTo(TILE_SIZE * (x + 1), TILE_SIZE * y);
    chess2dContext.lineTo(TILE_SIZE * (x + 1) - 15, TILE_SIZE * y);
    chess2dContext.lineTo(TILE_SIZE * (x + 1), TILE_SIZE * y + 15);
    chess2dContext.fill();

    chess2dContext.beginPath();
    chess2dContext.moveTo(TILE_SIZE * x, TILE_SIZE * (y + 1));
    chess2dContext.lineTo(TILE_SIZE * x + 15, TILE_SIZE * (y + 1));
    chess2dContext.lineTo(TILE_SIZE * x, TILE_SIZE * (y + 1) - 15);
    chess2dContext.fill();

    chess2dContext.beginPath();
    chess2dContext.moveTo(TILE_SIZE * (x + 1), TILE_SIZE * (y + 1));
    chess2dContext.lineTo(TILE_SIZE * (x + 1) - 15, TILE_SIZE * (y + 1));
    chess2dContext.lineTo(TILE_SIZE * (x + 1), TILE_SIZE * (y + 1) - 15);
    chess2dContext.fill();
}

function drawPieces() {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            if (board.tiles[i][j].team === EMPTY) continue;

            let pieceType = board.tiles[i][j].pieceType;

            if (board.tiles[i][j].team === WHITE) {
                chess2dContext.drawImage(whitePieceImages[pieceType], TILE_SIZE * j, TILE_SIZE * i, TILE_SIZE, TILE_SIZE);
            } else {
                chess2dContext.drawImage(blackPieceImages[pieceType], TILE_SIZE * j, TILE_SIZE * i, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function updateWhiteTakes() {
    updateCasualities(whiteCasualities, whiteCasualitiesText);
}

function updateBlackTakes() {
    updateCasualities(blackCasualities, blackCasualitiesText);
}

function updateCasualities(casualities, text) {
    let none = true;

    for (let i = QUEEN; i >= PAWN; i--) {
        if (casualities[i] === 0) continue;

        if (none) {
            text.textContent = casualities[i] + " "+ piecesCharacters[i];
            none = false;
        } else {
            text.textContent += " - " + casualities[i]+ " " + piecesCharacters[i];
        }
    }

    if (none) text.textContent = "None";
}

function updateTotalVictories() {
    totalVictoriesText.textContent = "Games won: white " + whiteVictories + " - black " + blackVictories;
}

function getOppositeTeam(team) {
    if (team === WHITE) return BLACK;
    else if (team === BLACK) return WHITE;
    else return EMPTY;
}


class Board {
    constructor() {
        this.tiles = [];

        this.tiles.push([
            new Tile(ROOK, BLACK),
            new Tile(KNIGHT, BLACK),
            new Tile(BISHOP, BLACK),
            new Tile(QUEEN, BLACK),
            new Tile(KING, BLACK),
            new Tile(BISHOP, BLACK),
            new Tile(KNIGHT, BLACK),
            new Tile(ROOK, BLACK)
        ]);

        this.tiles.push([
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK)
        ]);

        for (let i = 0; i < 4; i++) {
            this.tiles.push([
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
            ]);
        }

        this.tiles.push([
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE)
        ]);

        this.tiles.push([
            new Tile(ROOK, WHITE),
            new Tile(KNIGHT, WHITE),
            new Tile(BISHOP, WHITE),
            new Tile(QUEEN, WHITE),
            new Tile(KING, WHITE),
            new Tile(BISHOP, WHITE),
            new Tile(KNIGHT, WHITE),
            new Tile(ROOK, WHITE)
        ]);

        this.validMoves = [];
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            this.validMoves.push([
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID
            ]);
        }
    }

    resetValidMoves() {
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            for (let j = 0; j < BOARD_WIDTH; j++) {
                this.validMoves[i][j] = INVALID;
            }
        }
    }
}

class Tile {
    constructor(pieceType, team) {
        this.pieceType = pieceType;
        this.team = team;
    }
}