import React from 'react'
import { wire } from "react-diffuse";
import { AReducer, BReducer } from "./StateManagement/States";
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const Number = (props) => {
  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={() =>
        props.BReducer.dispatch({
          type: "INCREMENT"
        })
      }
    >
      Number: {props.BReducer.store.item} Times clicked! Color changes on click
      from Number or Text
    </div>
  );
};

export default wire({
  fuseName: [BReducer, AReducer],
  Child: Number
});
