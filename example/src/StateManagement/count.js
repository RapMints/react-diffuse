import { createReducer } from "react-diffuse";
import logger from "./middlewares/logger";

const reducer = createReducer({
  initialState: { item: 0 },
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
    }
  },
  middleware: {
    afterWare: [logger("after")],
    beforeWare: [logger("before")]
  }
});

export default reducer;
