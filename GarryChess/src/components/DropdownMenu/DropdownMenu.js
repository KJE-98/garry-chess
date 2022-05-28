import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DropdownMenu.css';
import BookManager from '../BookManager/BookManager';

const DropdownMenu = (props) =>{
  const [expanded, setExpanded] = useState(false);
  let status = props.status;
  let setStatus = props.setStatus;

  let customEventListener_bookmanager = (e) => {
    props.customEventListener(e);
  }
  return (
    <div className="DropdownMenu">
      <div className="DropdownMenuButton" onClick={() => {setExpanded(!expanded)}}>Manage Books</div>
      { expanded && <BookManager booksInfo={props.booksInfo}
                                 customEventListener={customEventListener_bookmanager}
                                 status = {status}
                                 setStatus = {setStatus}></BookManager> }
    </div>
  );
}

DropdownMenu.propTypes = {};

DropdownMenu.defaultProps = {};

export default DropdownMenu;
