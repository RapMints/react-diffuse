import { createReducer } from "react-diffuse";
import logger from "./middlewares/logger";
import axios from "axios";

const reducer = createReducer({
  initialState: {
    percent: 100,
    item: 0
  },
  actions: {
    INCREMENT: {
      type: "action",
      job: (state, payload) => {
        return {
          item: state.item + 1
        };
      }
    },
    DECREMENT: {
      type: "action",
      job: (state) => {
        return {
          item: state.item - 1
        };
      }
    },
    GET_COUNT: {
      type: "async",
      job: async ({state, payload}, onSuccess, onFail, onProgress) => {
        try {
          console.log(payload)
          onProgress({percent: 0})
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
            onProgress({percent: 50})
            let sleep = new Promise((resolve) => {
              setTimeout(() => {
                  resolve()
              }, 1000)
            })
            
            await sleep

          return onSuccess({ item: state.item + 1 , percent: 100});
        } catch (e) {
          return onFail({ error: e.message });
        }
      }
    }
  },
  middleware: {
    afterWare: [
      logger("after")
    ],
    beforeWare: [
      logger("before")
    ]
  }
});

export default reducer;
