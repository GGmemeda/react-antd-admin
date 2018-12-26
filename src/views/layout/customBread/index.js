import React from 'react';
import {Breadcrumb} from 'antd';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import './index.less';

import pageConfig from '../../../entry/pageConfig';

const CustomBread = withRouter((props) => {
  const {location} = props;
  let pathSnippets = location.pathname.split('/').filter(i => i);
  let currentPathName = location.pathname;
  if (pathSnippets[0] === 'index' && pathSnippets.length === 1) {
    pathSnippets = [];
  }
  let breadInstance;
  let extraBreadcrumbItems;
  const breadName = pageConfig[currentPathName]&&pageConfig[currentPathName]['breadName'];
  if (breadName instanceof Array) {
    extraBreadcrumbItems = breadName.map(function (item, num) {
      const url = `${currentPathName}`;
      if (breadName.length === num + 1) {
        return (<Breadcrumb.Item key={url}> <Link to={url} className='active-text'>
          {item}
        </Link>
        </Breadcrumb.Item>);
      } else {
        return (<Breadcrumb.Item key={url}>
          {item}
        </Breadcrumb.Item>);
      }
    });
  }
  else {
    extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      let styleName = '';
      if (pathSnippets.length === index + 1) {
        styleName = 'active-text';
      }
      breadInstance = (
        <Breadcrumb.Item key={url}>
          <Link to={url} className={styleName}>
            {pageConfig[url]['breadName']}
          </Link>
        </Breadcrumb.Item>
      );
      return breadInstance;
    });
  }
  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Link to="/">首页</Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems);
  return (
    <Breadcrumb className={`bread-content ` } separator=">">
      {breadcrumbItems}
    </Breadcrumb>
  );
});

export default CustomBread;
