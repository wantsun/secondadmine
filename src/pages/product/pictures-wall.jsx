
import React, { PureComponent } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDelImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constant'
/**
 * 
 * 用于图片上传的组件
 */

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            previewVisible: false, //标识是否显示大图
            previewImage: '', //大图的地址
            previewTitle: '',
            fileList: [
            ],
        };
        
        const {imgs}=this.props
        console.log("imgs",imgs)
      //   debugger
        if(imgs&&imgs.length>0){
            
          this.state.fileList = imgs.map((item,index)=>({
              uid: -index,
              name: item,
              status: 0,
              url:BASE_IMG_URL+item
          }))
        }

    }


    /* 获取所有已上传图片文件名的数组 */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    //隐藏model
    handleCancel = () => this.setState({ previewVisible: false });
    //显示指定file对应的大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    /*
  file: 当前操作的图片文件(上传/删除)
  fileList: 所有已上传图片文件对象的数组
   */
    handleChange = async({ file, fileList }) => {
        console.log("handleChange", file, fileList)

        //一旦上传成功，将当前上传的file的信息修正
        if (file.status === 'done') {
            const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            if (result.status === 0) {
                message.success('上传图片成功!')
                const { name, url } = result.data
                file = fileList[fileList.length - 1] //把fileList[fileList.length-1]赋给file
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        }else if(file.status==='removed'){
            const result = await reqDelImg(file.name)
            console.log(result)
            if(result.status===0){
                message.success('删除成功') //防止服务器图片积累过多
            }else{
                message.error('删除失败')
            }
            
        }
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload" /*上传图片的接口地址*/
                    accept='image/*'  /*只接收图片格式*/
                    name='image' /*请求参数名*/
                    listType="picture-card"  /*卡片样式*/
                    fileList={fileList}  /*所有已上传图片文件对象的数组*/
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}