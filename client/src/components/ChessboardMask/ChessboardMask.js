import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ChessboardMask.css';
import Chessboard from 'chessboardjsx';
import Progression from '../Progression/Progression';

const ChessboardMask = (props) => {

  let [thinDisplay, setThinDisplay] = useState(window.innerWidth < 650);

  window.addEventListener('resize', handleResize);

  function handleResize() {
    setThinDisplay(window.innerWidth < 650);
  }

  function deletePosition(){
    props.removePosition();
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
                    Correct, score: {findScore(status[1], props.booksInfo)}
                  </div>
                </>);
      }
      if (status[2]==="incorrect"){
        return (<>
                  <div>
                    {"Learning from book: " + status[1]}
                  </div>
                  <div>
                    Incorrect, score: {findScore(status[1], props.booksInfo)}
                  </div>

                </>);
      }
      return "Learning from book: " + status[1] + ", score: " + findScore(status[1], props.booksInfo);
    }
    if (status[0] === "adding positions"){
      return "to add to the book: " + props.booksInfo.books[status[1]].bookName + ", play until you reach the desired position on the board, "
      + "and click, \"auto generate positions\"";
    }
    if (status[0] === "howToAddPositions"){
      return "to add positions to your new book, click the \"add to\" button on the book";
    }
    if (status[0] === "nobooks"){
      return "to add a book, open \"Manage Books\" dropdown and click the \"new book\" card"
    }
  }

  function findScore(bookName, booksInfo) {
    let thebook = booksInfo.books.filter((book)=>book.bookName === bookName);
    if (thebook.length > 0)
        return Math.max(0, Math.min(thebook[0].score,100));
    return 0;
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
        {props.status[0] === "learning" &&
        <>
        <Progression percent={findScore(props.status[1], props.booksInfo)}></Progression>
        <button className={ !thinDisplay ? 'thin' : 'wide' } onClick={props.getNewPosition}>
          <div>
            NEXT
          </div>
        </button>
        { props.userID !== "" &&
        <div>
          <button onClick={deletePosition}> delete </button>
          <span>this position from the book?</span>
        </div>
        }
        </>
        }
      </div>
    </div>
  )
}

ChessboardMask.propTypes = {};

ChessboardMask.defaultProps = {};

export default ChessboardMask;
