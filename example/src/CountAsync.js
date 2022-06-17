import React from 'react'
import { wire } from "react-diffuse";
import { AsyncReducer } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const CountAsync = (props) => {
  return (
    <div style={{ backgroundColor: `${randomColor()}` }} onClick={() => {
        props.AsyncReducer.dispatch({
          type: "GET_COUNT",
          payload: {
            test: "SomeText"
          }
        })
      }
      }
    >
      NumberAsync:{" "}
      {props.AsyncReducer.store.diffuse.loading
        ? "loading"
        : props.AsyncReducer.store.item}{" "}
      Times clicked! Color changes on click from Number or Text
    </div>
  );
};

export default wire({
  fuseName: [AsyncReducer],
  Child: CountAsync
});
