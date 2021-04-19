import React, { PureComponent } from 'react';
import {  Card, Select, Input, Button, Table } from "antd";
import LinkButton from '../../components/link-button'
import { reqProducts, reqProductsSearch } from '../../api'
import { PAGE_SIZE } from "../../utils/constant";
const Option = Select.Option;

class ProductHome extends PureComponent {
    constructor() {
        super();

        this.state = {
            products:[],
            loading:false,
            total: 0, //商品的数量
            searchName: "",
            searchType: "productName",/* 受控组件 */
        }
    }

    /**
     * 初始化table的列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                width: 200,

                title: "商品名称",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "商品描述",
                dataIndex: "desc",
                key: "desc",
            },
            {
                width: 100,
                title: "价格",
                dataIndex: "price",
                key: "price",
                render: (price) => "￥" + price, //当前指定了对应的属性，传入的是对应的属性值
            },
            {
                title: '状态',
                dataIndex: 'status',
                render: (status) => {
                    return (
                        <span>
                            <Button type="primary" >下架</Button>
                            <span>在售</span>
                        </span>
                    )
                },

            },
            {
                width: 100,
                title: "操作",
                render: (product) => {
                    return (
                        <span>
                            <LinkButton >详情</LinkButton>
                            <LinkButton >修改</LinkButton>
                        </span>
                    );
                },
            },
        ]
    }

    /**
     * 获取指定页码的列表数据显示
     */

    getProducts = async (pageNum) => {
        this.pageNum=pageNum;
        console.log(" getProducts被调用")
        this.setState({loading:true}) //显示loading

        const {searchName,searchType}=this.state;
        //如果搜索关键字有值，说明我们要做搜索分页
        let result;
        if(searchName){
            result=await reqProductsSearch(
                pageNum,
                PAGE_SIZE,
                searchName,
                searchType)
            console.log("searchName有值",result)
        }else{//一般分页请求
            result =await reqProducts(pageNum,PAGE_SIZE)
        }

        this.setState({loading:false}) //显示loading
        if (result.status === 0) {
            //取出分页数据，更新状态，显示分页数据
            const { total, list } = result.data;
            this.setState({
                total:total,
                products: list
            })
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
        }

    render() {
        const { products,total,loading,searchName,searchType } = this.state;

        const title = (
            <span>
              <Select
                value={searchType}
                style={{ width: 150 }}
                onChange={(value) => this.setState({ searchType: value })}
              >
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
              </Select>
              <Input
                style={{ width: 200 }}
                placeholder="关键字"
                onChange={(event) =>
                  this.setState({ searchName: event.target.value })
                }
              />
              <Button type="primary" onClick={e => this.getProducts(1)}>
                搜索
              </Button>
            </span>
          );

        const extra = (
            <Button>

            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey="_id"
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        pageSize: PAGE_SIZE,
                        showQuickJumper:true,
                        total:total,
                        onChange:this.getProducts
                    }}
                />;
            </Card>
        );
    }
}



export default ProductHome;