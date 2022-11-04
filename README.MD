# <b>Diffuse</b>
Light weight global state managment solution

<p align="center">
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="300" height="300" viewBox="0 0 500 500" xml:space="preserve">
<desc>Created with Fabric.js 4.6.0</desc>
<defs>
</defs>
<g transform="matrix(0.83 0 0 0.83 249.26 250.2)" id="o-lqHoiLiUCDr5DD-8HQM"  >
<path style="stroke: rgb(0,0,0); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(123,169,255); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 0 -87.2113 C 47.52187 -87.2113 86.09035 -48.14064 86.09035 0 C 86.09035 48.14064 47.52187 87.2113 0 87.2113 C -47.52187 87.2113 -86.09035 48.14064 -86.09035 0 C -86.09035 -48.14064 -47.52187 -87.2113 0 -87.2113 z" stroke-linecap="round" />
</g>
<g transform="matrix(1.06 -0.52 0.32 0.65 257.33 238.52)" id="Q4KZMHe5N5f43MM0lyi_U"  >
<path style="stroke: rgb(255,255,255); stroke-width: 5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(123,169,255); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 152.11401 -58.29166 C 166.36237 -44.32258 -101.54068999999998 56.65391 -153.78467 56.65391 C -206.02865 56.65391 -85.39255 -19.97647 -85.39255 -19.97647 C -85.39255 -19.97647 -233.57548 41.8866 -176.58204 75.8115 C -119.58861000000002 109.73640999999999 214.29791999999998 -31.151740000000004 188.17593 -67.07223000000002 C 162.05393999999998 -102.99272000000002 51.39168999999998 -58.29167000000002 51.39168999999998 -58.29167000000002 C 51.39168999999998 -58.29167000000002 137.86565 -72.26075000000002 152.11400999999998 -58.29167000000002 z" stroke-linecap="round" />
</g>
<g transform="matrix(0.67 0.89 -0.58 0.44 265.91 247.64)" id="XphY_v-ZeaZYXMn1TM_X8"  >
<path style="stroke: rgb(255,255,255); stroke-width: 5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(123,169,255); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 152.11401 -58.29166 C 166.36237 -44.32258 -101.54068999999998 56.65391 -153.78467 56.65391 C -206.02865 56.65391 -85.39255 -19.97647 -85.39255 -19.97647 C -85.39255 -19.97647 -233.57548 41.8866 -176.58204 75.8115 C -119.58861000000002 109.73640999999999 214.29791999999998 -31.151740000000004 188.17593 -67.07223000000002 C 162.05393999999998 -102.99272000000002 51.39168999999998 -58.29167000000002 51.39168999999998 -58.29167000000002 C 51.39168999999998 -58.29167000000002 137.86565 -72.26075000000002 152.11400999999998 -58.29167000000002 z" stroke-linecap="round" />
</g>
</svg>
  <br>
  <br>
</p>

<p align="center">
  <a href="http://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/npm/l/express.svg"></a>
  <a href="https://github.com/RapMints/react-diffuse/releases"><img alt="Current release" src="https://img.shields.io/github/release/RapMints/react-diffuse.svg"></a>
</p>

EXAMPLE: https://codesandbox.io/s/wispy-leaf-iyp9k6

<b>Table of Contents</b>
1. Installation
2. Usage
3. Create Reducer
4. Actions
    1. Chaining Async Actions
    2. Chaining Websocket Actions
5. CreateStore
6. Hooks
    1. useFuse
    2. useSelectors & useFuseSelection
    3. useDispatch
    4. useActions
7. Wire

## <b>Installation</b>
Install npm package
```
npm install react-diffuse
```

## <b>Usage</b>
### <b>Create reducer</b>
Firstly, we have the reducer, which will look something like this:
```
    import { createReducer } from "react-diffuse"

    const reducer = createReducer({
        initialState: {
            item: 0
        },
        middleware: { 
            beforeWare: [ ... ],
            afterWare: [ ... ]
        },
        actions: { 
            INCREMENT: ({state, payload}) => {
                return {
                    item: state.item + 1
                }
            },
            DECREMENT: ({state}) => {
                return {
                    item: state.item + 1
                }
            },
        },
        selectors: {
            toString: [
                (state) => `item is ${state.item}`, 
                (string) => `STRING: ${string}`
            ]
        }
    })
``` 
As you can see there are 4 parts to this reducer. 
* First we have an  <b>initialState</b>, the initial state of your reducer, in the above example we have an initial state where the item is 0. 
* Next, we have <b>middleware</b>, Where we can place before ware and after ware to run before or after the actions are completed in dispatch. 
* Then, we have <b>actions</b>. Actions are jobs that you can dispatch from any component, inheriting a store. 
* Lastly, we have <b>selections</b>. Selections mutate data from our state and only update when the mutation has changed. Selectors are just an array of selection functions. If only one function, that function takes in state as an argument. If more than one function every function except the last function takes in state. The last function takes all previous returns as its arguments for example

