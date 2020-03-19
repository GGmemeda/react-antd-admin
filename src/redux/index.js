import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from 'reducers';
import DevTools from '../DevTools';
import thunk from 'redux-thunk';
import logger from './middleware/logger';
import promiseMiddleware from 'redux-promise-middleware';
import { persistStore} from 'redux-persist';
import history from '../utils/history';

const reducers = rootReducer(history);
let enhancer;
if (process.env.NODE_ENV === 'development') {
  console.log('当前是开发者环境');
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
  const store = createStore(reducers, initialstate, enhancer);
  const persistor = persistStore(store);
  return {store, persistor};
};
const {store, persistor} = configureStore();
export {store, persistor};
