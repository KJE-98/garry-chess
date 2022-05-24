
import './App.css';
import React, { useState } from 'react';
import Topbar from './components/Topbar/Topbar.js'
import DropdownMenu from './components/DropdownMenu/DropdownMenu';
import ChessboardMask from './components/ChessboardMask/ChessboardMask';
import { Chess } from 'chess.js';
import * as Functions from './ImportantFunctions.js';

function addPosition(bookName, fen){
  console.log("add Position to " + bookName);
}
function getRandomPosition(bookName){
  console.log("getting random position from " + bookName);
}

function App() {


  async function newBook(bookName, fen){
    console.log("newBook with name " + bookName);
    let positions = await Functions.generatePositions(game.fen(), 'b', 1000);
    console.log(positions);
  }

  // all the main data needed for the application should be declared here
  const [booksInfo, setBooksInfo] = useState([{title: 'Default 1'}]);
  const [game, setGame] = useState(new Chess());
  const [userID, setUserID] = useState("");

  // function called by the Dropdown when it needs to interact with App component
  let customEventListener_dropdown = (e) => {
    if (e.action == "reset")
      newGame();
    if (e.action == "addposition")
      addPosition(e.name, game.fen())
    if (e.action == "newbook")
      newBook(e.name, game.fen())
  };

  // function called by the topbar when it needs to interact with App component
  let customEventListener_topbar = (e) => {
    if (e.action == "updateuserid")
      setUserID(e.id);
  };

  // Bunch of stuff for making moves on the Chess board
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }
  function safeMakeMove(move){
    safeGameMutate(()=>{
      game.move(move);
    });
  }
  function newGame() {
    safeGameMutate((game) => {
      game.reset();
    });
  }
  async function makeGoodMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0){
      return;
    }
    let bestMoves = await Functions.getELOspecificMoves(game.fen(), 900);
    let bestMove = bestMoves[0];
    safeMakeMove({ from: bestMove.slice(0,2), to: bestMove.slice(2,4) });
  }
  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for simplicity
      });
    });
    if (move === null) return false; // illegal move
    setTimeout(makeGoodMove, 1000);
    return true;
  }

  // return
  return (
    <div className="App">
      <Topbar customEventListener={customEventListener_topbar}></Topbar>
      <DropdownMenu booksInfo={booksInfo} customEventListener={customEventListener_dropdown}></DropdownMenu>
      <ChessboardMask fen={game.fen()} onDrop={onDrop}></ChessboardMask>
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
