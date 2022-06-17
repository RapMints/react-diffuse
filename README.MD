# <b>Diffuse</b>
Light weight global state managment solution

EXAMPLE: https://codesandbox.io/s/wispy-leaf-iyp9k6

<b>Table of Contents</b>
1. Installation
2. Usage
3. Create Reducer
4. Actions
5. Add Reducer to Global State
6. Wire

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
            INCREMENT: {
                type: "action",
                job: (state) => {
                    return {
                        item: state.item + 1
                    }
                }
            },
            DECREMENT: {
                type: "action",
                job: (state) => {
                    return {
                        item: state.item + 1
                    }
                }
            }
        },
    })
``` 
As you can see there are 3 parts to this reducer. 
First we have an  <b>initialState</b>, the initial state of your reducer, in the above example we have an initial state where the item is 0. Next we have <b>middleware</b>, Where we can place before ware and after ware to run before or after the actions are completed in dispatch. Lastly, we have <b>actions</b>. Actions are jobs that you can dispatch from any component, inheriting a reducer.

### <b>Actions</b>
Actions can be run from dispatching. There are two types of actions, regular "actions" and "async". Use async actions if you want to run async functions. Each actions name is specified by its key (ex. The "INCREMENT" action is the name of the action). 

<b>*** NOTE The names LOADING, SUCCESS, FAIL, and PROGRESS are reserved and may not be used as action names</b>

```
    actions: { 
            INCREMENT: {
                type: "action",
                job: (state) => {
                    return {
                        item: state.item + 1
                    }
                }
            },
            DECREMENT: {
                type: "action",
                job: (state) => {
                    return {
                        item: state.item + 1
                    }
                }
            },
            GET_COUNT: {
                type: "async",
                job: async (state, onSuccess, onFail, onProgress) => {
                    try {
                        let res = await axios.get('http://www.example.com')
                        
                        onProgress({percent: 50})

                        res = await axios.get('http://www.example.com')

                        return onSuccess({
                            item: res.count,
                            percent: 100
                        })
                    }
                    catch(e) {
                        return onFail({error: e.message})
                    }
                }
            }
        }
```
In the above example we have an asynchronous action GET_COUNT. Notice unlike regular actions instead of only having "state" we also have "onSuccess", "onFail", and "onProgress". On success and on fail are to give the final status of your get count and should be returned by the async function. On progress however can run throughout the asynchronous funtion until a final status is needed.
### Add reducer to global state
In order to use global state, diffuse will need to be imported into the root App of your project like so:
```
    import Diffuse from "./Diffuse";
    import count from "./StateManagement/count";
    import { AReducer } from "./StateManagement/States";

    function App() {
        const reducers = [
            count.initialize(AReducer),
        ]

        return (
            <Diffuse reducers={reducers}>
            <div className="App">
                <Text />
            </div>
            </Diffuse>
        );
    }

    export default App;
```
In the above example we import the count reducer and initialize it with a <b>unique reducer name</b> AReducer (AReducer is equal to the string "AReducer"). We then take the context Diffuse and wrap it around our main app. Now the global state can be <b>wired</b> to any component in our App.

### <b>Wire</b>
Lastly, we have wire. Wire is used to wire a component to a global state. Below we will wire a Text compononent to a global state AReducer

```
    import { useEffect, useState } from "react";
    import { wire } from "./Diffuse";
    import { AReducer } from "./StateManagement/States";

    const Text = (props) => {
        return (
            <div style={{ backgroundColor: 'red' }} onClick={() =>
                props.AReducer.dispatch({
                    type: "INCREMENT",
                })
            }>
            Items: {props.AReducer.store.item} 
            <Text2 />
            </div>
        );
    };

    export default wire({ fuseName: [AReducer], Child: Text });

```
(AReducer is a string equal to AReducer). Notice that we import "wire" at the top and use it at export on the bottom. We pass two parameters to the object the <b>fuseName</b> which is the reducer you'd like to reference and the <b>Child</b> which represents the component to wire the fuses to to get the store and dispatch of the reducer in your props. In this case Text will be fused to the AReducer component, causing it to rerender only when its props or AReducer's state changes.

Notice above we call the dispatch of AReducer by referencing it from props. ```props.AReducer.dispatch({type: 'INCREMENT'})``` this will cause ```props.AReducer.store.item``` to increment. Any other component inheriting the same reducer will rerender every time that dispatcher is called.
