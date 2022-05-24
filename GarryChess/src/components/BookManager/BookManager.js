import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './BookManager.css';
import AddPositionPopup from '../AddPositionPopup/AddPositionPopup.js';
import NewBookPopup from '../NewBookPopup/NewBookPopup.js'

const BookManager = (props) => {
  // -1 for no popup, 0 if we are making new book, > 0 if we are adding position to known Book
  const [addingPositionTo, setAddingPositionTo] = useState(-1);

  // function called by the AddPositionPopup Componenet when it needs to interact with BookManager component
  let customEventListener_addposition = (e) => {
    props.customEventListener({action: 'addposition', name: props.booksInfo[addingPositionTo-1].title});
    setAddingPositionTo(-1);
  }

  // function called by the NewBookPopup component when it needs to interact with BookManager component
  let customEventListener_newbook = (e) => {
    props.customEventListener({action: 'newbook', name: e.name});
    setAddingPositionTo(-1);
  }

  let booksInfoList = props.booksInfo.map(
    (info, index) => <div className="card">
      <div onClick={()=>{props.customEventListener({action: 'reset'});setAddingPositionTo(index+1);}}>Add Position</div>
      <div onClick={()=>{props.customEventListener({action: 'delete', name: info.title})}}>Delete Book</div>
    </div>
  )

  return(
    <>
      <div className="BookManager">
        {booksInfoList}
        <div className="card">
          <div onClick={()=>{props.customEventListener({action: 'reset'});
                                            setAddingPositionTo(0);
                                            }}>New Book</div>
        </div>
      </div>
      { addingPositionTo > 0 && <AddPositionPopup customEventListener={customEventListener_addposition}></AddPositionPopup> }
      { addingPositionTo == 0 && <NewBookPopup customEventListener={customEventListener_newbook}></NewBookPopup> }
    </>
  )
};

BookManager.propTypes = {};

BookManager.defaultProps = {};

export default BookManager;
