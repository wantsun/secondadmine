import React, { PureComponent  } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { PAGE_SIZE } from "../../utils/constant";
import { reqRoleList, reqAddRole ,reqUpdateRole} from "../../api";
import AddForm from "./add-form.jsx";
import SetTree from "./setTree";
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dataUtils'
import storageUtils from "../../utils/storageUtils";
/* 角色路由 */
export default class Role extends PureComponent  {
    constructor(props){
        super(props)
        this.state={
            loading: false,
            roles: [], //所有角色的列表
            role: {}, //
            showStatus: 0,
        }

        this.auth= React.createRef()
    }
  
  getRoles = async () => {
    const result = await reqRoleList();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    }
  };
  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render:(create_time)=>formateDate(create_time)
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render:(auth_time)=>formateDate(auth_time)
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };
  handleCancel = () => {
    this.setState({ showStatus: 0 });
  };
  addRole = async () => {
     
      //进行表单验证。只能通过了才向下处理
    const result = await reqAddRole(this.input.props.value);
    if (result.status === 0) {
      message.success("添加角色成功");
      // this.getRoles()
      // 可以不请求直接添加到roles列表
       //新产生的角色
      const role = result.data;
      //更新roles状态
      //更新roles状态：基于原本状态数据更新
      this.setState((state) => ({
        roles: [...state.roles, role],
      }));
    } else {
      message.error("添加角色失败");
    }
    this.setState({ showStatus: 0 });
  };
  setRole = async() => {
    //   console.log('select',select)
     const menus =  this.auth.current.getMenus()
     const role = this.state.role
     role.menus=menus
     role.auth_time = Date.now()
     role.auth_name = memoryUtils.user.username
    //  console.log(role)
     const result = await reqUpdateRole(role)
     if(result.status===0){
         message.success('设置权限成功')
         //如果更新的是自己角色权限,强制退出
        if(memoryUtils.user.username!=='admin'&&role._id===memoryUtils.user.role_id){
          memoryUtils.user={}
          storageUtils.deleteUser()
          this.props.history.replace('./login')
          message.info('权限已更改,请重新登录')
        }
     }else{
         message.error('设置权限失败')
     }
    this.setState({ showStatus: 0 });
  };
  componentDidMount() {
    this.getRoles();
  }
  UNSAFE_componentWillMount() {
    this.initColumn();
  }
  render() {
    const { roles, role, showStatus } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({ showStatus: 1 })}>
          创建角色
        </Button>
        <Button
          type="primary"
          onClick={() => this.setState({ showStatus: 2 })}
          disabled={!role._id}
        >
          设置角色权限
        </Button>
      </span>
    );

   
    return (
      <Card title={title}>
        <Table
          rowKey="_id"
          pagination={{
            pageSize: PAGE_SIZE,
            // , total: 50
          }}
          dataSource={roles}
          columns={this.columns}
          loading={this.state.loading}
          rowSelection={{ type: "radio", selectedRowKeys: [role._id],onSelect:(role)=>{
            this.setState({role:role})} 
          }} //设置单选

          onRow={(role) => {
            return {
              onSelect:(event) => {
                this.setState({ role });
              },
              onClick: (event) => {
                this.setState({ role });
              }, // 点击行
              onDoubleClick: (event) => {},
              onContextMenu: (event) => {},
              onMouseEnter: (event) => {}, // 鼠标移入行
              onMouseLeave: (event) => {},
            };
          }}
          bordered
        />
        <Modal
          title="添加角色"
          visible={showStatus === 1}
          onOk={this.addRole}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <AddForm
            categoryName
            setInput={(input) => {
              this.input = input;
            }}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={showStatus === 2}
          onOk={this.setRole}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <SetTree role={role} ref={this.auth}/>
        </Modal>
      </Card>
    );
  }
}
