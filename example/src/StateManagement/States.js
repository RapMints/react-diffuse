import count from './count'
import asyncCount from './asyncCount'

export const AReducer = count.createStore('AReducer');
export const BReducer = count.createStore('BReducer');
export const AsyncReducer = asyncCount.createStore('AsyncReducer');
export const AsyncReducer2 = asyncCount.createStore('AsyncReducer2');
