import createExpirationTransform from "utils/expire";
import localForage from "localforage/typings/localforage";
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
