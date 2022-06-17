export default (name) => (action) => {
  console.log(name, action.type, action.store);
};
