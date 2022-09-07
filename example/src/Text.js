/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import { useAction, useFuseSelector, wire } from "react-diffuse";

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
  const store = useFuseSelector(cntxt => cntxt)
  const dispatch = useAction(cntxt => cntxt)
  console.log('STORE', store)
  // const INCREMENT = () => null
  console.log('RERENDER TEXT')
  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={() =>
        dispatch('AReducer', {type: 'INCREMENT'})
      }
    >
      Text: {store?.AReducer?.item ?? undefined} Times clicked! Color changes on click
      from Text
      <Text2 />
    </div>
  );
};

export default Text;
