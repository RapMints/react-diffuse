import React from 'react'
import { useDispatch, useFuse, wire, useActions} from "react-diffuse";
import { AReducer, BReducer } from "./StateManagement/States";
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const Number = (props) => {
  const actions = useActions(BReducer)
  const setValue = useDispatch(BReducer)
  const listenForThis = useFuse(AReducer)
  const fuse = useFuse(BReducer)
  const {item} = fuse
  return (
    <div
      style={{ backgroundColor: `${randomColor()}` }}
      onClick={async () =>
        actions.INCREMENT()
      }
    >
      Number: {item} Times clicked! Color changes on click
      from Number or Text
    </div>
  );
};

export default Number
