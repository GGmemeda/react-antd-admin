import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from 'reducers';
import DevTools from '../DevTools';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import promiseMiddleware from 'redux-promise-middleware';
import {persistReducer, persistStore} from 'redux-persist';
import {connectRouter} from 'connected-react-router';
import history from '../utils/history';
import createExpirationTransform from "utils/expire";
import localForage from "localforage";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const expireTransform = createExpirationTransform({
  'loginUser': {
    expireSpan: 10000 * 3600 * 5,
    default: null
  }
});
const persistConfig = {
  key: 'root',
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  whitelist: [
    "crypto", 'loginUser'
  ],
  transforms: [expireTransform]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const connectReduxRouter = connectRouter(history)(persistedReducer);
let enhancer;
if (process.env.NODE_ENV === 'development') {
  enhancer = compose(
    applyMiddleware(thunk, logger, promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})),
    DevTools.instrument()
  );
} else {
  enhancer = compose(
    applyMiddleware(thunk, logger, promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})),
  );
}

export default function configureStore(initialstate) {
  const store = createStore(connectReduxRouter, initialstate, enhancer);
  const persistor = persistStore(store);
  return {store, persistor};
};
const {store, persistor} = configureStore();
export {store, persistor, persistConfig};
