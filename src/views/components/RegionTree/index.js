import {Tree, Spin} from 'antd';
import {areaList} from 'api/region';
import React from 'react';

const TreeNode = Tree.TreeNode;

export default class RegionTree extends React.Component {
  state = {
    treeData: [],
    loading: true,
    selectedNode: '',
    selectedKey: [],
    defaultKey: []
  };

  componentWillMount() {
    if (this) {
      this.getList();
    }
  }

  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };

  getList(data) {
    let useData = data || {};
    const instance = this;
    this.setState({
      loading: true
    });
    useData.pageSize = 10000;
    return new Promise((resolve, reject) => {
      areaList(useData).then(res => {
        this.setState({
          loading: false
        });
        if (res.code === 200) {
          let items = res.data;
          if (res.data.length > 0) {
            items.map(item => {
              item.value = item.id;
              item.label = item.name;
              item.path = item.id;
              item.isLeaf = false;
            });
            this.setState({
              defaultKey: [items[0].id]
            });
          }
          if (data) {
            resolve(items);
          } else {
            this.setState({
              treeData: items,
            });
          }
        }
      }).finally(err => {
        this.setState({
          loading: false
        });
      });
    });
  }

  onLoadData = (treeNode) => {
    const chooseId = treeNode.props.dataRef.id;
    const choosedPath = treeNode.props.dataRef.path;
    const upData = {parentId: chooseId};
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      this.getList(upData).then(res => {
        if (res.length < 1) return;
        res.map(ele => {
          ele.path = choosedPath + `-${ele.id}`;
        });
        treeNode.props.dataRef.children = res;
        if (this && this.setState) {
          this.setState({
            treeData: [...this.state.treeData],
          });
        }
        resolve();
      });
    });

  };

  treeSelect = (selectedKeys, e) => {
    if (e.selected) {
      this.setState({
        selectedNode: e.node,
        selectedKey: selectedKeys,
      });

      if ('treeChange' in this.props) {
        this.props.treeChange(selectedKeys, e);
      }
    } else {
      this.setState({
        selectedNode: e.node,
        selectedKey: selectedKeys,
      });
      if ('treeChange' in this.props) {
        this.props.treeChange(selectedKeys, e);
      }
    }
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.label} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.label} key={item.id} dataRef={item}/>;
    });
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading}>
          {this.state.treeData.length > 0 ? <Tree
            selectedKeys={this.state.selectedKey}
            onSelect={this.treeSelect}
            loadData={this.onLoadData}
            defaultExpandedKeys={this.state.defaultKey}
            title='行政区选择'
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree> : ''}
        </Spin>
      </div>

    );
  }
}
