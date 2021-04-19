import React, { Component } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

export default class AddForm extends Component {
  static propTypes = {
    categorys:PropTypes.array.isRequired,
    parentId:PropTypes.string.isRequired,
    setClasses:PropTypes.func.isRequired,
    setInput:PropTypes.func.isRequired
}
    render() {
        const Option = Select.Option;
        const {categorys,parentId}= this.props
        console.log(" const {categorys,parentId}= this.props",parentId)
        return ( 
            <Form name="adddate" onValuesChange={this.onFinish}>
            <Form.Item
              label="所属分类"
              name="belong"
            >
              <Select defaultValue={parentId} ref={select =>this.props.setClasses(select)}>
                    <Option value='0'>一级分类</Option>
                    {categorys.map(item=><Option value={item._id}>{item.name}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item  label="分类名称："  rules={[{ required: true, message: "名称必须输入!" }]}>
              <Input type="textarea" placeholder="请输入分类的名称" ref={input =>this.props.setInput(input)}/>
            </Form.Item>
          </Form>
        )
    }
}
