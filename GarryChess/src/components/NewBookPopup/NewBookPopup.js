import React from 'react';
import PropTypes from 'prop-types';
import './NewBookPopup.css';
import LabeledSwitchMaterialUi from 'labeled-switch-material-ui';

const NewBookPopup = (props) => {
  let color = 'w';

  function newBook() {
    if (document.getElementById("bookNameInput").value === ""){
      document.getElementById("bookNameInput").style.backgroundColor = "lightblue"
      return;
    }
    props.customEventListener({action: "newbook",
                               name: document.getElementById("bookNameInput").value,
                               color: color,
                               elo: document.getElementById("elolevel").value });
  }
  function exit() {
    props.customEventListener({action: "exit"});
  }

  return(
    <div className="NewBookPopup">
      <button onClick={newBook}> Create book </button>
      <h5> with name </h5><input id="bookNameInput"/>
      <h5>playing as </h5>
      <LabeledSwitchMaterialUi labelLeft=' w' labelRight='b' onChange={(knobOnLeft)=>{color = knobOnLeft ? 'w':'b'}}
              styleLabelLeft={{color: "black"}} styleLabelRight={{color: "black"}}>
      </LabeledSwitchMaterialUi>
      <h5>, with opponent elo level of </h5>
      <input type="number" id="elolevel" min={100} max={2200} onInput={()=>{document.getElementById("elolevel").value = parseInt(document.getElementById("elolevel").value)}}></input>
    </div>
  );
}

NewBookPopup.propTypes = {};

NewBookPopup.defaultProps = {};

export default NewBookPopup;
