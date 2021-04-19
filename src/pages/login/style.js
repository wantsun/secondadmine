import styled from "styled-components";
import bg from '../../assets/img/bg.jpg'
export const LoginWrapper = styled.div`
   width:100%;
   height:100%;
   background-image: url(${bg});
    background-size: 100% 100%;
      .login-header{
        display: flex;
        align-items:center;//垂直居中
        height:80px;
        background-color: rgba(21,20,13,0.5);
        img{
            width:40px;
            height:40px; 
            margin:0 15px 0 50px;
        }
      h1{
        font-size:30px;
        color:white;
      }
    }
    
      .login-content{
        width:400px;
        height:300px;
        background-color:#fff;
        margin:50px auto;
        padding:20px 40px;
        h2{
          font-size:30px;
          text-align:center;
          font-weight:bold; 
          margin-bottom:20px;
        }
       
      }
        
      
`

 

