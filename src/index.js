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
import'dayjs/locale/zh-cn'
import {ConfigProvider } from "antd";
import {LastLocationProvider} from 'react-router-last-location';
import zhCN from 'antd/es/locale/zh_CN';

setInterceptors(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <LastLocationProvider>
          <ConfigProvider  locale={zhCN}>
            <div>
              <Routes/>
            </div>
          </ConfigProvider>
        </LastLocationProvider>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
