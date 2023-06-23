import React, {  useLayoutEffect } from 'react'
import { useActions, useFuse, useSelectors, useFuseSelection } from "react-diffuse";
import { AsyncReducer } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const CountAsync3 = (props) => {
  const actions = useActions(AsyncReducer)
  
  const fuse = AsyncReducer.useState()
  
  console.log(fuse)
  useLayoutEffect(() => {
    //actions.SUBSCRIBE()
  }, [])
  
  return (
    <div style={{ backgroundColor: `${randomColor()}` }}
    >
      NumberAsync:{` ${fuse.item} `} 
      Times clicked! Color changes on click from NumberAsync or Text. 
      <br></br>
    </div>
  );
};

export default CountAsync3
