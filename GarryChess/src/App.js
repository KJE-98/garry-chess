
import './App.css';
import React, { useState } from 'react';
import Topbar from './components/Topbar/Topbar.js'
import DropdownMenu from './components/DropdownMenu/DropdownMenu';
import ChessboardMask from './components/ChessboardMask/ChessboardMask';
import { Chess } from 'chess.js';
import * as Functions from './ImportantFunctions.js';
import axios from 'axios';

function getRandomPosition(bookName){
  console.log("getting random position from " + bookName);
}

// MAKE ALL API CALLS ONLY RELY ON PARAMETERS


function App() {

  // all the main data needed for the application should be declared here
  const [booksInfo, setBooksInfo] = useState([{title: 'Default 1'}]);
  const [game, setGame] = useState(new Chess());
  const [userID, setUserID] = useState("");
  const [userInfoFromDB, setUserInfoFromDB] = useState({books: [{bookName: "defualt", color: 'w', positions: []}]});

  async function getUserData(userid) {
    try {
      let response = await axios.get("http://localhost:5000/users", { params: { id: userid } } );
      if (response.statusText == "OK"){
        console.log(response.data)
        return response.data;
      }else {
        console.log("Error inn getUserData");
        console.log(response);
      }
    } catch (e) {
      console.log("Error in getUserData");
      console.log(e);
    }
  }

  async function addUser(userid) {
    try {
      let response = await axios.post("http://localhost:5000/users/recordUser", { id: userid });
      if (response.status == 204){
        console.log("new user created");
      }else {
        console.log("Error inn newUser");
        console.log(response);
      }
    } catch (e) {
      console.log("Error in newUser");
      console.log(e);
    }
  }

  async function addPositions(userid, bookName, positions) {
    try {
      let response = await axios.post("http://localhost:5000/users/addToBook", { id: userid, bookName: bookName, positions: positions});
      if (response.status == 204){
        console.log("positions added");
      }else {
        console.log("Error inn addPositions");
        console.log(response);
      }
    } catch (e) {
      console.log("Error in addPositions");
      console.log(e);
    }
  }

  async function deleteBook(userid, bookName) {
    console.log("in delete book");
    try {
      console.log("before axios.delete in del book");
      let response = await axios.delete(`http://localhost:5000/deleteBook/${userid}/${bookName}`);
      console.log("after response in delete book");
      if (response.status == 204){
        console.log("book deleted");
      }else {
        console.log("Error inn deleteBook");
        console.log(response);
      }
    } catch (e) {
      console.log("Error in deleteBook");
      console.log(e);
    }
  }

  async function createBook(userid, bookName, color) {
    try {
      let response = await axios.post("http://localhost:5000/createBook", { id: userid, bookName: bookName, color: color});
      if (response.status == 204){
        console.log("book created");
      }else {
        console.log("Error inn createBook");
        console.log(response);
      }
    } catch (e) {
      console.log("Error in createBook");
      console.log(e);
    }
  }

  async function safeChangeData(callback, userid, ...args) {
    console.log("callback:");
    console.log(callback);
    console.log("before Callback");
    let cbreturn = await callback(userid, ...args);
    console.log("promise?");
    console.log(cbreturn);
    let newData = await getUserData(userid);
    console.log("newData");
    console.log(newData);
    setUserInfoFromDB(newData[0]);
    console.log("newdata");
    console.log(userInfoFromDB);
  }

  // functions that will be called directly (besides getUserData)
  async function newBook(bookName, color){
    console.log("newBook with name " + bookName);
    await safeChangeData(createBook, userID, bookName, color);
  }

  async function newPositions(bookName, color) {
    console.log("new positions");
    let positions = await Functions.generatePositions(game.fen(), color, 1000);
    await safeChangeData(addPositions, userID, bookName, positions);
  }

  async function newUser(userid) {
    if (userid < 10){
      console.log("userID too short");
    } else {
      await safeChangeData(addUser, userid);
    }
  }

  async function removeBook(bookName) {
    await safeChangeData(deleteBook, userID, bookName);
  }

  // function called by the Dropdown when it needs to interact with App component
  let customEventListener_dropdown = async (e) => {
    if (e.action === "reset")
      newGame();
    if (e.action === "deletebook")
      removeBook(e.name);
    if (e.action === "addposition")
      newPositions(e.name, e.color);
    if (e.action === "newbook")
      newBook(e.name, e.color);

  };

  // function called by the topbar when it needs to interact with App component
  let customEventListener_topbar = async (e) => {
    if (e.action == "updateuserid"){
      console.log(e.id);
      setUserID(e.id);
      let userData = await getUserData(e.id);
      console.log("userData");
      console.log(userData);
      if (Array.isArray(userData) && userData.length === 0){
        console.log("creating new user" + e.id);
        newUser(e.id);
      } else {
        setUserInfoFromDB(userData[0]);
      }
    }
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
      <Topbar customEventListener={customEventListener_topbar} userID={userID}></Topbar>
      <DropdownMenu booksInfo={userInfoFromDB} customEventListener={customEventListener_dropdown}></DropdownMenu>
      <ChessboardMask fen={game.fen()} onDrop={onDrop}></ChessboardMask>
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
