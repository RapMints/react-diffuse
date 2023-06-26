import React, {  useLayoutEffect } from 'react'
import { AsyncReducer } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const CountAsync = (props) => {
  const actions = AsyncReducer.actions
  const fuse = AsyncReducer.useState()
  const selection = AsyncReducer.selectors.MySelector()
  
  useLayoutEffect(() => {
    //actions.SUBSCRIBE()
  }, [])
  
  return (
    <div disabled={fuse.diffuse?.loading === true} style={{ backgroundColor: `${randomColor()}` }} onClick={() => {
      actions.GET_COUNT({})
      }
      }
    >
      NumberAsync:{" "}
      {fuse.diffuse?.loading === true
        ? "loading"
        : fuse.item}{" "}
      Times clicked! Color changes on click from NumberAsync or Text. WebSocketConnectionStatus {fuse.diffuse.connectionStatus}
      <br></br>SELECTION: {selection}
    </div>
  );
};

export default CountAsync
