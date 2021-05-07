import React, { PureComponent } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;

export default class AddForm extends PureComponent {
  static propTypes = {
    setInput: PropTypes.func.isRequired,
  };
  render() {
    const formItemLayout = {
        labelCol: { span: 4 }, //左侧label宽度
        wrapperCol: { span: 10 }, //右侧包裹输入框宽度
      };
    return (
      <Form >
        <Item
        {...formItemLayout}
          name="input"
          label="角色名称"
          name="username"
          rules={[{ required: true, message: "名称必须输入!" }]}
        >
          <Input
         
            initialvalues="请输入角色名称"
            ref={(input) =>{ 
                this.props.setInput(input)
            }}
          ></Input>
        </Item>
      </Form>
    );
  }
}
