import React from 'react'
import Diffuse from 'react-diffuse'
import count from './StateManagement/count'
import asyncCount from './StateManagement/asyncCount'
import Text from './Text'
import Number from './Number'
import CountAsync from './CountAsync'
import './styles.css'

const App = (props) => {
  let Reducer = count.initialize('AReducer')
  console.log(Reducer)
  const reducers = [
    count.initialize('AReducer'),
    count.initialize('BReducer'),
    asyncCount.initialize('AsyncReducer')
  ]

  return (
    <Diffuse reducers={reducers}>
      <div className="App">
        <h1>DIFFUSE</h1>
        <h2>Global state management solution</h2>
        <h4>Color change = Rerender</h4>
        <Number />
        <Text />
        <CountAsync/>
      </div>
    </Diffuse>
  )
}

export default App
