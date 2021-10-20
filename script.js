const boardElem = document.getElementById('board');
const titleElem = document.querySelector('#title');
const playerTurnElem = document.getElementById('player-turn');
const resetButton = document.getElementById('resetButton');

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//state
let state = {
  currentSymbol: 'X',
  players: ['x', 'o'],
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  gameOver: false,
  hasStarted: false,
};

function setSymbol() {
  if (state.currentSymbol === 'X') {
    state.currentSymbol = 'O';
  } else {
    state.currentSymbol = 'X';
  }
}

function resetState() {
  state.board = [
    { value: '', disabled: false },
    { value: '', disabled: false },
    { value: '', disabled: false },
    { value: '', disabled: false },
    { value: '', disabled: false },
    { value: '', disabled: false },
    { value: '', disabled: false },
    { value: '', disabled: false },
    { value: '', disabled: false },
  ];
  state.players = ['', ''];
  state.currentPlayerIdx = 0;
  state.getCurrentPlayer = () => state.players[state.currentPlayerIdx];
}

//logic
function getRandomNum() {
  return Math.floor(Math.random() * 2);
}

const changeTurn = () => {
  state.currentPlayerIdx = Math.abs(state.currentPlayerIdx - 1);
};

function makeChoice(cellIdx) {
  if (state.currentPlayerIdx === 0) {
    symbol = 'X';
  } else {
    symbol = 'O';
  }
  currentItem = state.board[cellIdx];
  if (currentItem.disabled === false) {
    state.board[cellIdx].value = symbol;
    currentItem.disabled = true;
    changeTurn();
  }
}

function fillSquare(symbol, target) {
  target.innerHTML = symbol;
  checkForWin();
}

function checkForWin(symbol) {
  console.log(state);
  let symbolIndexArray = [];
  for (i = 0; i < state.board.length; i++) {
    if (state.board[i].value === symbol) {
      symbolIndexArray.push(i);
    }
  }
  console.log(symbolIndexArray);
  return winningCombinations.some((arr) => arr.every((val) => symbolIndexArray.includes(val)));
}

function checkDraw() {
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i].value === '') {
      return false;
    }
  }
  return checkForWin(state.currentSymbol) ? false : true;
}

function winningMessage(draw) {
  console.log(draw);
  if (draw) {
    playerTurnElem.innerHTML = 'Draw!';
  } else {
    playerTurnElem.innerHTML = `${state.players[Math.abs(state.currentPlayerIdx - 1)]} Wins!`;
  }
  state.gameOver = true;
}

//render
function renderBoard() {
  boardElem.innerHTML = '';
  for (let i = 0; i < state.board.length; i++) {
    let currentItem = state.board[i];
    let cellElem = document.createElement('div');
    cellElem.classList.add('cell');
    cellElem.innerHTML = currentItem.value;
    cellElem.dataset.index = i;
    boardElem.appendChild(cellElem);
  }
  if (checkForWin(state.currentSymbol)) {
    winningMessage(0);
  } else if (checkDraw()) {
    winningMessage(1);
  }
  setSymbol();
}

const renderPlayer = () => {
  let text;
  if (!state.players[0] || !state.players[1]) {
    text = `
    <input name='player1' placeholder='Enter player1'>
    <input name='player2' placeholder='Enter player2'>
    <button class='start' id='start'>Start Game</button>
    `;
  } else {
    text = `It's currently ${state.getCurrentPlayer()}'s turn`;
  }
  if (!state.gameOver) {
    playerTurnElem.innerHTML = text;
  }
};

const render = () => {
  renderBoard();
  renderPlayer();
};

//events
boardElem.addEventListener('click', function ({ target }) {
  if (state.hasStarted && !state.gameOver) {
    if (target.className === 'cell') {
      // console.log(event.target);
      let cellIdx = target.dataset.index;
      // console.log(cellIdx);
      state.board[cellIdx];
      // state.board[cellIdx].value = '';
      makeChoice(cellIdx);
      render();
    }
  }
});

playerTurnElem.addEventListener('click', function (event) {
  if (event.target.className !== 'start') return;
  const player1Value = document.querySelector('input[name=player1]').value;
  const player2Value = document.querySelector('input[name=player2]').value;
  player1Turn = getRandomNum();
  player2Turn = 1 - player1Turn;
  let firstPlayer = player1Turn > player2Turn ? player2Value : player1Value;
  let secondPlayer = player1Turn < player2Turn ? player2Value : player1Value;
  state.players[0] = firstPlayer;
  state.players[1] = secondPlayer;
  state.hasStarted = true;
  render();
});

//bootstrapping
resetState();
render();
