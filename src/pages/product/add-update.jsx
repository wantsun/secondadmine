import React, { PureComponent } from 'react';
import { Card, Form, Input,  Button, message,Cascader } from "antd";
import LinkButton from "../../components/link-button";
import { RollbackOutlined,PlusOutlined } from "@ant-design/icons";
import {BASE_IMG_URL} from '../../utils/constant'
import { reqCategorys,reqAddProduct } from "../../api";
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor'



const { Item } = Form;
const { TextArea } = Input;
class ProductAddUpdate extends PureComponent {
  constructor(){
    super()
    this.state={
      options:[],
      // 创建用来保存ref标识的标签对象的容器
      pw : React.createRef(),
      editor : React.createRef(),
    }
  }
 

  initOptions = async (categorys) => {

    //根据categorys生成options 数组
    const options = categorys.map((c) => ({
      //注意小括号
      value: c._id,
      label: c.name,
      isLeaf: false, //不是叶子
    }));
    
    
    //如果是一个二级分类列表商品的更新
    const { isUpdate, product } = this;
 
    const { pCategoryId} = product.product;
    if (isUpdate && pCategoryId !== "0") {
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      //生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        //注意小括号,生成二级列表
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      //关联到对应的一级option
      //找到对应的一级对象
      //   debugger
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );
      if (targetOption) {
        //如果找到
        targetOption.children = childOptions;
      }
    }
    
    //更新options状态
    this.setState({ options });
    // console.log(this.state.options)
  };


   /* async返回值是新的promise对象,promise结果和值由async的结果来决定 */
   //异步获取一级/二级分类列表
   getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    // debugger
    if (result.status === 0) {
      const categorys = result.data;
      //如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys);
      } else {
        return categorys; //返回二级列表=》当前async函数返回的promise就会成功
      }
      // console.log(categorys)
    }
  };


  componentDidMount() {
    this.getCategorys("0");
  }


  UNSAFE_componentWillMount (){
    //取出携带的state
    const product = this.props.location.state  // 如果是添加没值, 否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!product
    // 保存商品(如果没有, 保存是{})
    this.product = product || {}
  };
  render() {

    const {isUpdate,product} =this;
    const {
      pCategoryId, categoryId, imgs, detail,name,desc,price
    } = product.product;
    const categoryIds = [];
    if (isUpdate) {
       
      //商品是一个一级分类的商品
      if (pCategoryId === "0") {
       
        categoryIds.push(categoryId)
      }else{
        //商品是一个二级分类列表
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId)
       
      }
    }
    // if (isUpdate) {
    //   if (pCategoryId !== "0") {
    //     categoryIds.push(pCategoryId);
    //   }
    // }
    // categoryIds.push(categoryId);


    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 8,
      }
    };
    
    

   
    const onChange = (value, selectedOptions) => {
      console.log(value, selectedOptions);
    };

    const loadData = async (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      //显示loading
      targetOption.loading = true;
      //   load options lazily
      //获取二级分类列表
      const subCategorys = await this.getCategorys(targetOption.value);
      // console.log(subCategorys)
      if (subCategorys && subCategorys.length > 0) {
        const cOptions = subCategorys.map((c) => ({
          //注意小括号,生成二级列表
          value: c._id,
          label: c.name,
          isLeaf: true,
        }));
        //关联到当前option上
        targetOption.children = cOptions;
      } else {
        //当前分类没有二级分类
        targetOption.isLeaf = true;
      }

      targetOption.loading = false;
      this.setState({ options: [...this.state.options] });
    };
    
    const onFinish = async (values) => {//调用接口请求函数去添加/更新
      //   console.log("Success:", values);
      // 1. 收集数据, 并封装成product对象
      const {name, desc, price, categoryIds} = values
      let pCategoryId, categoryId
      if (categoryIds.length===1) {
        pCategoryId = '0'
        categoryId = categoryIds[0]
      } else {
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      }
      const imgs = this.state.pw.current.getImgs()
      const detail = this.state.editor.current.getDetail()

      const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

      // 如果是更新, 需要添加_id
      if(this.isUpdate) {
        product._id = this.product._id
      }
      console.log("product._id",product._id)

      // 2. 调用接口请求函数去添加/更新
      const result = await reqAddProduct(product)
      console.log("result",result)
      // 3. 根据结果提示
      if (result.status===0) {
        message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
        this.props.history.goBack()
      } else {
        message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
      }
  
    };

      const onFinishFailed = (errorInfo) => {
        message.error('提交失败');
        
      };


    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <RollbackOutlined style={{ fontSize: 20 }} />
        </LinkButton>
        {isUpdate?'修改':'添加商品'}
      </span>
    );


    return (
      <Card title={title}>
        <Form 
        {...formItemLayout}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        >
          <Item
            name='name'
            label='商品名称'
            initialValue={name}
            rules={[{ required: true, message: "必须输入商品名称!" }]}
          >
            <Input placeholder='请输入商品名称' />
          </Item>
          <Item name="desc" label="商品描述"
            initialValue={desc}
            rules={[{ required: true, message: "必须输入商品描述!" }]} >
            <TextArea
              placeholder="请输入商品描述"
              rows={3}
              bordered="true"
            ></TextArea>
          </Item>
          <Item 
          label='商品价格'
          name='price'
          initialValue={price}
            rules={[{ required: true, message: "必须输入商品价格!" },
            {
              validator: (_, value) =>
                !value || value * 1 > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("商品价格必须大于0")),
            },
          ]}
          >
            <Input prefix="￥" suffix="元" placeholder="请输入商品的价格" />
          </Item>
          <Item 
          label='商品分类'
          name='categoryIds'
          initialValue={categoryIds}
          rules={[{ required: true, message: "必须选择商品分类!" }]}
          >
            <Cascader
             options={this.state.options} //需要显示的列表对象
            onChange={onChange} 
            loadData={loadData}
            changeOnSelect />
          </Item>
          <Item 
          label='商品图片'
          name='imgs'
          >
           <PicturesWall ref={this.state.pw} imgs={imgs}/>
          </Item>
          <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.state.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" style={{marginLeft:30}}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}



export default ProductAddUpdate;