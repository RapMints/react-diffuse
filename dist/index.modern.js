import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';

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

var Reducer = function Reducer(create) {
  this.createStore = undefined;
  this.createFuseBox = create;
  this.createStore = create;
};
var StateMachine = /*#__PURE__*/function () {
  function StateMachine() {
    var _this = this;
    this.createReducer = function (_ref) {
      var initialState = _ref.initialState,
        actions = _ref.actions,
        selectors = _ref.selectors,
        middleWare = _ref.middleWare;
      var that = _this;
      var defaultOptions = {
        useDiffuseAsync: true,
        useDiffuseInitializeState: true,
        useDiffuseWebsocket: true,
        plugins: []
      };
      var config = _extends({}, defaultOptions);
      var create = function create(fuseBoxName, props) {
        var _initialState$diffuse;
        if (props === void 0) {
          props = null;
        }
        var diffuseState = {
          diffuse: _extends({}, config.useDiffuseAsync === true && {
            loading: false,
            error: false,
            completed: true
          }, config.useDiffuseWebsocket === true && {
            connectionStatus: 'DISCONNECTED'
          }, (_initialState$diffuse = initialState === null || initialState === void 0 ? void 0 : initialState.diffuse) != null ? _initialState$diffuse : {})
        };
        var initState = _extends({}, Object.keys(diffuseState.diffuse).length !== 0 && _extends({}, diffuseState), initialState);
        that.initialState[fuseBoxName] = _extends({}, initState);
        that.state[fuseBoxName] = _extends({}, initState);
        that.selectors[fuseBoxName] = {};
        that.selections[fuseBoxName] = {};
        that.actions[fuseBoxName] = {};
        that.props[fuseBoxName] = props;
        var newActions = _extends({}, config.useDiffuseInitializeState === true && {
          INITIALIZE_STATE: function INITIALIZE_STATE(_ref2) {
            var _ref2$payload = _ref2.payload,
              payload = _ref2$payload === void 0 ? {} : _ref2$payload;
            return _extends({}, initState, payload);
          }
        }, config.useDiffuseAsync === true && {
          LOADING: function LOADING(_ref3) {
            var state = _ref3.state,
              payload = _ref3.payload;
            return _extends({
              diffuse: _extends({}, state.diffuse, {
                loading: true,
                error: false,
                completed: false
              })
            }, payload);
          },
          SUCCESS: function SUCCESS(_ref4) {
            var state = _ref4.state,
              payload = _ref4.payload;
            return _extends({
              diffuse: _extends({}, state.diffuse, {
                loading: false,
                error: false,
                completed: true
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
                error: true,
                completed: false
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
        that.history[fuseBoxName] = {
          undo: [],
          redo: []
        };
        that.storeDict[fuseBoxName] = true;
        that.listener[fuseBoxName] = [];
        that.middleWare[fuseBoxName] = {
          beforeWare: [],
          afterWare: []
        };
        var store = {
          name: fuseBoxName,
          getHistory: function getHistory() {
            return that.history[fuseBoxName];
          },
          getState: function getState() {
            var _that$state;
            return (_that$state = that.state) === null || _that$state === void 0 ? void 0 : _that$state[fuseBoxName];
          },
          getInitialState: function getInitialState() {
            var _that$initialState;
            return (_that$initialState = that.initialState) === null || _that$initialState === void 0 ? void 0 : _that$initialState[fuseBoxName];
          },
          dispatch: function dispatch(_ref12) {
            var type = _ref12.type,
              payload = _ref12.payload,
              callback = _ref12.callback;
            if (that.actions[fuseBoxName][type] === undefined) {
              console.warn("Action doesn't exist.");
              return;
            }
            that.dispatch(fuseBoxName)({
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
            actions = Object.keys((_that$actions = that.actions) === null || _that$actions === void 0 ? void 0 : _that$actions[fuseBoxName]).reduce(reduceFunction, actions);
            return actions;
          },
          addAction: function addAction(actionName, action) {
            that.actions[fuseBoxName][actionName] = {
              "function": action
            };
          },
          removeAction: function removeAction(actionName) {
            var _that$actions2;
            that === null || that === void 0 ? true : (_that$actions2 = that.actions) === null || _that$actions2 === void 0 ? true : delete _that$actions2[fuseBoxName][actionName];
          },
          addMiddleWare: function addMiddleWare(_temp) {
            var _ref13 = _temp === void 0 ? {} : _temp,
              _ref13$afterWare = _ref13.afterWare,
              afterWare = _ref13$afterWare === void 0 ? null : _ref13$afterWare,
              _ref13$beforeWare = _ref13.beforeWare,
              beforeWare = _ref13$beforeWare === void 0 ? null : _ref13$beforeWare;
            if (afterWare !== null) {
              var _that$middleWare;
              (_that$middleWare = that.middleWare) === null || _that$middleWare === void 0 ? void 0 : _that$middleWare[fuseBoxName].afterWare.push(afterWare);
            } else if (beforeWare !== null) {
              var _that$middleWare2;
              (_that$middleWare2 = that.middleWare) === null || _that$middleWare2 === void 0 ? void 0 : _that$middleWare2[fuseBoxName].beforeWare.push(beforeWare);
            }
          },
          getSelector: function getSelector(selectorName) {
            return that.selectors[fuseBoxName][selectorName];
          },
          getSelection: function getSelection(selectorName) {
            return that.selections[fuseBoxName][selectorName];
          },
          getSelections: function getSelections() {
            return that.selections[fuseBoxName];
          },
          getSelectors: function getSelectors() {
            return that.selectors[fuseBoxName];
          },
          createSelector: function createSelector(selectorName) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            that.selectors[fuseBoxName][selectorName] = args;
            that.selections[fuseBoxName][selectorName] = function () {
              return that.useSelectionHook(store, args);
            };
          },
          getMiddleWare: function getMiddleWare() {
            return that.middleWare[fuseBoxName];
          },
          undo: function undo() {
            var history = store.getHistory();
            if (history.undo.length > 0) {
              var lastState = history.undo.pop();
              var currentState = store.getState();
              history.redo.push(currentState);
              that.dispatchReducerListeners(fuseBoxName, lastState, true);
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
              that.dispatchReducerListeners(fuseBoxName, nextState, true);
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
        that.store[fuseBoxName] = store;
        var promiseWrapper = function promiseWrapper(promise, status) {
          var suspender;
          var suspenderStatus = 'pending';
          var result;
          if (promise !== undefined) {
            suspender = promise.then(function (value) {
              suspenderStatus = 'success';
              result = value;
              status.current = undefined;
            }, function (error) {
              suspenderStatus = 'error';
              result = error;
              status.current = undefined;
            });
          }
          return function () {
            switch (suspenderStatus) {
              case 'pending':
                throw suspender;
              case 'success':
                return result;
              case 'error':
                throw result;
              default:
                throw new Error('Unknown status');
            }
          };
        };
        var fuseBox = {
          name: fuseBoxName,
          actions: store.getActions(),
          useState: function useState$1() {
            var _useState2 = useState(store.getState()),
              fuse = _useState2[0],
              setFuse = _useState2[1];
            var status = useRef();
            var run = useRef(function () {
              try {
                return Promise.resolve(new Promise(function (resolve) {
                  status.current = resolve;
                }));
              } catch (e) {
                return Promise.reject(e);
              }
            });
            var promise = useRef();
            useLayoutEffect(function () {
              if (status.current === undefined) {
                promise.current = run.current();
              }
              var handleReducerChange = function handleReducerChange(newStore) {
                var _newStore$diffuse, _newStore$diffuse2, _newStore$diffuse3, _newStore$diffuse4, _newStore$diffuse5, _newStore$diffuse6;
                var currentStatus;
                if ((newStore === null || newStore === void 0 ? void 0 : (_newStore$diffuse = newStore.diffuse) === null || _newStore$diffuse === void 0 ? void 0 : _newStore$diffuse.loading) === true && (newStore === null || newStore === void 0 ? void 0 : (_newStore$diffuse2 = newStore.diffuse) === null || _newStore$diffuse2 === void 0 ? void 0 : _newStore$diffuse2.completed) === false) {
                  currentStatus = 'pending';
                  promise.current = run.current();
                } else if ((newStore === null || newStore === void 0 ? void 0 : (_newStore$diffuse3 = newStore.diffuse) === null || _newStore$diffuse3 === void 0 ? void 0 : _newStore$diffuse3.loading) === false && (newStore === null || newStore === void 0 ? void 0 : (_newStore$diffuse4 = newStore.diffuse) === null || _newStore$diffuse4 === void 0 ? void 0 : _newStore$diffuse4.completed) === true) {
                  currentStatus = 'fulfilled';
                } else if ((newStore === null || newStore === void 0 ? void 0 : (_newStore$diffuse5 = newStore.diffuse) === null || _newStore$diffuse5 === void 0 ? void 0 : _newStore$diffuse5.loading) === false && (newStore === null || newStore === void 0 ? void 0 : (_newStore$diffuse6 = newStore.diffuse) === null || _newStore$diffuse6 === void 0 ? void 0 : _newStore$diffuse6.error) !== false) {
                  currentStatus = 'failed';
                }
                if (currentStatus === 'fulfilled' && status.current !== undefined) {
                  status.current(newStore);
                }
                setFuse(newStore);
              };
              _this.addFuseListener(store.name, handleReducerChange);
              return function () {
                _this.removeFuseListener(store.name, handleReducerChange);
              };
            }, []);
            console.log('status', status);
            console.log('promise', promise.current);
            if ((promise === null || promise === void 0 ? void 0 : promise.current) !== undefined && status.current !== undefined) {
              return promiseWrapper(promise.current, status)();
            }
            return fuse;
          },
          selectors: store.getSelections()
        };
        return fuseBox;
      };
      var reducer = new Reducer(create);
      return reducer;
    };
    this.useSelectionHook = function (store, selector) {
      var selection = _this.mergeSelectors(selector, store.getState());
      var _useState3 = useState(selection),
        fuseSelection = _useState3[0],
        setFuseSelection = _useState3[1];
      useLayoutEffect(function () {
        var handleReducerChange = function handleReducerChange(newStore) {
          var newFuseSelection = _this.mergeSelectors(selector, newStore);
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
          var _temp13 = function _temp13() {
            function _temp11() {
              return Promise.resolve(_this.runAction(storeName, action, payload, callback)).then(function (result) {
                function _temp9() {
                  return _this.state[storeName];
                }
                _this.dispatchReducerListeners(storeName, result);
                var _temp8 = function () {
                  if (afterWare.length !== 0) {
                    var _temp7 = _forTo(afterWare, function (i) {
                      function _temp6() {
                        _this.dispatchReducerListeners(storeName, result);
                      }
                      var result;
                      var executeMiddleWare = runMiddleWare(afterWare[i], {
                        type: type,
                        payload: payload
                      });
                      result = executeMiddleWare();
                      var _temp5 = function () {
                        if (isPromise(result) === true) {
                          return Promise.resolve(result).then(function (_result2) {
                            result = _result2;
                          });
                        }
                      }();
                      return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
                    });
                    if (_temp7 && _temp7.then) return _temp7.then(function () {});
                  }
                }();
                return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
              });
            }
            var _temp10 = function () {
              if (beforeWare.length !== 0) {
                var _temp4 = _forTo(beforeWare, function (i) {
                  function _temp3() {
                    _this.dispatchReducerListeners(storeName, result);
                  }
                  var middleWareIsAsync = isAsync(beforeWare[i]);
                  var result;
                  var executeMiddleWare = runMiddleWare(beforeWare[i], {
                    type: type,
                    payload: payload
                  });
                  result = executeMiddleWare();
                  var _temp2 = function () {
                    if (isPromise(result) === true) {
                      return Promise.resolve(result).then(function (_result) {
                        result = _result;
                      });
                    }
                  }();
                  return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
                });
                if (_temp4 && _temp4.then) return _temp4.then(function () {});
              }
            }();
            return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
          };
          var action = _this.getAction(storeName, type)["function"];
          if (action === null) {
            console.error('Action or reducer doesnt exist');
            return Promise.resolve();
          }
          var beforeWare = (_this$middleWare$stor = (_this$middleWare = _this.middleWare) === null || _this$middleWare === void 0 ? void 0 : (_this$middleWare$stor2 = _this$middleWare[storeName]) === null || _this$middleWare$stor2 === void 0 ? void 0 : _this$middleWare$stor2.beforeWare) != null ? _this$middleWare$stor : [];
          var afterWare = (_this$middleWare$stor3 = (_this$middleWare2 = _this.middleWare) === null || _this$middleWare2 === void 0 ? void 0 : (_this$middleWare2$sto = _this$middleWare2[storeName]) === null || _this$middleWare2$sto === void 0 ? void 0 : _this$middleWare2$sto.afterWare) != null ? _this$middleWare$stor3 : [];
          var runMiddleWare = _this.getFromMiddleWare(storeName);
          var _temp12 = function () {
            if (isPromise(runMiddleWare)) {
              return Promise.resolve(runMiddleWare).then(function (_runMiddleWare) {
                runMiddleWare = _runMiddleWare;
              });
            }
          }();
          return Promise.resolve(_temp12 && _temp12.then ? _temp12.then(_temp13) : _temp13(_temp12));
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
  _proto.mergeSelectors = function mergeSelectors(selector, currentState) {
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
  };
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
    return function (middleWare, _ref15) {
      var _ref15$type = _ref15.type,
        type = _ref15$type === void 0 ? '' : _ref15$type,
        _ref15$payload = _ref15.payload,
        payload = _ref15$payload === void 0 ? null : _ref15$payload;
      var result = middleWare(storeName, _this2.getCurrentState(storeName), {
        type: type,
        payload: payload
      });
      return result;
    };
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
      var _temp15 = function () {
        if (action instanceof Function) {
          result = action(_extends({
            state: _this3.getCurrentState(storeName),
            payload: payload,
            callback: callback
          }, _this3.props[storeName] !== null && {
            props: _this3.props[storeName]
          }), actions, stores);
          var _temp14 = function () {
            if (isPromise(result)) {
              return Promise.resolve(result).then(function (_result3) {
                result = _result3;
              });
            }
          }();
          if (_temp14 && _temp14.then) return _temp14.then(function () {});
        }
      }();
      return Promise.resolve(_temp15 && _temp15.then ? _temp15.then(function () {
        return result;
      }) : result);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return StateMachine;
}();
function isPromise(p) {
  if (Boolean(p && typeof p.then === 'function')) {
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
