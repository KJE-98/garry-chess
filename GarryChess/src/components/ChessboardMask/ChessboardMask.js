import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ChessboardMask.css';
import Chessboard from 'chessboardjsx';



const ChessboardMask = (props) => {

  let [thinDisplay, setThinDisplay] = useState(window.innerWidth < 650);

  window.addEventListener('resize', handleResize);

  function handleResize() {
    setThinDisplay(window.innerWidth < 650);
  }

  return(
    <div className="sectionsOuter">
      <div className='ChessboardMask'>
        <Chessboard position={props.fen} onDrop={props.onDrop}
                    calcWidth={()=> !thinDisplay ? window.innerWidth/2 : window.innerWidth-50} />
      </div>
      <div className="sections">
        <div className={ !thinDisplay ? 'statusBarThin' : 'statusBarWide' } >{props.status}</div>
        <button className={ !thinDisplay ? 'thin' : 'wide' } onClick={props.getNewPosition}>Next</button>
      </div>
    </div>
  )
}

ChessboardMask.propTypes = {};

ChessboardMask.defaultProps = {};

export default ChessboardMask;
