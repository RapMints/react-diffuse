import logger from './middlewares/logger'
import axios from 'axios'
import { createReducer } from 'react-diffuse'
import socketClient  from "socket.io-client";

// const SERVER = "http://127.0.0.1:4002";

// const socket = socketClient(SERVER)

const reducer = createReducer({
    initialState: {
        percent: 100,
        item: 0,
    },
    actions: {
        INCREMENT: ({state, payload}) => {
            return {
                item: state.item + 1
            }
        },
        DECREMENT: ({state}) => {
            return {
                item: state.item - 1
            }
        },
        GET_COUNT: async function({ state, payload, callback }, {LOADING, PROGRESS, SUCCESS, FAIL}) {
          try {
            LOADING();
            // Replace the url with your own on beeceptor
            let ApiRes = await axios
              .get("https://diffuse4.free.beeceptor.com")
              .then(
                (value) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(value);
                    }, 1000);
                  })
              );
            PROGRESS({ percent: 50 });
            let sleep = new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            });
    
            await sleep;

            SUCCESS({ item: state.item + 1, percent: 100 });
          } catch (e) {
            FAIL({ error: e.message});
          }
        }
    },
    selectors: {
      MySelector: [(state) => `item is ${state.item}`, (string) => `STRING: ${string}`]
    },
    middleWare: {
      afterWare: [
        logger("after")
      ],
    }
})

export default reducer
