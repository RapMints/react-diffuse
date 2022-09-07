import React from 'react'
import { useAction, useFuseSelector, wire } from "react-diffuse";
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const Number = (props) => {
  const item = useFuseSelector(cntxt => cntxt.store.BReducer.item)
  const dispatch = useFuseSelector(cntxt => cntxt.dispatch)
  
  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={() =>
        dispatch('BReducer', {type: 'INCREMENT'})
      }
    >
      Number: {item} Times clicked! Color changes on click
      from Number or Text
    </div>
  );
};

export default Number
