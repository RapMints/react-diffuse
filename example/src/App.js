import React from 'react'
import Diffuse, { createGlobalState } from 'react-diffuse'
import count from './StateManagement/count'
import asyncCount from './StateManagement/asyncCount'
import Text from './Text'
import Number from './Number'
import CountAsync from './CountAsync'
import './styles.css'
import CountAsync2 from './CountAsync2'

createGlobalState([
  count.initialize('AReducer'),
  count.initialize('BReducer'),
  asyncCount.initialize('AsyncReducer'),
  asyncCount.initialize('AsyncReducer2')
])

const App = (props) => {
  return (
    <Diffuse>
      <div className="App">
        <h1>DIFFUSE</h1>
        <h2>Global state management solution</h2>
        <h4>Color change = Rerender</h4>
        <Number />
        <Text />
        <CountAsync/>
        <CountAsync2/>
      </div>
    </Diffuse>
  )
}

export default App