### <b>Actions</b>
Actions can be run from dispatching or by running the action explicitly. Async functions and regular functions are handled the same and can both take in an object containing state, payload, and props. 

*   state - Current state
*   payload - Payload that can be passed in on running the action
*   props - Props of current store which can be passed in when creating a store

#### <b>Chaining Asynchronous Actions</b>
The second object the action functions can recieve are actions which can be used to chain actions. Take a look below at the <i>GET_COUNT</i>

<b>*** NOTE The names INITIALIZE_STORE, LOADING, SUCCESS, FAIL, and PROGRESS are reserved and may not be used when creating your own action names</b>

```
    actions: { 
            INCREMENT: ({state}, actions) => {
                return {
                    item: state.item + 1
                }
            },
            DECREMENT: ({state}, actions) => {
                return {
                    item: state.item + 1
                }
            },
            GET_COUNT: async ({state, payload, props}, {SUCCESS, PROGRESS, FAIL, LOADING}) => {
                try {
                    LOADING()

                    let res = await axios.get(props.url)
                    
                    PROGRESS({percent: 50})

                    res = await axios.get(props.url)

                    SUCCESS({
                        item: res.count,
                        percent: 100
                    })
                }
                catch(e) {
                    return FAIL({error: e.message})
                }
            }
        }
```
In the example above example GET_COUNT is an async function and is chaining other actions such as LOADING, PROGRESS, and SUCCESS or FAIL. You may use any action you've created in chaining.

* LOADING will change the state to 
```
    state: {
        diffuse: {
            ...,
            loading: true
        }
        // Some "payload", if any
        ...
    }
```
* PROGRESS will change the state to 
```
    state: {
        ...
        // Some "payload", if any
        ...
    }
```
* SUCCESS will change the state to 
```
    state: {
        diffuse: {
            ...,
            loading: false
            error: false
        }
        // Some "payload", if any
        ...
    }
```

* FAIL will change the state to 
```
    state: {
        diffuse: {
            ...,
            loading: false,
            error: true
        }
        // Some "payload", if any
        ...
    }
```

#### <b>Chaining Websocket Actions</b>
Similary, you can chain websocket actions just like async actions. There are 5 predetermined actions you can use when handling websockets: CONNECT, CONNECT_ERROR, MESSAGE_RECEIVED, DISCONNECT, & EMIT. Note that you can replace these action names.
Below is an example of a SUBSCRIBE, UNSUBSCRIBE, & EMIT action using socket io:
```
    SUBSCRIBE: ({state, payload}, {CONNECT, CONNECT_ERROR}) => {
        socket.on('connection', data => {
            CONNECT()
        })

        socket.on('msg', (data) => {
            MESSAGE_RECIEVED({message: data})
        })

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
            CONNECT_ERROR()
        })
    },
    UNSUBSCRIBE: ({state, payload}, {DISCONNECT}) => {
        socket.disconnect()
        DISCONNECT()
    }
    EMIT_USER: ({state, payload}) => {
        socket.emit("send_user", payload.username)
    }
```
* CONNECT will change the state to 
```
    state: {
        diffuse: {
            ...,
            connectionStatus: "CONNECTED"
        }
        // Some "payload", if any
        ...
    }
```
* DISCONNECT will change the state to 
```
    state: {
        diffuse: {
            ...,
            connectionStatus: "DISCONNECTED"
        }
        // Some "payload", if any
        ...
    }
```
* CONNECT_ERROR will change the state to 
```
    state: {
        diffuse: {
            ...,
            connectionStatus: "FAILED"
        }
        // Some "payload", if any
        ...
    }
```
* MESSAGE_RECIEVED will change the state to 
```
    state: {
        ...
        // Some "payload", if any
        ...
    }
```
* EMIT will change the state to 
```
    state: {
        ...
        // Some "payload", if any
        ...
    }
```

### createStore
Once you've created your reducer you can use it to create stores like below:
```
    // Stores.js 
    
    import count from "./count";

    const AStore = count.createStore('AStore', props: {url: "www.example.com"})
    const BStore = count.createStore('BStore', props: {url: "www.example2.com"})

    export {AStore, BStore}
```
As you can see above we imported our count reducer we created above in the create reducer section. A single reducer can be used to create multiple stores. In this example we used the count reducer to create AStore and BStore

