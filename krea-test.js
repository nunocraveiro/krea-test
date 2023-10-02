const fs = require('fs');

const boards = [];
const boardsWon = [];

// read txt file
const fileInput = !fs.existsSync('input.txt') ? console.log("File not found") : fs.readFileSync('input.txt', 'utf8').split(/\n/g).filter(el => el);

// populate an array with the draw numbers
const getDrawNums = input => input[0].match(/\d+/g);

// populate an array of boards, each board is a Map with key-value pairs in the format: (number, [coordinates, 0 or 1 meaning unmarked or marked])
const populateBoards = input => {
    let board = new Map();
    let rowLetter = 'A';
    for (let row of input) {
        const numArr = row.match(/\d+/g);
        numArr.forEach((num, index) => board.set(num, [`${rowLetter}${index++}`, 0]));
        rowLetter = String.fromCharCode(rowLetter.charCodeAt(0) + 1);
        if (board.size === 25) {
            boards.push(board);
            board = new Map();
            rowLetter = 'A';
        }
    }
}

// check if a board wins
const checkWin = (board, x, y) => {
    let counterX = 0;
    let counterY = 0;
    for (let [key, value] of board) {
        if (value[0].includes(x) && value[1] === 1) counterX++;
        if (value[0].includes(y) && value[1] === 1) counterY++;
        if (counterX === 5 || counterY === 5) return true;
    }
}

// runs the bingo game
const runBingo = markedNums => {
    for (let markedNum of markedNums) {
        for (let i=0; i<boards.length; i++) {
            if (boards[i].has(markedNum)) {
                const numCoords = boards[i].get(markedNum)[0];
                boards[i].set(markedNum, [numCoords, 1]);
                if (checkWin(boards[i], numCoords[0], numCoords[1])) {
                    boardsWon.push({board: boards[i], winNum: markedNum});
                    boards.splice(i, 1);
                    i--;
                }
            }
        }
        if (boards.length === 0) return;
    }
}

// calculates the score for a board
const calculateScore = board => {
    let sum = 0;
    board.board.forEach((value, key) => {
        if (value[1] === 0) sum+=Number(key);
    })
    return sum*Number(board.winNum);
}

populateBoards(fileInput.slice(1));
runBingo(getDrawNums(fileInput));

console.log(calculateScore(boardsWon[boardsWon.length-1]));
