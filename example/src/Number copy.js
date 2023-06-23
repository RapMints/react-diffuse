import React from 'react'
import { useActions } from 'react-diffuse';
import { AReducer, BReducer } from "./StateManagement/States";
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const Number = (props) => {
  const actions = BReducer.actions
  const listenForThis = AReducer.useState()
  const fuse = BReducer.useState()
  const state = BReducer.useState()
  const {item} = fuse
  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={async () =>
        actions.INCREMENT()
      }
    >
      Number: {item} Times clicked! Color changes on click
      from Number or Text (INCREMENTS In AReducer and BReducer)
    </div>
  );
};

export default Number
