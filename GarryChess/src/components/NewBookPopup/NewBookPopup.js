import React from 'react';
import PropTypes from 'prop-types';
import './NewBookPopup.css';

const NewBookPopup = (props) => {

  function newBook() {
    props.customEventListener({action: "newBook", name: "kian's book"});
  }
  function exit() {
    props.customEventListener({action: "exit"});
  }

  return(
    <div className="NewBookPopup">
      <input></input>
      <span onClick={newBook}> auto generate positions </span>
    </div>
  );
}

NewBookPopup.propTypes = {};

NewBookPopup.defaultProps = {};

export default NewBookPopup;
