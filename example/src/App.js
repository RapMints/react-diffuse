import React from 'react'
import Diffuse from 'react-diffuse'
import count from './StateManagement/count'
import count2 from './StateManagement/count2'
import asyncCount from './StateManagement/asyncCount'
import Text from './Text'
import Number from './Number'
import CountAsync from './CountAsync'
import './styles.css'
const GlobalState = (props) => {
  const reducers = [
    count.initialize('AReducer'),
    count2.initialize('BReducer'),
    asyncCount.initialize('AsyncReducer')
  ]
    return (
      <Diffuse reducers={reducers}>
          {props.children}
      </Diffuse>
    )
}
const App = (props) => {
  

  return (
    <GlobalState>
      <div className="App">
        <h1>DIFFUSE</h1>
        <h2>Global state management solution</h2>
        <h4>Color change = Rerender</h4>
        <Number />
        <Text />
      </div>
    </GlobalState>
  )
}

export default App
