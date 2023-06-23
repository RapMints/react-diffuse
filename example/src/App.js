import React, { Suspense } from 'react'
import Text from './Text'
import Number from './Number'
import CountAsync from './CountAsync'
import CountAsync3 from './CountAsync3'
import { AsyncReducer } from './StateManagement/States'

const App = (props) => {
  
  return (
    <>
      <div className="App">
        <h1>DIFFUSE</h1>
        <h2>Global state management solution</h2>
        <h4>Color change = Rerender</h4>
        <button onClick={() => AsyncReducer.actions.GET_COUNT()}>GET COUNT</button>
        <Suspense fallback={<div>LOADING........</div>}>
        <CountAsync3/>
        </Suspense>
        {/* <Number />
        <Text />
        <CountAsync2/> */}
      </div>
    </>
  )
}

export default App
