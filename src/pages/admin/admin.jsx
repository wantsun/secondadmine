/*
后台管理主路由组件
*/
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router';
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';

import Home from '../home/home';
import Category from '../category/category';
import Bar from '../chart/bar';
import Line from '../chart/line';
import Pie from '../chart/pie';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Header from '../../components/header'

const {Footer, Sider, Content } = Layout;

export default class Admin extends Component {

    render() {
        const user = memoryUtils.user;
        //如果内存没有存储user ==>当前没有登录
        if (!user || !user._id) {
            //自动跳转到登录
            return <Redirect to="/login" />
        }
        return (
            <Layout style={{ height: '100%' }}>
                <Sider><LeftNav /></Sider>
                <Layout>
                    <Header style={{  backgroundColor: '#f0f2f5' }} />
                    <Content style={{  margin:20,backgroundColor: 'white' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#aaaaaa' }}>推荐使用谷歌浏览器，
可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>

        )
    }
}