/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import { wire } from "react-diffuse";
import { AReducer } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const Text2 = (props) => {
  const [state, setState] = useState(0);

  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        let newState = state + 1;
        setState(newState);
      }}
    >
      Text2: {state} Rerender on click from Text
    </div>
  );
};

const Text = (props) => {
  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={() =>
        props.AReducer.dispatch({
          type: "INCREMENT"
        })
      }
    >
      Text: {props.AReducer.store.item} Times clicked! Color changes on click
      from Text
      <Text2 />
    </div>
  );
};

export default wire({ fuseName: [AReducer], Child: Text });
