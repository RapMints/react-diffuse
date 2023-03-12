import count from './count'
import count2 from './count2'
import asyncCount from './asyncCount'

export const AReducer = count2.createFuseBox('AReducer', {someProps: 'This is a property'});
export const BReducer = count.createFuseBox('BReducer');
export const AsyncReducer = asyncCount.createFuseBox('AsyncReducer');
export const AsyncReducer2 = asyncCount.createFuseBox('AsyncReducer2');