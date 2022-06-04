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

  function statusMessage (status){
    if (status[0] === 0)
      return "To get started, log in or create a new user in the upper right";
    if (status[0] === "learning"){
      if (status[2]==="correct"){
        return (<>
                  <div>
                    {"Learning from book: " + status[1]}
                  </div>
                  <div>
                    Correct
                  </div>
                </>);
      }
      if (status[2]==="incorrect"){
        return (<>
                  <div>
                    {"Learning from book: " + status[1]}
                  </div>
                  <div>
                    Incorrect
                  </div>
                </>);
      }
      return "Learning from book: " + status[1];
    }
    if (status[0] === "adding positions"){
      return "to add to the book: " + props.booksInfo.books[status[1]].bookName + ", play until you reach the desired position on the board, "
      + "and click, \"auto generate positions\"";
    }
  }

  return(
    <div className="sectionsOuter">
      <div className='ChessboardMask'>
        <Chessboard squareStyles={props.sqstyles} position={props.fen} onDrop={props.onDrop}
                    calcWidth={()=> !thinDisplay ? window.innerWidth/2 : window.innerWidth-50} />
      </div>
      <div className="sections">
        <div className={ !thinDisplay ? 'statusBarThin' : 'statusBarWide' }
                style={{ backgroundColor:  props.status[2] === "correct"   ?  "lightblue"
                                         : props.status[2] === "incorrect" ?  "orange"
                                         :                                    "#F6F6F9" }}>
          {statusMessage(props.status)}
        </div>
        <button className={ !thinDisplay ? 'thin' : 'wide' } onClick={props.getNewPosition}>
          <div>
            NEXT
          </div>
        </button>
      </div>
    </div>
  )
}

ChessboardMask.propTypes = {};

ChessboardMask.defaultProps = {};

export default ChessboardMask;
