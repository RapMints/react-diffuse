import React, { useContext, useMemo } from 'react';

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

var DiffuseContext = React.createContext();

var wire = function wire(_ref) {
  var _ref$fuseName = _ref.fuseName,
      fuseName = _ref$fuseName === void 0 ? [] : _ref$fuseName,
      Child = _ref.Child;
  return function (props) {
    var context = useContext(DiffuseContext);
    var fuses = {};
    var memoConstraint = [];

    for (var i = 0; i < fuseName.length; i++) {
      fuses[fuseName[i]] = context[fuseName[i]];
      memoConstraint.push(context[fuseName[i]].store);
    }

    return useMemo(function () {
      return /*#__PURE__*/React.createElement(Child, _extends({}, fuses, props));
    }, [props].concat(memoConstraint));
  };
};

var Reduce = function Reduce(_ref2) {
  var reducer = _ref2.reducer,
      initialState = _ref2.initialState,
      middleware = _ref2.middleware,
      _ref2$asyncReducer = _ref2.asyncReducer,
      asyncReducer = _ref2$asyncReducer === void 0 ? null : _ref2$asyncReducer,
      actions = _ref2.actions,
      asyncActions = _ref2.asyncActions;

  var _React$useReducer = React.useReducer(function (state, action) {
    return action.store;
  }, initialState),
      state = _React$useReducer[0],
      dispatch = _React$useReducer[1];

  var enhancedDispatch = function enhancedDispatch(newAction) {
    var res = reducer(newAction.store, newAction);

    if (newAction.store !== res) {
      newAction.store = res;
    }

    dispatch(newAction);
    return res;
  };

  var enhancedAsyncDispatch = function enhancedAsyncDispatch(newAction) {
    try {
      return Promise.resolve(asyncReducer(newAction, onSuccess, onFail, onProgress, onLoading)).then(function (_asyncReducer) {
        return _asyncReducer.store;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var onLoading = function onLoading() {
    return dispatchWithMiddleWare({
      type: 'LOADING'
    });
  };

  var onSuccess = function onSuccess(payload) {
    return dispatchWithMiddleWare({
      type: 'SUCCESS',
      payload: payload
    });
  };

  var onFail = function onFail(payload) {
    return dispatchWithMiddleWare({
      type: 'FAIL',
      payload: payload
    });
  };

  var onProgress = function onProgress(payload) {
    return dispatchWithMiddleWare({
      type: 'PROGRESS',
      payload: payload
    });
  };

  var dispatchWithMiddleWare = function dispatchWithMiddleWare(action) {
    try {
      var _temp3 = function _temp3() {
        if (middleware && middleware.afterWare) {
          middleware.afterWare.forEach(function (afterWare) {
            afterWare(newAction);
          });
        }

        return newAction;
      };

      var newAction = action;

      if (newAction.store === undefined) {
        newAction.store = state;
      }

      if (middleware && middleware.beforeWare) {
        middleware.beforeWare.forEach(function (beforeWare) {
          beforeWare(newAction);
        });
      }

      var _temp4 = function () {
        if (asyncReducer !== null && Object.keys(asyncActions).includes(newAction.type)) {
          return Promise.resolve(enhancedAsyncDispatch(newAction)).then(function (newStore) {
            newAction = _extends({}, newAction, {
              store: _extends({}, newStore)
            });
          });
        } else {
          var newStore = _extends({}, enhancedDispatch(newAction));

          newAction = _extends({}, newAction, {
            store: _extends({}, newStore)
          });
        }
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var actionsDispatch = function actionsDispatch() {
    var actionKeys = Object.keys(actions);
    var asyncActionKeys = Object.keys(asyncActions);
    var actionDispatch = {};
    actionKeys.map(function (a) {
      actionDispatch[a] = function (payload) {
        return dispatchWithMiddleWare({
          type: a,
          payload: payload
        });
      };
    });
    asyncActionKeys.map(function (a) {
      actionDispatch[a] = function (payload) {
        return dispatchWithMiddleWare({
          type: a,
          payload: payload
        });
      };
    });
    return actionDispatch;
  };

  var value = {
    store: state,
    dispatch: dispatchWithMiddleWare,
    actions: actionsDispatch()
  };
  return value;
};

var MergeReducers = function MergeReducers(globalState) {
  if (globalState === void 0) {
    globalState = [];
  }

  var reducers = globalState.map(function (state) {
    var _ref3;

    return _ref3 = {}, _ref3[state.name] = function () {
      var reducer = Reduce({
        reducer: state.reducer,
        initialState: state.initialState,
        middleware: state.middleware,
        asyncReducer: state.asyncReducer,
        actions: state.actions,
        asyncActions: state.asyncActions
      });
      return reducer;
    }, _ref3;
  });
  reducers.map(function (r) {
    Object.keys(r).map(function (key) {
    });
  });
  return reducers;
};

var createReducer = function createReducer(_ref4) {
  var _ref4$initialState = _ref4.initialState,
      initialState = _ref4$initialState === void 0 ? {} : _ref4$initialState,
      _ref4$actions = _ref4.actions,
      actions = _ref4$actions === void 0 ? [] : _ref4$actions,
      _ref4$middleware = _ref4.middleware,
      middleware = _ref4$middleware === void 0 ? {
    beforeWare: [],
    afterWare: []
  } : _ref4$middleware;
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
        reducer: _reducer.reducer,
        middleware: middleware,
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

var Diffuse = function Diffuse(_ref5) {
  var reducers = _ref5.reducers,
      children = _ref5.children;
  var mergedReducers = MergeReducers(reducers);
  var values = {};

  for (var i = 0; i < mergedReducers.length; i++) {
    var keys = Object.keys(mergedReducers[i])[0];
    values[keys] = mergedReducers[i][keys]();
  }

  return /*#__PURE__*/React.createElement(DiffuseContext.Provider, {
    value: values
  }, children);
};

export default Diffuse;
export { createReducer, wire };
//# sourceMappingURL=index.modern.js.map
