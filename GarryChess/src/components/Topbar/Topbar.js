import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Topbar.css';
import Spinner from '../Spinner/Spinner.js';

const Topbar = (props) => {
  const [booksInfo, setBooksInfo] = useState({});
  let updateUserID = () => {
    props.customEventListener({action: "updateuserid", id: document.getElementById('userid').innerText});
  }

  return (
  <div className="Topbar">
    <h2>
        Garry Chess
    </h2>
    <Spinner books = {booksInfo}> </Spinner>
    <input id="userid" onInput={updateUserID}></input>
  </div>
  );
};

Topbar.propTypes = {};

Topbar.defaultProps = {};

export default Topbar;
