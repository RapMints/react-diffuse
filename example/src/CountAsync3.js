import React, {  useLayoutEffect } from 'react'
import { AsyncReducer2 } from "./StateManagement/States";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}
  /* @refresh reset */
const CountAsync3 = (props) => {
  const fuse = AsyncReducer2.useFetchState((store, resolve, reject) => {
    if (store?.diffuse?.loading === false && store?.diffuse?.completed === true) {
      // @ts-ignore
      resolve()
  }
  else if (store?.diffuse?.loading === false && store?.diffuse?.error !== false) {
      // @ts-ignore
      reject()
  }
  })
  console.log('FUSE', fuse)
  return (
    <div style={{ backgroundColor: `${randomColor()}` }}
    >
      useFetchState:{` ${fuse?.item} `}
      Times clicked! Color changes on click from NumberAsync. 
    </div>
  )
}

export default CountAsync3
