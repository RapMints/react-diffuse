function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

var StateMachine = /*#__PURE__*/function () {
  function StateMachine() {
    var _this = this;

    this.createReducer = function (_ref) {
      var _ref$initialState = _ref.initialState,
          initialState = _ref$initialState === void 0 ? {} : _ref$initialState,
          _ref$actions = _ref.actions,
          actions = _ref$actions === void 0 ? {} : _ref$actions,
          _ref$selectors = _ref.selectors,
          selectors = _ref$selectors === void 0 ? {} : _ref$selectors,
          _ref$middleWare = _ref.middleWare,
          middleWare = _ref$middleWare === void 0 ? {} : _ref$middleWare;
      var that = _this;
      return {
        createStore: function createStore(storeName) {
          var initState = _extends({},  {
            diffuse: {
              loading: false,
              error: false
            }
          }, initialState);

          that.initialState[storeName] = _extends({}, initState);
          that.state[storeName] = _extends({}, initState);
          that.selectors[storeName] = {};
          that.actions[storeName] = {};

          var newActions = _extends({},  {
            INITIALIZE_STATE: function INITIALIZE_STATE(state, payload) {
              if (payload === void 0) {
                payload = {};
              }

              return _extends({
                diffuse: {
                  loading: false,
                  error: false
                }
              }, initialState, payload);
            }
          },  {
            LOADING: function LOADING(_ref2) {
              return {
                diffuse: {
                  loading: true,
                  error: false
                }
              };
            },
            SUCCESS: function SUCCESS(_ref3) {
              var payload = _ref3.payload;
              return _extends({
                diffuse: {
                  loading: false,
                  error: false
                }
              }, payload);
            },
            PROGRESS: function PROGRESS(_ref4) {
              var payload = _ref4.payload;
              return _extends({}, payload);
            },
            FAIL: function FAIL(_ref5) {
              var payload = _ref5.payload;
              return _extends({
                diffuse: {
                  loading: false,
                  error: true
                }
              }, payload);
            }
          }, actions);

          that.history[storeName] = {
            undo: [],
            redo: []
          };
          that.storeDict[storeName] = true;
          that.listener[storeName] = [];
          that.middleWare[storeName] = {
            beforeWare: [],
            afterWare: []
          };
          var store = {
            name: storeName,
            getHistory: function getHistory() {
              return that.history[storeName];
            },
            getState: function getState() {
              var _that$state;

              return (_that$state = that.state) === null || _that$state === void 0 ? void 0 : _that$state[storeName];
            },
            getInitialState: function getInitialState() {
              var _that$initialState;

              return (_that$initialState = that.initialState) === null || _that$initialState === void 0 ? void 0 : _that$initialState[storeName];
            },
            dispatch: function dispatch(_temp) {
              var _ref6 = _temp === void 0 ? {} : _temp,
                  type = _ref6.type,
                  payload = _ref6.payload;

              if (that.actions[storeName][type] === undefined) {
                console.warn("Action doesn't exist.");
                return;
              }

              that.dispatch(storeName)({
                type: type,
                payload: payload != null ? payload : undefined
              });
            },
            getAction: function getAction(actionName) {
              return function (payload) {
                return store.dispatch({
                  type: actionName,
                  payload: payload
                });
              };
            },
            getActions: function getActions() {
              var _that$actions;

              return Object.keys((_that$actions = that.actions) === null || _that$actions === void 0 ? void 0 : _that$actions[storeName]).reduce(function (prev, actionName) {
                prev[actionName] = store.getAction(actionName);
                return prev;
              }, {});
            },
            addAction: function addAction(actionName, action) {
              that.actions[storeName][actionName] = {
                "function": action
              };
            },
            removeAction: function removeAction(actionName) {
              var _this$actions;

              _this === null || _this === void 0 ? true : (_this$actions = _this.actions) === null || _this$actions === void 0 ? true : delete _this$actions[storeName][actionName];
            },
            addMiddleWare: function addMiddleWare(_temp2) {
              var _ref7 = _temp2 === void 0 ? {} : _temp2,
                  _ref7$afterWare = _ref7.afterWare,
                  afterWare = _ref7$afterWare === void 0 ? null : _ref7$afterWare,
                  _ref7$beforeWare = _ref7.beforeWare,
                  beforeWare = _ref7$beforeWare === void 0 ? null : _ref7$beforeWare;

              if (afterWare !== null) {
                var _that$middleWare;

                (_that$middleWare = that.middleWare) === null || _that$middleWare === void 0 ? void 0 : _that$middleWare[storeName].afterWare.push(afterWare);
              } else if (beforeWare !== null) {
                var _that$middleWare2;

                (_that$middleWare2 = that.middleWare) === null || _that$middleWare2 === void 0 ? void 0 : _that$middleWare2[storeName].beforeWare.push(beforeWare);
              }
            },
            getSelector: function getSelector(selectorName) {
              return that.selectors[storeName][selectorName];
            },
            getSelectors: function getSelectors() {
              return that.selectors[storeName];
            },
            createSelector: function createSelector(selectorName) {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }

              that.selectors[storeName][selectorName] = args;
            },
            getMiddleWare: function getMiddleWare() {
              return that.middleWare[storeName];
            },
            undo: function undo() {
              var history = store.getHistory();

              if (history.undo.length > 0) {
                var lastState = history.undo.pop();
                var currentState = store.getState();
                history.redo.push(currentState);
                that.dispatchReducerListeners(storeName, lastState, true);
              } else {
                console.log('Nothing to undo');
              }
            },
            redo: function redo() {
              var history = store.getHistory();

              if (history.redo.length > 0) {
                var nextState = history.redo.pop();
                var currentState = store.getState();
                history.undo.push(currentState);
                that.dispatchReducerListeners(storeName, nextState, true);
              } else {
                console.log('Nothing to redo');
              }
            }
          };

          for (var actionName in newActions) {
            store.addAction(actionName, newActions[actionName]);
          }

          if (middleWare !== null && middleWare !== void 0 && middleWare.beforeWare) {
            for (var index in middleWare.beforeWare) {
              store.addMiddleWare({
                beforeWare: middleWare.beforeWare[index]
              });
            }
          }

          if (middleWare !== null && middleWare !== void 0 && middleWare.afterWare) {
            for (var _index in middleWare.afterWare) {
              store.addMiddleWare({
                afterWare: middleWare.afterWare[_index]
              });
            }
          }

          for (var selectorName in selectors) {
            store.createSelector.apply(store, [selectorName].concat(selectors[selectorName]));
          }

          that.store[storeName] = store;
          return {
            name: storeName
          };
        }
      };
    };

    this.dispatch = function (storeName) {
      return function (_ref8) {
        var _ref8$type = _ref8.type,
            type = _ref8$type === void 0 ? '' : _ref8$type,
            _ref8$payload = _ref8.payload,
            payload = _ref8$payload === void 0 ? null : _ref8$payload;

        try {
          var _this$middleWare$stor, _this$middleWare, _this$middleWare$stor2, _this$middleWare$stor3, _this$middleWare2, _this$middleWare2$sto;

          var action = _this.getAction(storeName, type)["function"];

          if (action === null) {
            console.error('Action or reducer doesnt exist');
            return Promise.resolve();
          }

          var beforeWare = (_this$middleWare$stor = (_this$middleWare = _this.middleWare) === null || _this$middleWare === void 0 ? void 0 : (_this$middleWare$stor2 = _this$middleWare[storeName]) === null || _this$middleWare$stor2 === void 0 ? void 0 : _this$middleWare$stor2.beforeWare) != null ? _this$middleWare$stor : [];
          var afterWare = (_this$middleWare$stor3 = (_this$middleWare2 = _this.middleWare) === null || _this$middleWare2 === void 0 ? void 0 : (_this$middleWare2$sto = _this$middleWare2[storeName]) === null || _this$middleWare2$sto === void 0 ? void 0 : _this$middleWare2$sto.afterWare) != null ? _this$middleWare$stor3 : [];
          return Promise.resolve(_this.getFromMiddleWare(storeName)).then(function (runMiddleWare) {
            function _temp12() {
              return Promise.resolve(_this.runAction(storeName, action, payload)).then(function (result) {
                function _temp10() {
                  return _this.state[storeName];
                }

                _this.dispatchReducerListeners(storeName, result);

                var _temp9 = function () {
                  if (afterWare.length !== 0) {
                    var _temp13 = _forTo(afterWare, function (i) {
                      function _temp7() {
                        _this.dispatchReducerListeners(storeName, result);
                      }

                      var middleWareIsAsync = isAsync(afterWare[i]);
                      var result;
                      var executeMiddleWare = runMiddleWare(afterWare[i], {
                        type: type,
                        payload: payload
                      });

                      var _temp6 = function () {
                        if (middleWareIsAsync) {
                          return Promise.resolve(executeMiddleWare()).then(function (_executeMiddleWare2) {
                            result = _executeMiddleWare2;
                          });
                        } else {
                          result = executeMiddleWare();
                        }
                      }();

                      return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
                    });

                    if (_temp13 && _temp13.then) return _temp13.then(function () {});
                  }
                }();

                return _temp9 && _temp9.then ? _temp9.then(_temp10) : _temp10(_temp9);
              });
            }

            var _temp11 = function () {
              if (beforeWare.length !== 0) {
                var _temp14 = _forTo(beforeWare, function (i) {
                  function _temp4() {
                    _this.dispatchReducerListeners(storeName, result);
                  }

                  var middleWareIsAsync = isAsync(beforeWare[i]);
                  var result;
                  var executeMiddleWare = runMiddleWare(beforeWare[i], {
                    type: type,
                    payload: payload
                  });

                  var _temp3 = function () {
                    if (middleWareIsAsync) {
                      return Promise.resolve(executeMiddleWare()).then(function (_executeMiddleWare) {
                        result = _executeMiddleWare;
                      });
                    } else {
                      result = executeMiddleWare();
                    }
                  }();

                  return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
                });

                if (_temp14 && _temp14.then) return _temp14.then(function () {});
              }
            }();

            return _temp11 && _temp11.then ? _temp11.then(_temp12) : _temp12(_temp11);
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };
    };

    this.state = {};
    this.actions = {};
    this.middleWare = {};
    this.listener = {};
    this.initialState = {};
    this.store = {};
    this.storeDict = [];
    this.selectors = {};
    this.history = [];
  }

  var _proto = StateMachine.prototype;

  _proto.addFuseListener = function addFuseListener(storeName, func) {
    if (this.storeDict[storeName]) {
      if (this.listener[storeName] === undefined) {
        this.listener[storeName] = [];
      }

      this.listener[storeName].push(func);
    } else {
      console.warn("Reducer doesn't exist");
    }
  };

  _proto.removeFuseListener = function removeFuseListener(storeName, func) {
    if (this.storeDict.includes(storeName)) {
      var _this$listener;

      var reducerListener = (_this$listener = this.listener) === null || _this$listener === void 0 ? void 0 : _this$listener[storeName];

      if (reducerListener !== undefined) {
        var indexToRemove = reducerListener.indexOf(func);
        this.listener[storeName].splice(indexToRemove, indexToRemove + 1);
      } else {
        console.warn("Reducer doesn't exist");
      }
    } else {
      console.warn("Reducer doesn't exist");
    }
  };

  _proto.dispatchReducerListeners = function dispatchReducerListeners(storeName, result, dontSaveToHistory) {
    if (dontSaveToHistory === void 0) {
      dontSaveToHistory = false;
    }

    if (result !== undefined) {
      var _this$history$storeNa;

      if (dontSaveToHistory === false) {
        if (this.history[storeName].redo.length !== 0) {
          this.history[storeName].redo = [];
        }
      }

      var undoCount = (_this$history$storeNa = this.history[storeName]) === null || _this$history$storeNa === void 0 ? void 0 : _this$history$storeNa.undo.length;
      var currentState = this.getCurrentState(storeName);

      if (dontSaveToHistory === false) {
        var _this$history$storeNa2;

        if (undoCount !== 0 && ((_this$history$storeNa2 = this.history[storeName]) === null || _this$history$storeNa2 === void 0 ? void 0 : _this$history$storeNa2.undo[undoCount - 1]) !== currentState || undoCount === 0) {
          this.history[storeName].undo.push(this.getCurrentState(storeName));
        }
      }

      this.state[storeName] = _extends({}, this.getCurrentState(storeName), result);

      if (this.listener[storeName] !== undefined) {
        for (var _i = 0; _i < this.listener[storeName].length; _i++) {
          this.listener[storeName][_i](this.state[storeName]);
        }
      }
    }
  };

  _proto.getCurrentState = function getCurrentState(storeName) {
    return this.state[storeName];
  };

  _proto.getAction = function getAction(storeName, actionName) {
    var _this$actions$storeNa, _this$actions2, _this$actions2$storeN;

    return (_this$actions$storeNa = (_this$actions2 = this.actions) === null || _this$actions2 === void 0 ? void 0 : (_this$actions2$storeN = _this$actions2[storeName]) === null || _this$actions2$storeN === void 0 ? void 0 : _this$actions2$storeN[actionName]) != null ? _this$actions$storeNa : null;
  };

  _proto.getFromMiddleWare = function getFromMiddleWare(storeName) {
    var _this2 = this;

    return Promise.resolve(function (middleWare, _ref9) {
      var _ref9$type = _ref9.type,
          type = _ref9$type === void 0 ? '' : _ref9$type,
          _ref9$payload = _ref9.payload,
          payload = _ref9$payload === void 0 ? null : _ref9$payload;
      var middleWareSelection = middleWare(storeName);
      var executeMiddleWare = middleWareSelection(_this2.getCurrentState(storeName));
      var isAsync = executeMiddleWare.constructor.name === 'AsyncFunction';

      if (isAsync === true) {
        return function () {
          try {
            return Promise.resolve(executeMiddleWare({
              type: type,
              payload: payload
            }));
          } catch (e) {
            return Promise.reject(e);
          }
        };
      } else {
        return function () {
          return executeMiddleWare({
            type: type,
            payload: payload
          });
        };
      }
    });
  };

  _proto.runAction = function runAction(storeName, action, payload) {
    try {
      var _this4 = this;

      var result;
      var store = _this4.store[storeName];
      var actions = store.getActions();

      var _temp17 = function () {
        if (action instanceof Function) {
          result = action({
            state: _this4.getCurrentState(storeName),
            payload: payload
          }, actions);

          var _temp18 = function () {
            if (isPromise(result)) {
              return Promise.resolve(result).then(function (_result) {
                result = _result;
              });
            }
          }();

          if (_temp18 && _temp18.then) return _temp18.then(function () {});
        }
      }();

      return Promise.resolve(_temp17 && _temp17.then ? _temp17.then(function () {
        return result;
      }) : result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.runAsyncAction = function runAsyncAction(storeName, action, payload) {
    try {
      var _this6 = this;

      var result;
      var store = _this6.store[storeName];
      var actions = store.getActions();

      var _temp20 = function () {
        if (action instanceof Function) {
          return Promise.resolve(action({
            state: _this6.getCurrentState(storeName),
            payload: payload
          }, actions)).then(function (_action) {
            result = _action;
          });
        }
      }();

      return Promise.resolve(_temp20 && _temp20.then ? _temp20.then(function () {
        return result;
      }) : result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return StateMachine;
}();

function isPromise(p) {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
}

function isAsync(func) {
  try {
    return func.constructor.name === 'AsyncFunction' || isPromise(func({}, {}));
  } catch (e) {
    return false;
  }
}

var StateMachine$1 = new StateMachine();

function useActions(store) {
  return StateMachine$1.store[store.name].getActions();
}

function useDispatch(store) {
  return StateMachine$1.store[store.name].dispatch;
}

function useFuse(store) {
  var _useState = React.useState(StateMachine$1.store[store.name].getState()),
      fuse = _useState[0],
      setFuse = _useState[1];

  React.useLayoutEffect(function () {
    var handleReducerChange = function handleReducerChange(newStore) {
      setFuse(newStore);
    };

    StateMachine$1.addFuseListener(store.name, handleReducerChange);
    return function () {
      StateMachine$1.removeFuseListener(store.name, handleReducerChange);
    };
  }, []);
  return fuse;
}

function useSelectors(store) {
  return StateMachine$1.store[store.name].getSelectors();
}

function mergeSelectors(selector, currentState) {
  var selectors = [].concat(selector);
  var lastSelector = selectors.pop();
  var value;
  var stateSelections;

  if (selectors.length === 0) {
    value = lastSelector(currentState);
  } else {
    stateSelections = selectors.map(function (arg) {
      return arg(currentState);
    });
    value = lastSelector;
  }

  return _extends({
    value: value
  }, stateSelections && {
    stateSelections: stateSelections
  });
}

function useFuseSelector(store, selector) {
  var selection = mergeSelectors(selector, StateMachine$1.store[store.name].getState());

  var _useState2 = React.useState(selection),
      fuseSelection = _useState2[0],
      setFuseSelection = _useState2[1];

  React.useLayoutEffect(function () {
    var handleReducerChange = function handleReducerChange(newStore) {
      var newFuseSelection = mergeSelectors(selector, newStore);
      var shouldUpdate = false;

      if (newFuseSelection.value instanceof Function) {
        for (var i = 0; i < newFuseSelection.stateSelections.length; i++) {
          if (newFuseSelection.stateSelections[i] !== fuseSelection.stateSelections[i]) {
            shouldUpdate = true;
            break;
          }
        }
      } else if (newFuseSelection.value !== fuseSelection.value) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setFuseSelection(newFuseSelection);
      }
    };

    StateMachine$1.addFuseListener(store.name, handleReducerChange);
    return function () {
      StateMachine$1.removeFuseListener(store.name, handleReducerChange);
    };
  }, []);

  if (fuseSelection.value instanceof Function) {
    return fuseSelection.value.apply(fuseSelection, fuseSelection.stateSelections);
  } else {
    return fuseSelection.value;
  }
}

var connectWire = function connectWire(store, Child) {
  return function (props) {
    var _fuse;

    var context = useFuse(store);
    var dispatch = useDispatch(store);
    var actions = useActions(store);
    var fuse = (_fuse = {}, _fuse[store.name] = {
      store: context,
      dispatch: dispatch,
      actions: actions
    }, _fuse);
    return React.useMemo(function () {
      return /*#__PURE__*/React__default.createElement(Child, _extends({}, fuse, props));
    }, [props, context]);
  };
};

var wire = function wire(stores) {
  if (stores === void 0) {
    stores = [];
  }

  return function (Child) {
    var newChild = Child;
    stores.forEach(function (store) {
      newChild = connectWire(store, newChild);
    });
    return newChild;
  };
};

var createReducer = StateMachine$1.createReducer;

exports.createReducer = createReducer;
exports.useActions = useActions;
exports.useDispatch = useDispatch;
exports.useFuse = useFuse;
exports.useFuseSelector = useFuseSelector;
exports.useSelectors = useSelectors;
exports.wire = wire;
//# sourceMappingURL=index.js.map
