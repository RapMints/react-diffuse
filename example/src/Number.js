import React from 'react'
import { useDispatch, useFuse, wire } from "react-diffuse";
import { AReducer, BReducer } from "./StateManagement/States";
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const Number = (props) => {
  const setValue = useDispatch('BReducer')
  const listenForThis = useFuse(context => context[AReducer].item)
  const item = useFuse(context => context[BReducer].item)

  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={async () =>
        setValue({type: 'INCREMENT'})
      }
    >
      Number: {item} Times clicked! Color changes on click
      from Number or Text
    </div>
  );
};

export default Number
