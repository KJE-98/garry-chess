import React from 'react';
import PropTypes from 'prop-types';
import './NewBookPopup.css';

const NewBookPopup = (props) => {

  function newBook() {
    props.customEventListener({action: "newbook",
                               name: document.getElementById("bookNameInput").value,
                               color: document.getElementById("bookColorInput").checked ? 'b' : 'w'});
  }
  function exit() {
    props.customEventListener({action: "exit"});
  }

  return(
    <div className="NewBookPopup">
      <input id="bookNameInput"/>
      <input type="checkbox" id="bookColorInput"/>
      <span onClick={newBook}> auto generate positions </span>
    </div>
  );
}

NewBookPopup.propTypes = {};

NewBookPopup.defaultProps = {};

export default NewBookPopup;
