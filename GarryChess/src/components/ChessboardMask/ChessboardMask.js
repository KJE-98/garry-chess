import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ChessboardMask.css';
import { Chessboard } from 'react-chessboard';



const ChessboardMask = (props) => {

  return(
    <div className='ChessboardMask'>
      <Chessboard position={props.fen} onPieceDrop={props.onDrop} />
    </div>
  )
}

ChessboardMask.propTypes = {};

ChessboardMask.defaultProps = {};

export default ChessboardMask;