### <b>Hooks (functional components)</b>
*** NOTE: All hooks take in a store as there first argument. This means you must import your store whenever using a hook. In this example we import from our file we created above in the create store example. See the CodeSandbox example ***
#### <b>useFuse</b>
The useFuse hook you can use to select a reducer from global state. For example to get _item_ from the _AReducer_ you would use:

```
    import { AStore } from '../StateManagement/Stores'

    function Text(props) {
        const item = useFuse(AStore)

        return (
            <button>
                {item}
            </button>
        )
    }
``` 
#### <b>useSelectors and useFuseSelection</b>
The useSelectors hook is used to get all selectors specified in the reducer. useFuseSelection is used to apply the selector and get a selection. In the example below first we useSelector, by passing in the Store. Next we useFuseSelection to get us the selection of data, by passing in the store and selection. In the example below we are selecting the item and turning it into a string.

```
    import { AStore } from '../StateManagement/Stores'

    function Text(props) {
        const selectors = useSelector(AStore)
        const selection = useFuseSelection(AStore, selector.toString)
        return (
            <div>
                {selection}
            </div>
        )
    }
``` 
You can also explicitly create your selector. Selectors are just an array of selection functions. If only one function, that function takes in state as an argument. If more than one function every function except the last function takes in state. The last function takes all previous returns as its arguments for example:
```
    import { AStore } from '../StateManagement/Stores'

    function Text(props) {
        const sum = useFuseSelection(AStore, [
            (state) => state.item1, 
            (state) => state.item2,
            (item1, item2) => {
                item1 + item2
            }
        ])

        return (
            <div>
                {sum}
            </div>
        )
    }
``` 

This will return AStore's state and rerender the component using it whenever changed. 

#### <b>useDispatch</b>
The useDispatch hook allows you to dispatch actions for a specific reducer. For example if you wanted to dispatch actions for _AReducer_, it would look like this: 

```
    import { AStore } from '../StateManagement/Stores'

    function Text(props) {
        const dispatch = useDispatch(AStore)
        
        return (
            <button onClick={() => dispatch({type: 'INCREMENT'})}>
                Dispatch
            </button>
        )
    }
``` 

`const dispatch = useDispatch(AStore) `

This will return me a dispatch function you can use to dispatch actions to the AReducer. For example lets say you wanted to run an INCREMENT action you defined, then it would look something like this 

`dispatch({type: 'INCREMENT', payload: {}})`

### <b>useActions</b>
This useActions hook allows you to use actions directly instead of dispatch. First you get the actions for AReducer like so:

```
    import { AStore } from '../StateManagement/Stores'

    function Text(props) {
        const actions = useActions(AStore)
        
        return (
            <button onClick={() => actions.INCREMENT()}>
                Dispatch
            </button>
        )
    }
``` 

<b>*NOTE: These 3 hooks deprecate `wire({fuseName: ..., Child: ...})`, however `wire` still has support because they are still necessary on class components.*</b>

### <b>Wire (class components)</b>
Lastly, we have wire. Wire is used to wire a component to a global state. Below we will wire a Text compononent to a global state AReducer

```
    import { useEffect, useState } from "react";
    import { wire } from "./Diffuse";
    import { AReducer } from "./StateManagement/States";

    const Text = (props) => {
        useEffect(()=>{
            return () => {
                props.AReducer.actions.INITIALIZE_STORE()
            }
        }, [])
        return (
            <div style={{ backgroundColor: 'red' }} onClick={() =>
                props.AReducer.actions.INCREMENT()
            }>
            Items: {props.AReducer.store.item} 
            <Text2 />
            </div>
        );
    };

    export default wire([AReducer])(Text);

```
(AReducer is a string equal to AReducer). Notice that we import "wire" at the top and use it at export on the bottom. We pass two parameters to the object the <b>fuseName</b> which is the reducer you'd like to reference and the <b>Child</b> which represents the component to wire the fuses to to get the store and dispatch of the reducer in your props. In this case Text will be fused to the AReducer component, causing it to rerender only when its props or AReducer's state changes.

You can use INITIALIZE_STORE as shown above to initialize a global state to its initial state. You can pass through a payload that will be stored in the state on unmount

Notice above we call the dispatch of AReducer by referencing it from props. ```props.AReducer.dispatch({type: 'INCREMENT'})``` this will cause ```props.AReducer.store.item``` to increment. Any other component inheriting the same reducer will rerender every time that dispatcher is called.
