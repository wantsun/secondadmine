import React, { PureComponent } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, List,Image } from "antd";
import { LeftNavWrapper } from "./detail-style"
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constant'
import {reqCategory} from '../../api/index'


class ProductDetail extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            cName1:'',//
            cName2:'',//二级分类
        }
    }
    async componentDidMount(){
        //得到当前商品的分类ID
        const{pCategoryId,categoryId}=this.props.location.state.product;
        if (pCategoryId === "0") { //一级分类下的商品
            const result = await reqCategory(categoryId);
            const cName1 =result.data.name
            this.setState({cName1})
            console.log(" componentDidMount",result);
       }else{//二级分类下的商品

        //通过多个await方式发多个请求，只有都成功，才正常处理
            // const result=await reqCategory(pCategoryId)
            // const result2=await reqCategory(categoryId)
            // const cName1=result.data.name
            // const cName2=result2.data.name


            //一次性发送多个请求，只有成功了，才正常处理
            const results = await Promise.all([reqCategory(categoryId),reqCategory(pCategoryId)])
                const cName1=results[0].data.name
                const cName2=results[1].data.name
            this.setState({
                cName1,
                cName2
            })
       }
    }
    render() {
        //读取携带过来的state数据
            const { name, desc, price, detail, imgs } = this.props.location.state.product;
            console.log(imgs)
            const {cName1,cName2}=this.state;

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()} >
                    <ArrowLeftOutlined style={{ color: 'green', marginRight: 15, fontSize: '20' }} />
                </LinkButton>
                <span className="left">商品详情</span>
            </span>
        )
        return (
            <LeftNavWrapper>
                <Card title={title} className='product-detail'>
                    <List>
                        <List.Item>
                            <span className="left">商品名称:<span className="left-content">{name}</span></span>

                        </List.Item>
                        <List.Item>
                            <span className="left">商品描述: <span className="left-content">{desc}</span></span>

                        </List.Item>
                        <List.Item>
                            <span className="left">商品价格<span className="left-content">{price}</span></span>

                        </List.Item>
                        <List.Item>
                            <span className="left">所属分类 <span className="left-content">{cName1} {cName2?"-->"+cName2:''}</span></span>

                        </List.Item>
                        <List.Item>
                            <span>商品照片:
                            
                                {imgs.map((img) => (
                                    <Image
                                        key={img}
                                        height={200}
                                        width={200}
                                        className='product-img'
                                        alt={img.name}
                                        src={BASE_IMG_URL+img}
                                    />
                                ))}
                            </span>
                        </List.Item>
                        <List.Item style={{ float: "left" }}>
                            <span className="left">商品详情:</span>
                            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                        </List.Item>
                    
                    </List>
                </Card>
            </LeftNavWrapper>
        );
    }
}



export default ProductDetail;