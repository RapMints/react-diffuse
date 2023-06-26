import React from 'react'
import { wire } from "react-diffuse";
import { AsyncReducer2 } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const CountAsync2 = (props) => {
  return (
    <div disabled={props.AsyncReducer2?.store?.diffuse?.loading === true} style={{ backgroundColor: `${randomColor()}` }} onClick={() => {
      AsyncReducer2.actions.GET_COUNT({})
      }
      }
    >
      NumberAsync:{" "}
      {props.AsyncReducer2?.store?.diffuse?.loading === true
        ? "loading"
        : props.AsyncReducer2.store.item}{" "}
      Times clicked! Color changes on click from NumberAsync
    </div>
  );
};

export default wire([AsyncReducer2])(CountAsync2)
