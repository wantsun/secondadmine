/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from 'react';
import { Headerwrapper } from './style';
import {formateDate} from '../../utils/dataUtils';
import memoryUtils from '../../utils/memoryUtils.js';
import { reqWeather } from '../../api';
import { withRouter } from "react-router-dom";
import menuList from '../../config/menuConfig';
import storageUtils from '../../utils/storageUtils';
import LinkButton from "../link-button"
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

 class Header extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            currentTime:formateDate(Date.now()),//当前时间
            dayPictureUrl:"http://api.map.baidu.com/images/weather/day/qing.png", //天气的图片url
            weather:'晴',//天气的文本
        }
    }
    /**
     * 
     * 第一次render()之后，一般在此执行异步操作:发ajax请求/启动定时器
     */
    
    getTime=()=>{
        //每隔1s获取当前时间,并更新状态数据currentTime
        setInterval(()=>{
            this.setState({currentTime:formateDate(Date.now())})
        },1000)
    }
    getWeather =async()=>{
        //调用接口请求异步获取数据
        const {weather}=await reqWeather('宁波');
        this.setState({weather})
    }
    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname;
        let title;
        menuList.forEach((item) => {
          if (item.key === path) { //如果当前item对象的key与path一样，item的title就是需要显示的title
            title = item.title;
          } else if (item.children) {
              //在所有子Item中查找匹配
            const cItem = item.children.find((cItem) =>cItem.key===path);
            //find() 方法返回通过测试（函数内判断）的数组的第一个元素的值。
            //如果有值才说明匹配
            if (cItem) {
    //去除titke
              title = cItem.title;
            }
          }
        });
        return title;
      };

      /**
       * 退出登陆
       */

        showConfirm=()=> {
            const {history} = this.props
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: "确定退出吗？",
              onOk(){
                console.log('确定');
                storageUtils.deleteUser();
                memoryUtils.user ={};
                // eslint-disable-next-line no-restricted-globals
                history.replace('/login');
              },
              onCancel() {
                console.log('取消');
              },
            });
        }
      

    componentDidMount(){
        //获取当前时间
        this.getTime();
        //获取当前天气
        this.getWeather();
    }
    render() {
        const{currentTime,dayPictureUrl,weather}=this.state;
        const username=memoryUtils.user.username;
         //显示当前的title
        const title=this.getTitle();
        return (
            <Headerwrapper>
                    <div className="header">  
                    <div className="header-top">
                        <span>欢迎，{username}</span>
                        <LinkButton  onClick={this.showConfirm}>退出</LinkButton>
                    </div>
                    <div className="header-bottom">
                        <div className="header-bottom-left">
                            <span>{title}</span>
                        </div>
                        <div className="header-bottom-right">
                            <span>{currentTime}</span>
                            <img src={dayPictureUrl}alt="weather"/>
                            <span>{weather}</span>
                        </div>
                    </div>
                    </div>
            </Headerwrapper>

        );
    }
}

export default withRouter(Header);