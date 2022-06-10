import React from 'react';
import PropTypes from 'prop-types';
import './Progression.css';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const Progression = (props) => (
  <div className="Progression">
          <ProgressBar
        percent={props.percent}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      >
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              alt=""
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="60"
              src="chestnut.png"
            />
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              alt=""
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="chestnutsapling.png"
            />
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <img
              alt=""
              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
              width="30"
              src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
            />
          )}
        </Step>
      </ProgressBar>
  </div>
);

Progression.propTypes = {};

Progression.defaultProps = {};

export default Progression;
