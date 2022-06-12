import React, { useState } from 'react';
import './BookManager.css';
import AddPositionPopup from '../AddPositionPopup/AddPositionPopup.js';
import NewBookPopup from '../NewBookPopup/NewBookPopup.js';
import Popup from 'reactjs-popup';

const BookManager = (props) => {
  let status = props.status;
  let setStatus = props.setStatus;

  // function called by the AddPositionPopup Componenet when it needs to interact with BookManager component
  let customEventListener_addposition = (e) => {
    if (status[0] != "adding positions" || status[1] < 0){
      console.log("customEventListener_addposition was called but status is " + status);
    }
    props.customEventListener({action: 'addposition',
                               name: props.booksInfo.books[status[1]].bookName,
                               color: props.booksInfo.books[status[1]].color,
                               elo: props.booksInfo.books[status[1]].elo});
  }

  // function called by the NewBookPopup component when it needs to interact with BookManager component
  let customEventListener_newbook = (e) => {
    if (status[0] != "adding book"){
      console.log("customEventListener_newbook was called but status is " + status);
    }
    props.customEventListener({action: 'newbook', name: e.name, color: e.color, elo: e.elo });
  }

  let booksInfoList = props.booksInfo.books.map(
    (info, index) =>
    <button key={info.bookName + ":" + info.color} className="card"
            onClick={()=>{props.customEventListener({action: 'startlearning', name: info.bookName})}}>
      <h4>{info.bookName + ", \n" + info.color + ", \n" + info.elo}</h4>
      { props.userID !== "" &&
      <div onClick={(e)=>{e.stopPropagation();props.customEventListener({action: 'reset'}); setStatus(["adding positions", index, 0]);}}>
        <span>Add to</span>
      </div>
      }
      { props.userID &&
          <Popup trigger={ open => <div><span>Delete</span></div>} closeOnDocumentClick position="center center" modal>
          {close =>
            <div className='modal'>
              <div className='header'> Are you sure? </div>
              <button className='close' onClick={close}>&times;</button>
              <div className='content'>
                {' '}
                Confirm you would like to delete book: {info.bookName}
              </div>
              <div className="actions">
                <button onClick={(e)=>{e.stopPropagation();props.customEventListener({action: 'deletebook', name: info.bookName})}}>delete</button>
              </div>
            </div>
          }
        </Popup>
      }
    </button>
  )

  return(
    <>
      <div className="BookManager">
        <div className='flexboxContainer'>
          {booksInfoList}
          { props.userID &&
          <button className="card" onClick={()=>{props.customEventListener({action: 'reset'});
                                              setStatus(["adding book", 0, 0]);
                                              }}>
            <span>New Book</span>
          </button>
          }
        </div>
      </div>
      { status[0] === "adding positions" && <AddPositionPopup customEventListener={customEventListener_addposition}></AddPositionPopup> }
      { status[0] === "adding book" && <NewBookPopup customEventListener={customEventListener_newbook}></NewBookPopup> }
    </>
  )
};

BookManager.propTypes = {};

BookManager.defaultProps = {};

export default BookManager;
