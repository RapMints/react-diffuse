import React from 'react'
import { wire, useActions, useFuse, useSelectors, useFuseSelector } from "react-diffuse";
import { AReducer, AsyncReducer } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const CountAsync = (props) => {
  const actions = useActions(AsyncReducer)
  const fuse = useFuse(AsyncReducer)
  const selectors = useSelectors(AsyncReducer)
  //console.log(selectors)
  const selection = useFuseSelector(AsyncReducer, selectors.MySelector)
  console.log(selection)
  return (
    <div disabled={fuse.diffuse?.loading === true} style={{ backgroundColor: `${randomColor()}` }} onClick={() => {
      actions.GET_COUNT()
      }
      }
    >
      NumberAsync:{" "}
      {fuse.diffuse?.loading === true
        ? "loading"
        : fuse.item}{" "}
      Times clicked! Color changes on click from NumberAsync or Text
    </div>
  );
};

export default CountAsync
