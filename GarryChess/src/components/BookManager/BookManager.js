import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './BookManager.css';
import AddPositionPopup from '../AddPositionPopup/AddPositionPopup.js';
import NewBookPopup from '../NewBookPopup/NewBookPopup.js'

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
                               color: props.booksInfo.books[status[1]].color});
  }

  // function called by the NewBookPopup component when it needs to interact with BookManager component
  let customEventListener_newbook = (e) => {
    if (status[0] != "adding book"){
      console.log("customEventListener_newbook was called but status is " + status);
    }
    props.customEventListener({action: 'newbook', name: e.name, color: e.color });
  }

  let booksInfoList = props.booksInfo.books.map(
    (info, index) => <div key={info.bookName + ":" + info.color} className="card">
      <h4 onClick={()=>{setStatus(['learning', info.bookName, 0])}}>{info.bookName}</h4>
      <div onClick={()=>{props.customEventListener({action: 'reset'}); setStatus(["adding positions", index, 0]);}}>Add Position</div>
      <div onClick={()=>{props.customEventListener({action: 'deletebook', name: info.bookName})}}>Delete Book</div>
    </div>
  )

  return(
    <>
      <div className="BookManager">
        {booksInfoList}
        <div className="card">
          <div onClick={()=>{props.customEventListener({action: 'reset'});
                                            setStatus(["adding book", 0, 0]);
                                            }}>New Book</div>
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
