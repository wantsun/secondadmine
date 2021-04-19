import React, { PureComponent } from 'react';
import {HomeWrapper}from './style'
/*首页路由  */

export default class Home extends PureComponent {
    render() {
        return (
            <HomeWrapper>
              <div className='home'>
                欢迎使用硅谷后台管理系统
            </div>
            </HomeWrapper>
        );
    }
}
