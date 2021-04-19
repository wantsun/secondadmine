import styled from "styled-components";

export const Headerwrapper = styled.div`
    .header {
         height: 80px; 
         background-color:#fff;
         .header-top{
            height:40px;
            line-height:40px;
            text-align:right;
            padding-right:20px;
            border-bottom: 3px solid #1da57a;
            span{
                margin-right:8px;
                font-size:16px;
            }
         }
         .header-bottom{
            height:40px;
            display:flex;
            align-items:center;
            .header-bottom-left{
                position:relative;
                width:25%;
                text-align:center;
                font-size:20px;
                &::after{
                    content:'';
                    position:absolute;
                    right:50%;
                    transform:translateX(50%);
                    top:100%;
                    border-top:20px solid white;
                    border-right:20px solid transparent;
                    border-bottom:20px solid transparent;
                    border-left:20px solid transparent;
                    
                }
            }
            .header-bottom-right{
                width:75%;
                text-align:right;
                padding-right:20px;
                font-size:16px;
                span,img{
                    margin:5px;
                }
            }
         }
     }
`