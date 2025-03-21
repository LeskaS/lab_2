import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button
      className="w-16 h-16 text-2xl font-bold flex items-center justify-center border border-gray-400 bg-[#023047] text-white hover:bg-[#219ebc]"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  const status = winner
    ? `Победитель: ${winner}`
    : isDraw
    ? 'Ничья!'
    : `Следующий ход: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="text-center">
      <div className="text-lg font-semibold mb-4 text-[#ffb703]">{status}</div>
      <div className="grid grid-cols-3 gap-1">
        {squares.map((square, i) => (
          <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setHistory(history.slice(0, move + 1));
  }

  return (
    <div className="flex flex-col items-center mt-10 text-white bg-[#008c96] min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#fb8500]">Крестики-нолики</h1>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-[#ffb703]">История ходов</h2>
        <ol className="list-none p-0 mt-2">
          {history.map((_, move) => (
            <li key={move}>
              <button
                className="mt-1 px-4 py-2 bg-[#219ebc] text-white rounded hover:bg-[#023047]"
                onClick={() => jumpTo(move)}
              >
                {move > 0 ? `Перейти к ходу #${move}` : 'Начать заново'}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
