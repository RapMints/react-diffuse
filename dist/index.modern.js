import React, { createContext as createContext$1, useRef, useEffect, useCallback, useState, useContext, useMemo } from 'react';

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

function createProvider(ProviderOriginal) {
  return function (_ref) {
    var value = _ref.value,
        children = _ref.children;
    var valueRef = useRef(value);
    var listenersRef = useRef(new Set());
    var contextValue = useRef({
      value: valueRef,
      registerListener: function registerListener(listener) {
        listenersRef.current.add(listener);
        return function () {
          return listenersRef.current["delete"](listener);
        };
      },
      listeners: new Set()
    });
    useEffect(function () {
      valueRef.current = value;
      listenersRef.current.forEach(function (listener) {
        listener(value);
      });
    }, [value]);
    return /*#__PURE__*/React.createElement(ProviderOriginal, {
      value: contextValue.current
    }, children);
  };
}

function createContext(defaultValue) {
  var context = createContext$1({
    value: {
      current: defaultValue
    },
    register: function register() {
      return function () {};
    }
  });
  delete context.Consumer;
  context.Provider = createProvider(context.Provider);
  return context;
}

var logger = (function (name) {
  return function (action) {
    console.log(name, action.type, action.store);
  };
});

function useForceUpdate() {
  var _useState = useState(null),
      forceUpdate = _useState[1];

  return forceUpdate;
}

