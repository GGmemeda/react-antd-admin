import React from 'react';
import { Layout } from 'antd';
import RouterPages from '../../../routes/routesPages';

const { Content } = Layout;

export default class Contents extends React.Component {
  render() {
    return (
      <Content className="content" id="content">
          <RouterPages/>
      </Content>
    );
  }
}
