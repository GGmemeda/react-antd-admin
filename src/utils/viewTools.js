import React from 'react';
import {connect} from 'react-redux';
import Loadable from 'react-loadable';
import CustomBread from "../views/layout/customBread";
import {Layout, Spin} from "antd";
import history from "../utils/history";
import {actionLoading} from 'actions/basic';
import {clearAuth} from './auth';

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
    }, {actionLoading}
  )
  class HighOrderComponent extends React.Component {
    render() {
      const {loading} = this.props.layoutLoading;
      return <Layout.Content className="content" id="content">
        <Spin tip="Loading..." spinning={loading} wrapperClassName='wrapper-content-loading'>
          {pageEntity.hideBread ?
            <PageComponent  {...this.props}/> :
            <div className='has-bread-content'>
              <CustomBread/>
              <PageComponent  {...this.props}/>
            </div>
          }
        </Spin>
      </Layout.Content>;
    }
  }

  return HighOrderComponent;
};
/**
 * loading组件
 * @returns {*}
 * @constructor
 */
export const LoadingComponent = () => <div className="wave-wrapper-animate">
  <div className='wave-svg-wrapper'>
    <div className="wave-svg-shape">
      <svg className="wave-svg" xmlns="http://www.w3.org/2000/svg" id="738255fe-a9fa-4a5e-963a-8e97f59370ad"
           data-name="3-waves" viewBox="0 0 600 215.43"><title>wave shape</title>
        <path className="871c1787-a7ef-4a54-ad03-3cd50e05767a"
              d="M639,986.07c-17-1-27.33-.33-40.5,2.67s-24.58,11.84-40.46,15c-13.56,2.69-31.27,2.9-46.2,1.35-17.7-1.83-35-9.06-35-9.06S456,987.07,439,986.07s-27.33-.33-40.5,2.67-24.58,11.84-40.46,15c-13.56,2.69-31.27,2.9-46.2,1.35-17.7-1.83-35-9.06-35-9.06S256,987.07,239,986.07s-27.33-.33-40.5,2.67-24.58,11.84-40.46,15c-13.56,2.69-31.27,2.9-46.2,1.35-17.7-1.83-35-9.06-35-9.06v205.06h600V996S656,987.07,639,986.07Z"
              transform="translate(-76 -985)"></path>
      </svg>
    </div>
  </div>
</div>;
