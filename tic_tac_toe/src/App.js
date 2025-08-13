import React, { Component } from "react";
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: Array(9).fill(null),
      isXNext: true,
      winner: null,
      mode: null,
      winningLine: [],
    };

    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    const { board, winner, isXNext, mode } = this.state;

    // Check winner when board changes
    if (prevState.board !== board) {
      this.checkWinner();
    }

    // Single player mode: Computer's move
    if (
      mode === "single" &&
      !isXNext &&
      !winner &&
      prevState.isXNext !== isXNext
    ) {
      setTimeout(() => {
        this.makeComputerMove();
      }, 500);
    }
  }

  checkWinner = () => {
    const { board, winner } = this.state;

    for (let [a, b, c] of this.winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        this.setState({ winner: board[a], winningLine: [a, b, c] });
        return;
      }
    }
    if (!board.includes(null) && !winner) {
      this.setState({ winner: "Draw" });
    }
  };

  makeComputerMove = () => {
    const { board } = this.state;
    const emptySquares = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (emptySquares.length > 0) {
      const randomMove =
        emptySquares[Math.floor(Math.random() * emptySquares.length)];
      this.handleClick(randomMove);
    }
  };

  handleClick = (index) => {
    const { board, isXNext, winner } = this.state;
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    this.setState({ board: newBoard, isXNext: !isXNext });
  };

  resetGame = () => {
    this.setState({
      board: Array(9).fill(null),
      isXNext: true,
      winner: null,
      winningLine: [],
    });
  };

  goHome = () => {
    this.setState({
      board: Array(9).fill(null),
      isXNext: true,
      winner: null,
      mode: null,
      winningLine: [],
    });
  };

  getStrikeClass = () => {
    const { winningLine } = this.state;
    if (!winningLine.length) return "";

    const linesMap = {
      "0,1,2": "strike-row-1",
      "3,4,5": "strike-row-2",
      "6,7,8": "strike-row-3",
      "0,3,6": "strike-col-1",
      "1,4,7": "strike-col-2",
      "2,5,8": "strike-col-3",
      "0,4,8": "strike-diag-1",
      "2,4,6": "strike-diag-2",
    };

    return linesMap[winningLine.join(",")] || "";
  };

  render() {
    const { board, mode, winner, isXNext } = this.state;

    // Home screen
    if (!mode) {
      return (
        <div className="container">
          <h1>Tic Tac Toe</h1>
          <button onClick={() => this.setState({ mode: "single" })}>
            1 Player
          </button>
          <button onClick={() => this.setState({ mode: "multi" })}>
            2 Players
          </button>
        </div>
      );
    }

    // Game screen
    return (
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <div className="board">
          {board.map((cell, index) => (
            <div
              key={index}
              className="cell"
              onClick={() =>
                mode === "multi" || (mode === "single" && isXNext)
                  ? this.handleClick(index)
                  : null
              }
            >
              {cell}
            </div>
          ))}

          {/* Strike line overlay */}
          {winner && winner !== "Draw" && (
            <div className={`strike-line ${this.getStrikeClass()}`}></div>
          )}
        </div>

        {winner && (
          <h2>
            {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
          </h2>
        )}

        <button onClick={this.resetGame}>Restart</button>
        <button onClick={this.goHome}>Home</button>
      </div>
    );
  }
}
