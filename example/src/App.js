import React, { Suspense } from 'react'
import Text from './Text'
import Number from './Number'
import CountAsync3 from './CountAsync3'
import CountAsync2 from './CountAsync2'
import { DiffuseBoundary } from 'react-diffuse'

const App = (props) => {
  
  return (
    <>
      <div className="App">
        <h1>DIFFUSE</h1>
        <h2>Global state management solution</h2>
        <h4>Color change = Rerender</h4>
        <Number />
        <Text />
        <CountAsync2/>
        <DiffuseBoundary 
          SuspenseFallback={<>LOADING.................</>} 
          ErrorFallbackComponent={({state}) => { console.log(state); return (<>{state.error}</>)}}
        >
          <CountAsync3 />
        </DiffuseBoundary>
      </div>
    </>
  )
}

export default App
