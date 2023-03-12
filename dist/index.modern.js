import React, { useState, useLayoutEffect, useMemo } from 'react';

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

function mergeSelectors(selector, currentState) {
  var stateSelections, value;
  if (selector.length === 0) {
    throw 'DiffuseError: No selectors specified';
  }
  if (selector.length === 1) {
    value = selector[0](currentState);
  } else {
    var selectors = [].concat(selector);
    var lastSelector = selectors.pop();
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
var StateMachine = /*#__PURE__*/function () {
  function StateMachine() {
    var _this = this;
    this.createReducer = function (_ref) {
      var initialState = _ref.initialState,
        actions = _ref.actions,
        selectors = _ref.selectors,
        _ref$middleWare = _ref.middleWare,
        middleWare = _ref$middleWare === void 0 ? {} : _ref$middleWare,
        _ref$options = _ref.options,
        options = _ref$options === void 0 ? {} : _ref$options;
      var that = _this;
      var defaultOptions = {
        useDiffuseAsync: true,
        useDiffuseInitializeState: true,
        useDiffuseWebsocket: true,
        plugins: []
      };
      var config = _extends({}, defaultOptions, options);
      return {
        createStore: function createStore(storeName, props) {
          if (props === void 0) {
            props = null;
          }
          var diffuseState = {
            diffuse: _extends({}, config.useDiffuseAsync === true && {
              loading: false,
              error: false
            }, config.useDiffuseWebsocket === true && {
              connectionStatus: 'DISCONNECTED'
            })
          };
          var initState = _extends({}, Object.keys(diffuseState.diffuse).length !== 0 && _extends({}, diffuseState), initialState);
          that.initialState[storeName] = _extends({}, initState);
          that.state[storeName] = _extends({}, initState);
          that.selectors[storeName] = {};
          that.selections[storeName] = {};
          that.actions[storeName] = {};
          that.props[storeName] = props;
          var newActions = _extends({}, config.useDiffuseInitializeState === true && {
            INITIALIZE_STATE: function INITIALIZE_STATE(_ref2) {
              var _ref2$payload = _ref2.payload,
                payload = _ref2$payload === void 0 ? {} : _ref2$payload;
              return _extends({}, initState, payload);
            }
          }, config.useDiffuseAsync === true && {
            LOADING: function LOADING(_ref3) {
              var state = _ref3.state;
              return {
                diffuse: _extends({}, state.diffuse, {
                  loading: true,
                  error: false
                })
              };
            },
            SUCCESS: function SUCCESS(_ref4) {
              var state = _ref4.state,
                payload = _ref4.payload;
              return _extends({
                diffuse: _extends({}, state.diffuse, {
                  loading: false,
                  error: false
                })
              }, payload);
            },
            PROGRESS: function PROGRESS(_ref5) {
              var payload = _ref5.payload;
              return _extends({}, payload);
            },
            FAIL: function FAIL(_ref6) {
              var state = _ref6.state,
                payload = _ref6.payload;
              return _extends({
                diffuse: _extends({}, state.diffuse, {
                  loading: false,
                  error: true
                })
              }, payload);
            }
          }, config.useDiffuseWebsocket === true && {
            MESSAGE_RECIEVED: function MESSAGE_RECIEVED(_ref7) {
              var payload = _ref7.payload;
              return _extends({}, payload);
            },
            EMIT: function EMIT(_ref8) {
              var payload = _ref8.payload;
              return _extends({}, payload);
            },
            CONNECT: function CONNECT(_ref9) {
              var state = _ref9.state,
                payload = _ref9.payload;
              return _extends({
                diffuse: _extends({}, state.diffuse, {
                  connectionStatus: 'CONNECTED'
                })
              }, payload);
            },
            DISCONNECT: function DISCONNECT(_ref10) {
              var state = _ref10.state,
                payload = _ref10.payload;
              return _extends({
                diffuse: _extends({}, state.diffuse, {
                  connectionStatus: 'DISCONNECTED'
                })
              }, payload);
            },
            CONNECT_ERROR: function CONNECT_ERROR(_ref11) {
              var state = _ref11.state,
                payload = _ref11.payload;
              return _extends({
                diffuse: _extends({}, state.diffuse, {
                  connectionStatus: 'FAILED'
                })
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
              var _ref12 = _temp === void 0 ? {} : _temp,
                type = _ref12.type,
                payload = _ref12.payload,
                callback = _ref12.callback;
              if (that.actions[storeName][type] === undefined) {
                console.warn("Action doesn't exist.");
                return;
              }
              that.dispatch(storeName)({
                type: type,
                payload: payload != null ? payload : undefined,
                callback: callback
              });
            },
            getAction: function getAction(actionName) {
              var action = function action(payload, callback) {
                return store.dispatch({
                  type: actionName,
                  payload: payload,
                  callback: callback
                });
              };
              return action;
            },
            getActions: function getActions() {
              var _that$actions;
              var actions = {};
              var reduceFunction = function reduceFunction(prev, actionName) {
                prev[actionName] = store.getAction(actionName);
                return prev;
              };
              actions = Object.keys((_that$actions = that.actions) === null || _that$actions === void 0 ? void 0 : _that$actions[storeName]).reduce(reduceFunction, actions);
              return actions;
            },
            addAction: function addAction(actionName, action) {
              that.actions[storeName][actionName] = {
                "function": action
              };
            },
            removeAction: function removeAction(actionName) {
              var _that$actions2;
              that === null || that === void 0 ? true : (_that$actions2 = that.actions) === null || _that$actions2 === void 0 ? true : delete _that$actions2[storeName][actionName];
            },
            addMiddleWare: function addMiddleWare(_temp2) {
              var _ref13 = _temp2 === void 0 ? {} : _temp2,
                _ref13$afterWare = _ref13.afterWare,
                afterWare = _ref13$afterWare === void 0 ? null : _ref13$afterWare,
                _ref13$beforeWare = _ref13.beforeWare,
                beforeWare = _ref13$beforeWare === void 0 ? null : _ref13$beforeWare;
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
            getSelection: function getSelection(selectorName) {
              return that.selections[storeName][selectorName];
            },
            getSelections: function getSelections() {
              return that.selections[storeName];
            },
            getSelectors: function getSelectors() {
              return that.selectors[storeName];
            },
            createSelector: function createSelector(selectorName) {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              that.selectors[storeName][selectorName] = args;
              that.selections[storeName][selectorName] = function () {
                return that.useSelectionHook(store, args);
              };
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
          var fuseBox = {
            name: storeName,
            actions: store.getActions(),
            useState: function useState$1() {
              var _useState2 = useState(store.getState()),
                fuse = _useState2[0],
                setFuse = _useState2[1];
              useLayoutEffect(function () {
                var handleReducerChange = function handleReducerChange(newStore) {
                  setFuse(newStore);
                };
                _this.addFuseListener(store.name, handleReducerChange);
                return function () {
                  _this.removeFuseListener(store.name, handleReducerChange);
                };
              }, []);
              var state = fuse;
              return state;
            },
            selectors: store.getSelections()
          };
          return fuseBox;
        }
      };
    };
    this.useSelectionHook = function (store, selector) {
      var selection = mergeSelectors(selector, store.getState());
      var _useState3 = useState(selection),
        fuseSelection = _useState3[0],
        setFuseSelection = _useState3[1];
      useLayoutEffect(function () {
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
        _this.addFuseListener(store.name, handleReducerChange);
        return function () {
          _this.removeFuseListener(store.name, handleReducerChange);
        };
      }, []);
      if (fuseSelection.value instanceof Function) {
        return fuseSelection.value.apply(fuseSelection, fuseSelection.stateSelections);
      } else {
        return fuseSelection.value;
      }
    };
    this.dispatch = function (storeName) {
      return function (_ref14) {
        var _ref14$type = _ref14.type,
          type = _ref14$type === void 0 ? '' : _ref14$type,
          _ref14$payload = _ref14.payload,
          payload = _ref14$payload === void 0 ? null : _ref14$payload,
          callback = _ref14.callback;
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
              return Promise.resolve(_this.runAction(storeName, action, payload, callback)).then(function (result) {
                function _temp10() {
                  return _this.state[storeName];
                }
                _this.dispatchReducerListeners(storeName, result);
                var _temp9 = function () {
                  if (afterWare.length !== 0) {
                    var _temp8 = _forTo(afterWare, function (i) {
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
                    if (_temp8 && _temp8.then) return _temp8.then(function () {});
                  }
                }();
                return _temp9 && _temp9.then ? _temp9.then(_temp10) : _temp10(_temp9);
              });
            }
            var _temp11 = function () {
              if (beforeWare.length !== 0) {
                var _temp5 = _forTo(beforeWare, function (i) {
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
                if (_temp5 && _temp5.then) return _temp5.then(function () {});
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
    this.selections = {};
    this.history = {};
    this.props = {};
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
    var _this$actions$storeNa, _this$actions, _this$actions$storeNa2;
    return (_this$actions$storeNa = (_this$actions = this.actions) === null || _this$actions === void 0 ? void 0 : (_this$actions$storeNa2 = _this$actions[storeName]) === null || _this$actions$storeNa2 === void 0 ? void 0 : _this$actions$storeNa2[actionName]) != null ? _this$actions$storeNa : null;
  };
  _proto.getFromMiddleWare = function getFromMiddleWare(storeName) {
    var _this2 = this;
    return Promise.resolve(function (middleWare, _ref15) {
      var _ref15$type = _ref15.type,
        type = _ref15$type === void 0 ? '' : _ref15$type,
        _ref15$payload = _ref15.payload,
        payload = _ref15$payload === void 0 ? null : _ref15$payload;
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
  _proto.runAction = function runAction(storeName, action, payload, callback) {
    if (callback === void 0) {
      callback = function callback() {
        return undefined;
      };
    }
    try {
      var _this3 = this;
      var result;
      var stores = Object.keys(_this3.store).reduce(function (previous, current) {
        previous[_this3.store[current].name] = {
          state: _this3.store[current].getState(),
          actions: _this3.store[current].getActions()
        };
        return previous;
      }, {});
      var store = stores[storeName];
      var actions = store.actions;
      var _temp14 = function () {
        if (action instanceof Function) {
          result = action(_extends({
            state: _this3.getCurrentState(storeName),
            payload: payload,
            callback: callback
          }, _this3.props[storeName] !== null && {
            props: _this3.props[storeName]
          }), actions, stores);
          var _temp13 = function () {
            if (isPromise(result)) {
              return Promise.resolve(result).then(function (_result) {
                result = _result;
              });
            }
          }();
          if (_temp13 && _temp13.then) return _temp13.then(function () {});
        }
      }();
      return Promise.resolve(_temp14 && _temp14.then ? _temp14.then(function () {
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

function useActions(fuseBox) {
  return fuseBox.actions;
}
function useDispatch(fuseBox) {
  return StateMachine$1.store[fuseBox.name].dispatch;
}
function useFuse(fuseBox) {
  return fuseBox.useState();
}
function useSelectors(fuseBox) {
  return StateMachine$1.store[fuseBox.name].getSelectors();
}
function useFuseSelection(fuseBox, selector) {
  return StateMachine$1.useSelectionHook(fuseBox, selector);
}
var connectWire = function connectWire(fuseBox, Child) {
  return function (props) {
    var _fuse;
    var context = fuseBox.useState();
    var dispatch = useDispatch(fuseBox);
    var actions = fuseBox.actions;
    var fuse = (_fuse = {}, _fuse[fuseBox.name] = {
      store: context,
      dispatch: dispatch,
      actions: actions
    }, _fuse);
    return useMemo(function () {
      return /*#__PURE__*/React.createElement(Child, _extends({}, fuse, props));
    }, [props, context]);
  };
};
var wire = function wire(fuseBoxes) {
  if (fuseBoxes === void 0) {
    fuseBoxes = [];
  }
  return function (Child) {
    var newChild = Child;
    fuseBoxes.forEach(function (fuseBox) {
      newChild = connectWire(fuseBox, newChild);
    });
    return newChild;
  };
};
var createReducer = StateMachine$1.createReducer;

export { createReducer, useActions, useDispatch, useFuse, useFuseSelection, useSelectors, wire };
//# sourceMappingURL=index.modern.js.map
