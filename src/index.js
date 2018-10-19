import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Routes from './routes';
import './style/index.less';
import DevTools from './DevTools';
import {store, persistor} from './redux/index';
import {ConnectedRouter} from 'connected-react-router';
import history from 'utils/history';
import {setInterceptors} from 'utils/request';
import {PersistGate} from 'redux-persist/integration/react';
import moment from 'moment';
import momentLocale from 'moment/locale/zh-cn';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from "antd";
import {LastLocationProvider} from 'react-router-last-location';

moment.updateLocale('zh-cn', momentLocale);
setInterceptors(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <LastLocationProvider>
          <LocaleProvider locale={zhCN}>
            <div>
              <Routes/>
              {process.env.NODE_ENV === 'development' ? <DevTools/> : ''}
            </div>
          </LocaleProvider>
        </LastLocationProvider>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
