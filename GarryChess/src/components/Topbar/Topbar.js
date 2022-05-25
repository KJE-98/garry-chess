import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Topbar.css';
import Spinner from '../Spinner/Spinner.js';

const Topbar = (props) => {
  const [booksInfo, setBooksInfo] = useState({});
  let updateUserID = () => {
    props.customEventListener({action: "updateuserid", id: document.getElementById('userid').value});
  }

  return (
  <div className="Topbar">
    <h2>
        Garry Chess
    </h2>
    <h3> {props.userID ? props.userID : " not logged in "} </h3>
    <input id="userid"></input>
    <button onClick={updateUserID} > New User / Login </button>
  </div>
  );
};

Topbar.propTypes = {};

Topbar.defaultProps = {};

export default Topbar;
