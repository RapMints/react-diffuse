import React from 'react'
import { wire } from "react-diffuse";
import { AsyncReducer } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const CountAsync2 = (props) => {
  console.log('CountAsync2', props.AsyncReducer2?.store.percent)
  return (
    <div disabled={props.AsyncReducer2?.store?.diffuse?.loading === true} style={{ backgroundColor: `${randomColor()}` }} onClick={() => {
      props.AsyncReducer2.dispatch({type: 'GET_COUNT', payload: {
        test: "SomeText"
      }})
      }
      }
    >
      NumberAsync:{" "}
      {props.AsyncReducer2?.store?.diffuse?.loading === true
        ? "loading"
        : props.AsyncReducer2.store.item}{" "}
      Times clicked! Color changes on click from NumberAsync or Text
    </div>
  );
};

export default wire({fuseName: ['AsyncReducer2', 'AReducer'], Child: CountAsync2})