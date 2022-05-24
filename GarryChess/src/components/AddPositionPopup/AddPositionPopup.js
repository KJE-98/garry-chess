import React from 'react';
import PropTypes from 'prop-types';
import './AddPositionPopup.css';

const AddPositionPopup = (props) => {
  function addPosition() {
    props.customEventListener({action: "addposition"});
  }

  return (<div className="AddPositionPopup">
    <div onClick={addPosition}> Auto generate positions </div>
  </div>)
};

AddPositionPopup.propTypes = {};

AddPositionPopup.defaultProps = {};

export default AddPositionPopup;
