// Fix castling issue with lichess
import './App.css';
import React, { useState } from 'react';
import Topbar from './components/Topbar/Topbar.js'
import DropdownMenu from './components/DropdownMenu/DropdownMenu';
import ChessboardMask from './components/ChessboardMask/ChessboardMask';
import { Chess } from 'chess.js';
import * as Functions from './ImportantFunctions.js';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

let guesses = 0;
let correctGuesses = 0;
let positionToDelete = null;

function App() {

  // all the main data needed for the application should be declared here
  const [game, setGame] = useState(new Chess());
  const [userID, setUserID] = useState("");
  const [userInfoFromDB, setUserInfoFromDB] = useState(
    {
      books: [
        {
          bookName: "default",
          color: 'w',
          elo: 700,
          positions: Functions.defaultPositions,
          score: 0,
        }
      ]
    }
  );
  const [status, setStatus] = useState([0,0,0]);
  const [sqstyles, setSqstyles] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const apistring = "";

  // API calls
  async function getUserData(userid) {
    try {
      let response = await axios.get(apistring+"/users", { params: { id: userid } } );
      if (response.statusText === "OK"){
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
      let response = await axios.post(apistring+"/users/recordUser", { id: userid });
      if (response.status === 204){
        console.log("new user created");
        return true;
      }else {
        console.log("Error inn newUser");
        console.log(response);
        return false;
      }
    } catch (e) {
      console.log("Error in newUser");
      console.log(e);
      return false;
    }
  }

  async function addPositions(userid, bookName, positions) {
    try {
      let response = await axios.post(apistring+"/users/addToBook", { id: userid, bookName: bookName, positions: positions});
      if (response.status === 204){
        return true;
      }else {
        console.log("Error inn addPositions");
        console.log(response);
        return false;
      }
    } catch (e) {
      console.log("Error in addPositions");
      console.log(e);
      return false;
    }
  }

  async function updateScore(userid, bookName, amount) {
    if (!userID) return;
    try {
      let response = await axios.post(apistring+"/users/updateScore", { id: userid, bookName: bookName, amount: amount});
      if (response.status === 204){
        return true;
      }else {
        console.log("Error inn updateScore");
        console.log(response);
        return false;
      }
    } catch (e) {
      console.log("Error in updateScore");
      console.log(e);
      return false;
    }
  }

  async function deleteBook(userid, bookName) {
    try {
      console.log("before axios.delete in del book");
      let response = await axios.delete(apistring+`/deleteBook/${userid}/${bookName}`);
      console.log("after response in delete book");
      if (response.status === 204){
        openSnackbar("book deleted");
      }else {
        console.log("Error inn deleteBook");
        console.log(response);
      }
    } catch (e) {
      console.log("Error in deleteBook");
      console.log(e);
    }
  }
  ///deletePosition/:id/:bookName/
  async function deletePosition(userid, bookName, fen) {
    console.log(userid, bookName, fen);
    try {
      let response = await axios.delete(apistring+`/deletePosition/${userid}/${bookName}/`, { data: { position: fen }});
      if (response.status === 204){
        return true;
      }else {
        console.log("Error inn deletePosition");
        console.log(response);
        return false;
      }
    } catch (e) {
      console.log("Error in deletePosition");
      console.log(e);
      return false;
    }
  }

  async function createBook(userid, bookName, color, elo) {
    try {
      let response = await axios.post(apistring+"/createBook", { id: userid, bookName: bookName, color: color, elo: elo});
      if (response.status === 204){
        openSnackbar("new book created");
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
    let cbreturn = await callback(userid, ...args);
    let newData = await getUserData(userid);
    if (Array.isArray(newData) && newData.length > 0){
      setUserInfoFromDB(newData[0]);
    }
    return cbreturn;
  }

  // functions that will be called directly (besides getUserData)
  async function newBook(bookName, color, elo){
    for (let book of userInfoFromDB.books){
      if (book.bookName === bookName){
        openSnackbar("you already have a book of this name");
        return;
      }
    }
    await safeChangeData(createBook, userID, bookName, color, elo);
    setStatus(["howToAddPositions", 0, 0]);
  }

  async function newPositions(bookName, color, elo) {
    openSnackbar("adding positions, please wait");
    let positions = await Functions.generatePositions(game.fen(), color, elo);
    let success = await safeChangeData(addPositions, userID, bookName, positions);
    if (success) {
      openSnackbar(positions.length + " positions added");
    } else {
      openSnackbar("problem adding positions");
    }
  }

  async function newUser(userid) {
    if (userid < 10){
      openSnackbar("id must be at least 10 characters")
    } else {
      let userAdded = await safeChangeData(addUser, userid);
      if (userAdded) {
        setUserID(userid);
        openSnackbar("logged in as " + userid);
        startTutorial();

      } else {
        openSnackbar("couldn't create user in");
      }
    }
  }

  async function removeBook(bookName) {
    await safeChangeData(deleteBook, userID, bookName);
  }

  async function removePosition(){

    if (status[0] !== "learning") {
      openSnackbar("select a book first");
      return;
    }
    console.log("here");
    console.log(userInfoFromDB);
    console.log(status[1]);
    let success = await safeChangeData(deletePosition, userID, status[1], positionToDelete);
    if (success){
      openSnackbar("position deleted");
    } else {
      openSnackbar("problem deleting position");
    }
  }

  function randomPosition(bookName) {
    console.log("randPos info");
    console.log(bookName);
    for (let book of userInfoFromDB.books){
      console.log(book.bookName)
      if (book.bookName === bookName){
        let positions = book.positions;
        let len = positions.length;
        if (len === 0){
            return "no positions"
        }
        else {
          let randIndex = Math.floor(Math.random() * len);
          return positions[ randIndex ];
        }
      }
    }
    return "no book";
  }

  // Event handling

  function startTutorial() {
    let tutorialOverlay = document.createElement('div');
    tutorialOverlay.classList.add('overlay');

    let askForTutorial = document.createElement('div');
    askForTutorial.classList.add("center-screen");
    askForTutorial.style.backgroundColor = "rgba(255, 255, 255, .5)"

    let askForTutorialText = document.createTextNode("You seem to be a new user, would you like a tutorial?");
    askForTutorial.appendChild(askForTutorialText);

    let askForTutorialButton = document.createElement("button");
    askForTutorialButton.textContent = "yes";

    let dontAskForTutorialButton = document.createElement("button");
    dontAskForTutorialButton.textContent = 'no';

    askForTutorialButton.addEventListener('click', doTutorial);
    dontAskForTutorialButton.addEventListener('click', ()=>tutorialOverlay.remove());
    tutorialOverlay.appendChild(askForTutorial);
    askForTutorial.appendChild(askForTutorialButton);
    askForTutorial.appendChild(dontAskForTutorialButton);
    askForTutorial.classList.add("tutorial-focus");
    document.getElementById('root').appendChild(tutorialOverlay);

    function doTutorial(){
      tutorialOverlay.remove();
      let tutorialInstruction = document.createElement("div");
      let tutorialInstructionText = document.createTextNode("click the Manage Books dropdown button");
      tutorialInstruction.classList.add('tutorial-instruction');
      tutorialInstruction.appendChild(tutorialInstructionText);
      document.getElementById("dropdownmenu").appendChild(tutorialInstruction);
      document.getElementById("dropdownmenu").classList.add("tutorial-focus");
      document.getElementById("dropdownmenu").addEventListener('click', function wrapperFunc(){do_tutorial_add_book(tutorialInstructionText, wrapperFunc)});
    }

    function do_tutorial_add_book (tutorialInstructionText, wrapper) {
      document.getElementById("dropdownmenu").removeEventListener('click', wrapper);
      tutorialInstructionText.textContent = "Click the new book card and fill in the form to create a new book. Set the toggle to white, and the elo to 700, then press the outlined create book button. Name it whatever you like.";
      document.addEventListener("newbookcreated", function wrapperFunc(){do_tutorial_add_positions(tutorialInstructionText, wrapperFunc)});
    }

    function do_tutorial_add_positions (tutorialInstructionText, wrapper)
    {
      document.removeEventListener("newbookcreated",wrapper);
      tutorialInstructionText.textContent = "Once the book is created you will see it in the dropdown. Click the add positions button on your new book to add some positions to it.";
      document.addEventListener("addingpositions", do_tutorial_generate_positions);
    }

    function do_tutorial_generate_positions(){
      document.removeEventListener("addingpositions", do_tutorial_generate_positions);
      document.getElementsByClassName("tutorial-instruction")[0].remove();
      document.getElementsByClassName("tutorial-focus")[0].classList.remove('tutorial-focus');
    }
  }

  // function called by the Dropdown when it needs to interact with App component
  let customEventListener_dropdown = async (e) => {

    if (e.action === "reset")
      newGame();
    if (e.action === "deletebook"){
      removeBook(e.name);
      setStatus(["bookdeleted",0,0]);
    }
    if (e.action === "addposition")
      newPositions(e.name, e.color, e.elo);
    if (e.action === "newbook"){
      newBook(e.name, e.color, e.elo);
      document.dispatchEvent(new Event("newbookcreated"));
    }
    if (e.action === "startlearning"){
      setStatus(['learning', e.name, 0]);
      guesses = 0;
      correctGuesses = 0;
    }
  };

  // function called by the topbar when it needs to interact with App component
  let customEventListener_topbar = async (e) => {
    setStatus([0,0,0]);
    if (e.action === "login"){
      let userData = await getUserData(e.id);
      console.log(userData);
      if (Array.isArray(userData) && userData.length > 0){
        setUserInfoFromDB(userData[0]);
        setUserID(e.id);
        setStatus(["nobooks", 0, 0]);
        openSnackbar("logged in");
      } else if (Array.isArray(userData) && userData.length === 0) {
        openSnackbar("no user of that name");
      } else {
        openSnackbar("problem logging in");
      }
    } else if (e.action === "createid") {
      newUser(e.id);
      setStatus(["nobooks", 0, 0]);
    }
  };

  function openSnackbar(message){
    setSnackbarMessage(message);
    setSnackOpen(true);
  }
  function snackbarClose(){
    setSnackOpen(false);
  }

  // Bunch of stuff for making moves on the Chess board
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
    setSqstyles({});
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

  function onDrop(pieceMove) {
    let move = null;
    let prevFen = game.fen();
    safeGameMutate((game) => {
      move = game.move({
        from: pieceMove.sourceSquare,
        to: pieceMove.targetSquare,
        promotion: "q", // always promote to a queen for simplicity
      });
    });
    if (move === null) return false; // illegal move
    if (status[0] === "learning"){
      handleGuess(prevFen, move);
    }
    return true;
  }
  async function handleGuess(fen, guess) {
    let best = await Functions.getBestMove(fen);
    let guessIsBest = best.slice(0,2) === guess.from && best.slice(2,4) === guess.to;
    if (guessIsBest){
      guesses++;
      correctGuesses++;
      setSqstyles( { [best.slice(0,2)]: {backgroundColor: "lightblue"}, [best.slice(2,4)]: {backgroundColor: "lightblue"} } );
      setStatus([status[0], status[1], "correct"]);
    }
    else {
      guesses++;
      setStatus([status[0], status[1], "incorrect"]);
      safeGameMutate((game)=>{game.undo()});
      setTimeout( ()=>{
        safeMakeMove({ from: best.slice(0,2), to: best.slice(2,4) });
        setSqstyles( { [best.slice(0,2)]: {backgroundColor: "orange"}, [best.slice(2,4)]: {backgroundColor: "orange"} } );},
        1000);
    }
    if (guesses > 9) {
      let amount = correctGuesses < 1 ? -5 :
                   correctGuesses < 5 ? -3 :
                   correctGuesses < 8 ? -1 :
                   correctGuesses < 9 ? 1 :
                   correctGuesses < 10 ? 2 : 5;
      guesses = 0;
      correctGuesses = 0;
      safeChangeData(updateScore, userID, status[1], amount);
    }
  }
  let getNewPosition = () =>
  {
    setStatus([status[0], status[1], 0]);
    let newPosition = randomPosition(status[1]);
    safeGameMutate(()=>game.load(newPosition));
    positionToDelete = newPosition;
  }

  // return
  return (
    <div className="App">
      <Topbar customEventListener={customEventListener_topbar} userID={userID}></Topbar>
      <DropdownMenu userID={userID} booksInfo={userInfoFromDB} customEventListener={customEventListener_dropdown}
                    status={status} setStatus={setStatus}></DropdownMenu>
      <ChessboardMask
          booksInfo={userInfoFromDB} sqstyles={sqstyles} userID={userID}
          getNewPosition={getNewPosition} status={status} fen={game.fen()} onDrop={onDrop} removePosition={removePosition}>
      </ChessboardMask>
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={snackbarClose}>
        <Alert onClose={snackbarClose} severity="success" sx={{ width: '100%' }}>
         {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
