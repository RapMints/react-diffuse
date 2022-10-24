import logger from './middlewares/logger'
import axios from 'axios'
import { createReducer } from 'react-diffuse'

const reducer = createReducer({
    initialState: {
        percent: 100,
        item: 0
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
        GET_COUNT: async function({ state, payload }, {LOADING, PROGRESS, SUCCESS, FAIL}) {
          try {
            LOADING();
            // Replace the url with your own on beeceptor
            let ApiRes = await axios
              .get("https://diffuse.free.beeceptor.com")
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
            FAIL({ error: e.message });
          }
        }
    },
    middleWare: {
      afterWare: [
        logger("after")
      ],
      beforeWare: [
        logger("before")
      ]
    }
})

export default reducer
