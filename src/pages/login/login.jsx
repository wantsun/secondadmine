import React, { PureComponent } from 'react';
import logo from '../../assets/img/logo.png'
import { Form, Input,Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginWrapper } from './style'
import {reqLogin}from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router';



export default class Login extends PureComponent {
    render() {

        //如果用户已经登陆，自动跳转到管理界面
        const user=memoryUtils.user;
        if(user._id){
            return <Redirect to="/"/>
        }

            const onFinish= async(values) => { 
                // console.log('发送登录的请求', values);  
                const{username,password}=values;
                    const response = await reqLogin(username, password);
                    // .then(response=>{
                    //   console.log('成功了',response.data)
                    // }).catch(error=>{
                    //   console.log('失败了',error.message)}
                    // );
                    console.log("请求成功", response);
                    const result = response; //{state:0,data:user} {state:1,msg:'xxxx'}
                    if (result.status === 0) {
                      //登陆成功
                      message.success("登录成功");
                      const user = result.data;
                      memoryUtils.user = user;//保存再内存中
                      //跳转到管理界面(不需要再会退回来)
                      storageUtils.saveUser(user)//保存到local中去
                      this.props.history.replace('/')
                     
                  
                    
                    //   // //console.log(this);
                    //   this.props.history.push("/");
                    } else {
                      // 登录失败.提示错误信息
                      message.error(result.msg);
                    }    
              }
              const onFinishFailed=(values)=>{
                 alert(values.errorFields[0].errors[0]);
                 alert(values.errorFields[1].errors[0]);
              }     
        return (
            <LoginWrapper>
                <div className="login">
                    <header className="login-header">
                        <img src={logo} alt="logo" />
                        <h1>老徐二手图书后台管理系统</h1>
                    </header>
                    <section className="login-content">
                        <h2>用户登录</h2>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入你的用户名!',
                                    },
                                    {
                                        min:4,message:'用户名至少四位',
                                        
                                    },
                                    {
                                        max:12,message:'用户最多12位',
                                    },
                                    {
                                        pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文，字母或下划线组成'
                                    }
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入你的用户名!',
                                    },
                                    {
                                        min:4,message:'密码至少四位',
                                        
                                    },
                                    {
                                        max:12,message:'用户最多12位',
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Form.Item>
                           

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                   登录
        </Button>
        
                            </Form.Item>
                        </Form>
                    </section>
                </div>
                </LoginWrapper>
        );
    }
}

//账号密码都是admin