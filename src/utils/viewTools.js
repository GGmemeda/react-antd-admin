import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { Layout, Spin } from 'antd';
import history from '../utils/history';
import { actionLoading } from 'actions/basic';
import { clearAuth } from './auth';
import NProgress from 'nprogress';

/**
 *页面实体配置
 * @param pageEntity
 * @returns {HighOrderComponent}
 */
export const viewsConfig = function (pageEntity) {
  const PageComponent = Loadable({
    loader: pageEntity.loader,
    loading: LoadingComponent,
  });

  @connect(
    (state) => {
      return ({
        layoutLoading: state.layoutLoading,
      });
    }, { actionLoading }
  )
  class HighOrderComponent extends React.Component {
    render () {
      const { loading } = this.props.layoutLoading;
      return <Layout.Content className="content" id="content">
        <PageComponent  {...this.props}/>
      </Layout.Content>;
    }
  }

  return HighOrderComponent;
};
/**
 * 加载页面
 * @param isLoading
 * @param error
 * @returns {*}
 */
export const LoadingComponent = ({ isLoading, error }) => {
  if (isLoading) {
    NProgress.start();
    return 'loading';
  } else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  } else {
    NProgress.done();
    return '';
  }
};
