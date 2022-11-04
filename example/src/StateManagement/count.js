import {createReducer} from "react-diffuse";
import logger from "./middlewares/logger";

const reducer = createReducer({
  initialState: { item: 0 },
  actions: {
    INCREMENT: ({state, payload}) => {
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
  }
});

export default reducer;
