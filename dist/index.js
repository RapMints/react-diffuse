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

function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}

function createProvider(ProviderOriginal) {
  return function (_ref) {
    var value = _ref.value,
        children = _ref.children;
    var valueRef = React.useRef(value);
    var listenersRef = React.useRef(new Set());
    var contextValue = React.useRef({
      value: valueRef,
      registerListener: function registerListener(listener) {
        listenersRef.current.add(listener);
        return function () {
          return listenersRef.current["delete"](listener);
        };
      },
      listeners: new Set()
    });
    React.useEffect(function () {
      valueRef.current = value;
      listenersRef.current.forEach(function (listener) {
        listener(value);
      });
    }, [value]);
    return /*#__PURE__*/React__default.createElement(ProviderOriginal, {
      value: contextValue.current
    }, children);
  };
}

function createContext(defaultValue) {
  var context = React.createContext({
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

function useForceUpdate() {
  var _useState = React.useState(null),
      forceUpdate = _useState[1];
  return forceUpdate;
}

function useReducer(_ref) {
  var _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? null : _ref$reducer,
      _ref$asyncReducer = _ref.asyncReducer,
      asyncReducer = _ref$asyncReducer === void 0 ? {} : _ref$asyncReducer,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? {} : _ref$initialState,
      _ref$middleware = _ref.middleware,
      middleware = _ref$middleware === void 0 ? {} : _ref$middleware,
      _ref$actions = _ref.actions,
      actions = _ref$actions === void 0 ? [] : _ref$actions,
      _ref$asyncActions = _ref.asyncActions,
      asyncActions = _ref$asyncActions === void 0 ? [] : _ref$asyncActions;

  if (reducer === null) {
    console.warn('No reducer, use Reducer returned no state or dispatch');
    return [];
  }

  var forceUpdate = useForceUpdate();
  var state = React.useRef(initialState);
  var getState = React.useCallback(function () {
    return state;
  }, [state]);

  var onLoading = function onLoading(reducerName) {
    return function () {
      return setValue(reducerName)({
        type: 'LOADING'
      });
    };
  };

  var onSuccess = function onSuccess(reducerName) {
    return function (payload) {
      return setValue(reducerName)({
        type: 'SUCCESS',
        payload: payload
      });
    };
  };

  var onFail = function onFail(reducerName) {
    return function (payload) {
      return setValue(reducerName)({
        type: 'FAIL',
        payload: payload
      });
    };
  };

  var onProgress = function onProgress(reducerName) {
    return function (payload) {
      return setValue(reducerName)({
        type: 'PROGRESS',
        payload: payload
      });
    };
  };

  var setValue = React.useCallback(function (reducerName) {
    return function (action) {
      try {
        var _middleware$reducerNa2;

        var _temp4 = function _temp4() {
          var _middleware$reducerNa;

          if ((middleware === null || middleware === void 0 ? void 0 : (_middleware$reducerNa = middleware[reducerName]) === null || _middleware$reducerNa === void 0 ? void 0 : _middleware$reducerNa.afterWare) !== undefined && middleware[reducerName].afterWare.length !== 0) {
            middleware === null || middleware === void 0 ? void 0 : middleware[reducerName].afterWare.forEach(function (afterWare) {
              afterWare(newAction);
            });
          }

          state.current[reducerName] = nextState;

          if (noAction === false) {
            var _extends2;

            forceUpdate(_extends({}, state.current, (_extends2 = {}, _extends2[reducerName] = nextState, _extends2)));
          }

          return nextState;
        };

        var noAction = false;
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

        var _temp5 = function () {
          if (actions[reducerName].includes(action.type)) {
            nextState = reducer[reducerName](state.current[reducerName], action);
            newAction.store = nextState;
          } else {
            var _temp6 = function () {
              if (asyncActions[reducerName].includes(action.type)) {
                return Promise.resolve(asyncReducer[reducerName](newAction, onSuccess(reducerName), onFail(reducerName), onProgress(reducerName), onLoading(reducerName))).then(function (_asyncReducer$reducer) {
                  nextState = _asyncReducer$reducer;
                  newAction.store = nextState;
                });
              } else {
                noAction = true;
                logger.warn('No state change, no update');
              }
            }();

            if (_temp6 && _temp6.then) return _temp6.then(function () {});
          }
        }();

        return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp4) : _temp4(_temp5));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }, [getState]);
  return [state.current, setValue];
}

function useContextSelector(context, selector) {
  var _useContext = React.useContext(context),
      value = _useContext.value,
      registerListener = _useContext.registerListener;

  var _useState = React.useState(function () {
    return selector(value.current);
  }),
      selectedValue = _useState[0],
      setSelectedValue = _useState[1];

  var selectorRef = React.useRef(selector);
  React.useEffect(function () {
    selectorRef.current = selector;
  });
  React.useEffect(function () {
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
    return selector(context.state);
  });
}

function useDispatch(reducerName) {
  if (reducerName === void 0) {
    reducerName = null;
  }

  if (reducerName === null) {
    return useContextSelector(DiffuseContext, function (context) {
      return context.dispatch;
    });
  }

  return useContextSelector(DiffuseContext, function (context) {
    return context.dispatch;
  })(reducerName);
}

var connectWire = function connectWire(fuseName, Child) {
  return function (props) {
    var _fuse;

    var context = useFuse(function (selector) {
      return selector[fuseName];
    });
    var dispatch = useDispatch(fuseName);
    var fuse = (_fuse = {}, _fuse[fuseName] = {
      store: context,
      dispatch: dispatch
    }, _fuse);
    return React.useMemo(function () {
      return /*#__PURE__*/React__default.createElement(Child, _extends({}, fuse, props));
    }, [props, context]);
  };
};

var wire = function wire(_ref) {
  var _ref$fuseName = _ref.fuseName,
      fuseName = _ref$fuseName === void 0 ? [] : _ref$fuseName,
      Child = _ref.Child;
  var newChild = Child;
  fuseName.forEach(function (name) {
    newChild = connectWire(name, newChild);
  });
  return newChild;
};

var createReducer = function createReducer(_ref2) {
  var _ref2$initialState = _ref2.initialState,
      initialState = _ref2$initialState === void 0 ? {} : _ref2$initialState,
      _ref2$actions = _ref2.actions,
      actions = _ref2$actions === void 0 ? [] : _ref2$actions,
      _ref2$middleware = _ref2.middleware,
      middleware = _ref2$middleware === void 0 ? {
    beforeWare: [],
    afterWare: []
  } : _ref2$middleware;
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
    this.globalStateMachine = {};
  }

  var _proto = setupDiffuseClass.prototype;

  _proto.createGlobalState = function createGlobalState(reducers) {
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
    var globalStateMachine = {
      initialState: initialState,
      reducer: reducer,
      asyncReducer: asyncReducer,
      middleware: middleware,
      actions: actions,
      asyncActions: asyncActions
    };
    this.globalStateMachine = globalStateMachine;
    return globalStateMachine;
  };

  return setupDiffuseClass;
}();

var SetupDiffuse = new setupDiffuseClass();

var createGlobalState = function createGlobalState(reducers) {
  if (SetupDiffuse === undefined) {
    _readOnlyError("SetupDiffuse");
  }

  return SetupDiffuse.createGlobalState(reducers);
};

var Diffuse = function Diffuse(_ref3) {
  var reducers = _ref3.reducers,
      children = _ref3.children;
  var globalStateMachine = SetupDiffuse.globalStateMachine;

  if (reducers !== undefined) {
    globalStateMachine = createGlobalState(reducers);
  }

  if (Object.keys(globalStateMachine).length === 0) {
    console.warn('No reducers specified');
  }

  var _useReducer = useReducer(globalStateMachine),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  return /*#__PURE__*/React__default.createElement(DiffuseContext.Provider, {
    value: {
      state: state,
      dispatch: dispatch
    }
  }, children);
};

exports.createGlobalState = createGlobalState;
exports.createReducer = createReducer;
exports.default = Diffuse;
exports.useDispatch = useDispatch;
exports.useFuse = useFuse;
exports.wire = wire;
//# sourceMappingURL=index.js.map
