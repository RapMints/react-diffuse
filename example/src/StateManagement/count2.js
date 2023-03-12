import {createReducer} from "react-diffuse";
import logger from "./middlewares/logger";

const reducer = createReducer({
  initialState: { item: 0 },
  actions: {
    INCREMENT: ({state, payload}, {}, {BReducer}) => {
      console.log(BReducer.state)
      BReducer.actions.INCREMENT()
      
      return {
        item: state.item + 1
      };
      
    },
    DECREMENT: ({state}) => {
      return {
        item: state.item - 1
      };
    }
  },
  middleWare: {
    afterWare: [
      logger("after")
    ],
    beforeWare: [
      logger("before")
    ]
  },
  selectors: {
    MySelector: [(state) => `${state.item}`, (string)=> (`Test String ${string}`)]
  },
});

export default reducer;
