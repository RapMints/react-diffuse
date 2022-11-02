import React from 'react'
import Text from './Text'
import Number from './Number'
import CountAsync from './CountAsync'
import './styles.css'
import CountAsync2 from './CountAsync2'

const App = (props) => {
  
  return (
    <>
      <div className="App">
        <h1>DIFFUSE</h1>
        <h2>Global state management solution</h2>
        <h4>Color change = Rerender</h4>
        <Number />
        <Text />
        <CountAsync/>
        <CountAsync2/>
      </div>
    </>
  )
}

export default App
