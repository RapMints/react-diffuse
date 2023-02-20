import count from './count'
import count2 from './count2'
import asyncCount from './asyncCount'

export const AReducer = count2.createStore('AReducer', {someProps: 'This is a property'});
export const BReducer = count.createStore('BReducer');
export const AsyncReducer = asyncCount.createStore('AsyncReducer');
export const AsyncReducer2 = asyncCount.createStore('AsyncReducer2');
