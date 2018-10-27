import allMenu from '@/entry/menu';
import {Menu, Icon} from 'antd';
import React from 'react';
import {Link} from 'react-router-dom';
import './index.less';


const SubMenu = Menu.SubMenu;


export default class Nav extends React.Component {
  state = {
    theme: 'dark',
    current: [],
    mode: 'dark',
    messageNum: 50,
    mounted: false
  };
  menuPath = {'/': 'index'};

  componentDidMount() {
    let prevActive = sessionStorage.getItem('activeItem');
    if (prevActive) {
      prevActive = prevActive.split(',').reverse();
    } else {
      prevActive = ['index'];
      sessionStorage.setItem('activeItem', 'index');
    }
    this.setState({
      current: prevActive
    });
  };

  componentDidUpdate() {
    let activeItem = this.menuPath[location.pathname];
    let prevActive = sessionStorage.getItem('activeItem');
    if (prevActive !== activeItem && activeItem) {
      sessionStorage.setItem('activeItem', activeItem);
      this.setState({
        current: activeItem.split(',')
      });
    }
  }

  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  currentActive = (key) => {
    const itemClassName = this.state.current.indexOf(key) !== -1 ? `menu-select` : '';
    return itemClassName;
  };
  requireAuth = (menuPermission) => {
    if (!this.props.permission) {
      return;
    }
    for (const item in menuPermission) {
      if (this.props.permission.includes(`PERMS_${menuPermission[item]}`)) {
        return true;
      }
    }
    return false;
  };
  constructMenu = (menus, menuString = '') => {
    const nowString = menuString || '';
    const _this = this;
    return menus.map((subMenu, index) => {
      if (subMenu.children && subMenu.children.length) {
        let currentString = `${nowString},${subMenu.url}`;
        if (subMenu.permission && !this.requireAuth(subMenu.permission)) return;
        return (<SubMenu key={subMenu.url} className={this.currentActive(subMenu.url)}
                         title={<div className='menu-link'>
                           <div className='one-line'/>
                           <i className={`icon-font  ${subMenu.icon}`}/>
                           <span className='menu-name'>{subMenu.name}</span>
                         </div>}>
          {this.constructMenu(subMenu.children, currentString)}
        </SubMenu>);
      } else {
        let currentInnerString = `${nowString},${subMenu.url}`;
        _this.menuPath[`/${subMenu.url}`] = currentInnerString.slice(1, currentInnerString.length);
        if (subMenu.permission && !this.requireAuth(subMenu.permission)) return;
        return (
          <Menu.Item key={subMenu.url}>
            <Link to={`/${subMenu.url}`} className='menu-link'>
              <div className='one-line'/>
              {subMenu.icon ? <i className={`icon-font ${subMenu.icon}`}/> : ''}
              <span className='menu-name'>{subMenu.name}</span>
            </Link>
          </Menu.Item>
        );
      }

    });
  };
  handleClick = (e, special) => {
  };

  render() {
    return (
      <Menu
        theme={this.state.theme}
        onClick={this.handleClick}
        defaultOpenKeys={['']}
        selectedKeys={this.state.current}
        className="menu menu-out clearfix"
        mode="inline"

      >
        {this.constructMenu(allMenu())}
      </Menu>
    );
  }
}

Nav.defaultProps = {
  permission: []
};