function useReducerEnhanced(reducer, initState, asyncReducer, middleware, actions, asyncActions) {
  var forceUpdate = useForceUpdate();
  var state = useRef(initState);
  var getState = useCallback(function () {
    return state;
  }, [state]);
  var setValue = useCallback(function (reducerName) {
    return function (action) {
      try {
        var _middleware$reducerNa2;

        var _temp3 = function _temp3(_result2) {
          var _middleware$reducerNa, _extends2;

          if (_exit2) return _result2;

          if ((middleware === null || middleware === void 0 ? void 0 : (_middleware$reducerNa = middleware[reducerName]) === null || _middleware$reducerNa === void 0 ? void 0 : _middleware$reducerNa.afterWare) !== undefined && middleware[reducerName].afterWare.length !== 0) {
            middleware === null || middleware === void 0 ? void 0 : middleware[reducerName].afterWare.forEach(function (afterWare) {
              afterWare(newAction);
            });
          }

          state.current[reducerName] = nextState;
          forceUpdate(_extends({}, state.current, (_extends2 = {}, _extends2[reducerName] = nextState, _extends2)));
          return nextState;
        };

        var _exit2 = false;
        var nextState = state.current[reducerName];
        var newAction = action;

        if (newAction.store === undefined) {
          newAction.store = nextState;
        }

        if ((middleware === null || middleware === void 0 ? void 0 : (_middleware$reducerNa2 = middleware[reducerName]) === null || _middleware$reducerNa2 === void 0 ? void 0 : _middleware$reducerNa2.beforeWare) !== undefined && middleware[reducerName].beforeWare.length !== 0) {
          middleware === null || middleware === void 0 ? void 0 : middleware[reducerName].beforeWare.forEach(function (beforeWare) {
            beforeWare(newAction);
          });
        }

        var _temp4 = function () {
          if (actions[reducerName].includes(action.type)) {
            nextState = reducer[reducerName](state.current[reducerName], action);
          } else return function () {
            if (asyncActions[reducerName].includes(action.type)) {
              return Promise.resolve(asyncReducer[reducerName](state.current[reducerName], action)).then(function (_asyncReducer$reducer) {
                nextState = _asyncReducer$reducer;
                newAction.store = nextState;
              });
            } else {
              logger.warn('No state change, no update');
              _exit2 = true;
              return nextState;
            }
          }();
        }();

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }, [getState]);
  return [state.current, setValue];
}

function useContextSelector(context, selector) {
  var _useContext = useContext(context),
      value = _useContext.value,
      registerListener = _useContext.registerListener;

  var _useState = useState(function () {
    return selector(value.current);
  }),
      selectedValue = _useState[0],
      setSelectedValue = _useState[1];

  var selectorRef = useRef(selector);
  useEffect(function () {
    selectorRef.current = selector;
  });
  useEffect(function () {
    var updateValueIfNeeded = function updateValueIfNeeded(newValue) {
      var newSelectedValue = selectorRef.current(newValue);

      if (selectedValue !== newSelectedValue) {
        setSelectedValue(function () {
          return newSelectedValue;
        });
      }
    };

    var unregisterListener = registerListener(updateValueIfNeeded);
    return unregisterListener;
  }, [registerListener, value, selectedValue]);
  return selectedValue;
}

var DiffuseContext = createContext();

function useFuse(selector) {
  return useContextSelector(DiffuseContext, function (context) {
    return selector(context.value);
  });
}

function useDispatch(reducerName) {
  if (reducerName === void 0) {
    reducerName = null;
  }

  if (reducerName === null) {
    return useContextSelector(DiffuseContext, function (context) {
      return context.setValue;
    });
  }

  return useContextSelector(DiffuseContext, function (context) {
    return context.setValue;
  })(reducerName);
}

var wire = function wire(_ref) {
  var _ref$fuseName = _ref.fuseName,
      fuseName = _ref$fuseName === void 0 ? [] : _ref$fuseName,
      Child = _ref.Child;
  return function (props) {
    var context = useFuse(function (store) {
      return store;
    });
    var dispatch = useDispatch();
    var fuses = {};
    var memoConstraint = [];

    for (var i = 0; i < fuseName.length; i++) {
      fuses[fuseName[i]] = {
        store: context[fuseName[i]],
        dispatch: dispatch(fuseName[i])
      };
      memoConstraint.push(context[fuseName[i]]);
    }

    return useMemo(function () {
      return /*#__PURE__*/React.createElement(Child, _extends({}, fuses, props));
    }, [props].concat(memoConstraint));
  };
};

var createReducer = function createReducer(_ref3) {
  var _ref3$initialState = _ref3.initialState,
      initialState = _ref3$initialState === void 0 ? {} : _ref3$initialState,
      _ref3$actions = _ref3.actions,
      actions = _ref3$actions === void 0 ? [] : _ref3$actions,
      _ref3$middleware = _ref3.middleware,
      middleware = _ref3$middleware === void 0 ? {
    beforeWare: [],
    afterWare: []
  } : _ref3$middleware;
  var _reducer = {
    initialState: _extends({
      diffuse: {
        loading: false,
        error: false
      }
    }, initialState),
    actionsDict: {
      INITIALIZE_STORE: function INITIALIZE_STORE(state, payload) {
        if (payload === void 0) {
          payload = {};
        }

        return _extends({
          diffuse: {
            loading: false,
            error: false
          }
        }, initialState, payload);
      },
      LOADING: function LOADING(state) {
        return {
          diffuse: {
            loading: true,
            error: false
          }
        };
      },
      SUCCESS: function SUCCESS(state, payload) {
        return _extends({
          diffuse: {
            loading: false,
            error: false
          }
        }, payload);
      },
      PROGRESS: function PROGRESS(state, payload) {
        return _extends({}, payload);
      },
      FAIL: function FAIL(state, payload) {
        return _extends({
          diffuse: {
            loading: false,
            error: true
          }
        }, payload);
      }
    },
    asyncActionsDict: {},
    middleware: middleware,
    initialize: function initialize(name) {
      return {
        name: name,
        initialState: _extends({}, _reducer.initialState),
        middleware: middleware,
        reducer: _reducer.reducer,
        asyncReducer: _reducer.asyncReducer,
        actions: _reducer.actionsDict,
        asyncActions: _reducer.asyncActionsDict
      };
    },
    reducer: function reducer(state, action) {
      if (action.type in _reducer.actionsDict) {
        var res = _reducer.actionsDict[action.type](state, action.payload);

        return _extends({}, state, res);
      }
    },
    asyncReducer: function (action, onSuccess, onFail, onProgress, onLoading) {
      try {
        onLoading();
        return Promise.resolve(_reducer.asyncActionsDict[action.type]({
          state: action.store,
          payload: action.payload
        }, onSuccess, onFail, onProgress)).then(function (_reducer$asyncActions) {
          return _extends({}, _reducer$asyncActions, {
            type: action.type
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    addAction: function addAction(actionName, action) {
      if (action.type === 'action') {
        _reducer.actionsDict[actionName] = action.job;
      } else if (action.type === 'async') {
        _reducer.asyncActionsDict[actionName] = action.job;
      }
    },
    removeAction: function removeAction(actionName) {
      if (actionName in _reducer.actionsDict) {
        delete _reducer.actionsDict[actionName];
      }
    },
    getActions: function getActions() {
      var actions = [];

      for (var key in _reducer.actionsDict) {
        actions.push(_reducer.actionsDict[key]);
      }

      return actions;
    }
  };

  for (var key in actions) {
    _reducer.addAction(key, actions[key]);
  }

  return _reducer;
};

var setupDiffuseClass = /*#__PURE__*/function () {
  function setupDiffuseClass() {
    this.store = {};
  }

  var _proto = setupDiffuseClass.prototype;

  _proto.CombineReducers = function CombineReducers(reducers) {
    var initialState = {};
    var reducer = {};
    var asyncReducer = {};
    var middleware = {};
    var actions = {};
    var asyncActions = {};
    reducers.map(function (singleReducer) {
      initialState[singleReducer.name] = singleReducer.initialState;
      reducer[singleReducer.name] = singleReducer.reducer;
      asyncReducer[singleReducer.name] = singleReducer.asyncReducer;
      middleware[singleReducer.name] = singleReducer.middleware;
      actions[singleReducer.name] = Object.keys(singleReducer.actions);
      asyncActions[singleReducer.name] = Object.keys(singleReducer.asyncActions);
    });
    var store = {
      initialState: initialState,
      reducer: reducer,
      asyncReducer: asyncReducer,
      middleware: middleware,
      actions: actions,
      asyncActions: asyncActions
    };
    this.store = store;
    return store;
  };

  return setupDiffuseClass;
}();

var SetupDiffuse = new setupDiffuseClass();

var Diffuse = function Diffuse(_ref4) {
  var reducers = _ref4.reducers,
      children = _ref4.children;
  var store = SetupDiffuse.store;

  if (reducers !== undefined) {
    store = SetupDiffuse.CombineReducers(reducers);
  }

  var _store = store,
      initialState = _store.initialState,
      reducer = _store.reducer,
      asyncReducer = _store.asyncReducer,
      middleware = _store.middleware,
      actions = _store.actions,
      asyncActions = _store.asyncActions;

  var _useReducerEnhanced = useReducerEnhanced(reducer, initialState, asyncReducer, middleware, actions, asyncActions),
      value = _useReducerEnhanced[0],
      setValue = _useReducerEnhanced[1];

  return /*#__PURE__*/React.createElement(DiffuseContext.Provider, {
    value: {
      value: value,
      setValue: setValue
    }
  }, children);
};

export default Diffuse;
export { SetupDiffuse, createReducer, useDispatch, useFuse, wire };
//# sourceMappingURL=index.modern.js.map
