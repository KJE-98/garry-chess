import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DropdownMenu.css';
import BookManager from '../BookManager/BookManager';

const DropdownMenu = (props) =>{
  const [expanded, setExpanded] = useState(false);
  let status = props.status;
  let setStatus = props.setStatus;
  let userID = props.userID;

  let customEventListener_bookmanager = (e) => {
    props.customEventListener(e);
  }
  return (
    <div className="DropdownMenu">
      <button className="DropdownMenuButton" onClick={(e) => {e.preventDefault(); return setExpanded(!expanded)}}>Manage Books</button>
      { expanded && <BookManager booksInfo={props.booksInfo}
                                 customEventListener={customEventListener_bookmanager}
                                 status = {status}
                                 setStatus = {setStatus}
                                 userID={userID}></BookManager> }
    </div>
  );
}

DropdownMenu.propTypes = {};

DropdownMenu.defaultProps = {};

export default DropdownMenu;
