import React, { useState } from 'react';
import './Topbar.css';
import Popup from 'reactjs-popup';

const Topbar = (props) => {
  let login = () => {
    props.customEventListener({action: "login", id: document.getElementById('userid').value});
  }

  let createID = () => {
    props.customEventListener({action: "createid", id: document.getElementById('createuserid').value});
  }

  return (
  <div className="Topbar">
    <h2>
        Garry Chess
    </h2>
    <h4> {props.userID ? props.userID : " not logged in "} </h4>
    <Popup trigger={ open => <button>Login/Create Account</button>} closeOnDocumentClick position="center center" modal>
      {close =>
        <div className='modal'>
          <div className='header'> Log in </div>
          <button className='close' onClick={close}>&times;</button>
          <div className='content'>
            {' '}
            Log in with an existing id
          </div>
          <div className="actions">
            <input id='userid'></input>
            <button onClick={login}>Login</button>
          </div>
          <div className='content'>
            {' '}
            Or, create a new id (at least 10 characters)
          </div>
          <div className="actions">
            <input id='createuserid'></input>
            <button onClick={createID}>Create Account</button>
          </div>
        </div>
      }
    </Popup>
  </div>
  );
};

Topbar.propTypes = {};

Topbar.defaultProps = {};

export default Topbar;
