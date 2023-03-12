export default (name) => (storeName, state, action) => async () => {
  console.log(`${name.toUpperCase()}: Store: ${storeName}, Item: ${state.item}, Action: ${action.type}`);
};
