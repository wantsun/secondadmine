import React, { Component } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

export default class UpdateForm extends Component {
  static propTypes = {
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
}

// componentWillUnmount(){
//   //将form对象通过setForm()传递给父组件
//   this.props.setForm(this.props.form)
// }
    render() {
      const {categoryName}= this.props
      // console.log('const {categoryName}= this.props',categoryName)
        return ( 
            <Form name="update" >
           
            <Form.Item   name="upclass" rules={[{ required: true, message: "名称必须输入!" }]} >
              <Input type="textarea" placeholder="请输入分类的名称"  defaultValue={categoryName}
              ref={input =>this.props.setForm(input)}
              
              />
            </Form.Item>
           
          </Form>
        )
    }
}
