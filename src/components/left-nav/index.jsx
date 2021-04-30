import React, { PureComponent } from 'react';
import { LeftNavWrapper } from './style'
import logo from '../../assets/img/logo.png'
import { Link,withRouter} from 'react-router-dom';
import menuList from '../../config/menuConfig';
import { Menu } from 'antd';

const { SubMenu } = Menu

 class leftNav extends PureComponent {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  //map+递归实现
  getMenuNodes = (menuList) => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key} />
            <span>{item.title}</span>
          </Menu.Item>
        )
      }
      else {
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  //reduce+递归实现
  getMenuNodes_reduce = (menuList) => {
    const path=this.props.location.pathname;
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push((
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key} />
            <span>{item.title}</span>
          </Menu.Item>
        ))
      } else {
        const cItem = item.children.find(
          (cItem) => 0 === path.indexOf(cItem.key)
        );
        //如果存在，说明当前item的子列表需要打开
        if (cItem) {
          this.openkey = item.key;
        }
        
       

        //向pre添加<SubMenu》
        pre.push((
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {
              this.getMenuNodes_reduce(item.children)
            }
          </SubMenu>
        ))
        
      }
      return pre
    }, [])
  }
 componentWillMount(){
     this.menuNodes=this.getMenuNodes_reduce(menuList)
  }

  render() {
    //得到当前请求的路由路径  
    let path=this.props.location.pathname; 
    console.log(path)
    if(path.indexOf('/product')===0){//当前请求的是商品或者子路由路径
      path='/product';
    }

    
    //得到需要打开菜单项的key
    const openKey =this.openKey;
  
    return (
      <LeftNavWrapper >
        <div className='left-nav'>
          <Link to='/' className='left-nav-header'>
            <img src={logo} alt="logo" />
            <h1>硅谷后台</h1>
          </Link>
        </div>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >

          {
            this.menuNodes
          }
        </Menu>
      </LeftNavWrapper>
    );
  }
}

/*
 withRouter高阶组件:
 包装非路由组件，返回一个新的组件
 新的路由组件吗向非路由组件传递三个属性：history/location/match 
 */

 export default withRouter(leftNav)