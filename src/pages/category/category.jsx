import React, { PureComponent } from 'react';
import { Button, Card, Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import {
  reqCategorys,
  reqUpdateCategory,
  reqAddCategory
} from "../../api/index";
import AddForm from "./addform";
import UpdateForm from "./updateform";
/*首页路由  */

export default class Category extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,//是否正在获取数据中
      categorys: [],//一级分类列表
      subCategorys: '',//耳机分类列表  
      parentId: '0', //当前需要显示分类列表的父分类ID
      parentName: '',//当前需要显示的分列列表的父分类名称
      showStatus: 0, //0都不显示,1显示更新,2显示添加
    }
  }
  /**
   * 初始化table
   */
  initColums = () => {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "操作",
        width: 300,
        key: "action",
        dataIndex: "",
        render: (category) => (
          <span>
            <LinkButton
              onClick={() => this.showUpdate(category)}>修改分类
            </LinkButton>
            {/* 如何向事件回调函数传递参数,定义一个回调函数 */}
            {this.state.parentId === "0" ? (
              <LinkButton
                onClick={() => {
                  this.showSubCategory(category);
                }}
              >
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  }

  //异步获取一级分类列表显示
  getCategorys = async () => {
    //在发请求前，显示loading
    this.setState({ loading: true });
    const { parentId } = this.state;
    const result = await reqCategorys(parentId);
    this.setState({ loading: false });
    if (result.status === 0) {
      //取出分类数组（可能是一级也可能是二级）
      const categorys = result.data;
      if (parentId === "0") {
        //更新一级分类状态
        this.setState({ categorys }); //简写
      } else {
        //更新二级分类状态
        this.setState({ subCategorys: categorys });
      }
      // console.log(categorys)
    } else {
      message.error("获取分类列表失败");
    }
  };

  /* 展现指定对象的子列表 */
  showSubCategory = (category) => {
    //更新状态时异步的
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      () => {
        //在状态更新后重新render后执行
        this.getCategorys();
      }
    );
  };

  /* 显示指定一级分类列表 */
  showCategory = () => {
    //更新为显示一级列表的状态
    console.log("1")
    this.setState(
      {
        parentId: "0",
        parentName: "",
        subCategorys: [],
      }
    );
  }

  //相应点击取消：隐藏确定框
  handleCancel = () => {
    this.setState({ showStatus: 0 });
  };


  addCategotry = async () => {
    //隐藏确认框
    this.setState({ showStatus: 0 });
    

    //收集属性，并提交添加分类的请求
    const parentId = this.classes.props.defaultValue;
    const categoryName = this.input.state.value;
   
    if (!categoryName) {
      message.error('名称不能为空!')
    }
    const result = await reqAddCategory(categoryName, parentId);
    // console.log(result);
    if (result.status === 0) {
      
      //添加的分类就是当前分类列表下的分类
     
      if (parentId) {
        this.getCategorys();//重新获取当前分类列表
        message.success('添加成功')
      }else if(parentId==='0'){
        this.getCategorys('0')
      }
    } else {
      message.error('添加失败')
    }
  };
  //显示修改的确认框
  showUpdate = (category) => {
    //保存分类对象
    this.category = category;
    //更新状态
    this.setState({
      showStatus: 1
    })
  }

  //修改后更新列表
  updateCategory = async () => {
    console.log('update')

    //1.隐藏确定框
    this.setState({
      showStatus: 0
    })

    //准备数据
    const categoryId = this.category._id;
    const categoryName = this.form.state.value;
   
    if (!categoryName) {
      message.error('名称不能为空!')
      return
    }

    //2.发请求更新分类
    const result = await reqUpdateCategory(categoryId, categoryName);
    console.log(result)
    if (result.status === 0) {
      //重新显示列表
      this.getCategorys();
      message.success('修改成功')
    } else {
      message.error('修改失败')
    }
  };

  //为第一次render()准备数据
  componentWillMount() {
    this.initColums();
  }

  //发异步ajax请求
  componentDidMount() {
    this.getCategorys();
  }
  render() {
    //读取状态数据
    const { parentId,
      categorys,
      subCategorys,
      parentName,
      showStatus, } = this.state;

    //读取指定的分类
    const category = this.category || {};//如果没有指定一个空对象

    //card的左侧
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton
            onClick={() => this.showCategory()}
          >
            一级分类列表
          </LinkButton>{" "}
          <ArrowRightOutlined style={{ marginRight: '5px' }} /> {parentName}
        </span>
      );

    //card的右侧
    const extra = (
      <Button type="primary"
        onClick={() => {
          this.setState({ showStatus: 2 });
        }}>
        <PlusOutlined />
                添加
      </Button>
    )

    return (
      <div>
        <Card title={title} extra={extra} >
          <Table
            // rowKey="_id"
            pagination={{
              pageSize: 5
              // , total: 50 
            }}
            dataSource={parentId === "0" ? categorys : subCategorys}
            columns={this.columns}
            loading={this.state.loading}
          />
          <Modal
            title="添加分类"
            visible={showStatus === 2}
            onOk={this.addCategotry}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <AddForm
              categorys={categorys}
              parentId={parentId}
              setClasses={(classes) => {
                this.classes = classes;
              }}
              setInput={(input) => {
                this.input = input;
              }}
            />
          </Modal>
          <Modal
            title="修改分类"
            visible={showStatus === 1}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            < UpdateForm
              categoryName={category.name}
              setForm={(form) => {
                this.form = form;
              }}
            />
          </Modal>
        </Card>
      </div>
    );
  }
}
