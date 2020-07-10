import React, {useRef, useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import Joining_Header from '../../components/HeaderCloser'
import * as API from '../../Api'
import {getAccessId} from '../../util/Utils'
import * as AppBridge from '../../appBridge'
import {pullPushToken} from '../../util/Utils'

import {SDLContext} from '../../context/SDLStore'

export default ({history}) => {

    const {dispatch} = useContext(SDLContext);

    const idRef = useRef();
    const pwRef = useRef();
    const keepLogin = useRef();
    
    
    const handleClick = () => {
        // setOpen(true);
    };

    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    const doLogin = (e) => {
        e.preventDefault();

        if(idRef.current.value == '') {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '이메일은 필수입니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }
        else if(pwRef.current.value == '') {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '비밀번호는 필수입니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }

        const pushToken = pullPushToken()

        API.signIn(idRef.current.value.toString().trim(), pwRef.current.value.toString().trim()
            , keepLogin.current.checked ? 1 : 0, pushToken)
        .then((data) => {
            console.log(data)

            if(data.code) {
                history.replace({pathname:ACTION.LINK_MYPAGE, popupTxt: '로그인 되었습니다.'})
            }
        })
        .catch((err) => {
            if(err.response.status == 401) {
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: '회원 정보가 없습니다.', code : err.response.data.code, dispatch : dispatch} , callback : toastCallback}})
            }
            else {
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch} , callback : toastCallback}})
            }
        })
        
    }

    // const keyEvent = () =>{
    //     console.log('aaaaaa')
    //     var _originalSize = window.innerWidth + window.innerHeight;
    //     window.addEventListener('resize', function(){
    //         if(window.innerWidth + window.innerHeight != _originalSize){
    //             document.querySelector(".fixedBottom").classList.add("active");
    //         }else{
    //             document.querySelector(".fixedBottom").classList.remove("active");
    //         }
    //     });
    // }
    
    
    return (
        <div id="wrap">
            <Joining_Header headerTitle='로그인'/>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <h1 className="logo">
                                슬기로운 배달 생활 슬배생
                            </h1> 
                            <div className="loginForm">
                            <form onSubmit={doLogin} >
                                <ul className="formList">
                                    <li>
                                        <label className="textInput">
                                            <input ref={idRef} type="text" title="이메일 주소" placeholder="이메일 주소를 입력하세요"/>
                                        </label>
                                    </li>
                                    <li>
                                        <label className="textInput">
                                            <input ref={pwRef} type="password" title="비밀번호" placeholder="비밀번호를 입력하세요"/>
                                        </label>  
                                    </li>
                                </ul>
                                <div className="formMore">
                                    <div className="infoCheck">
                                        <label className="checkSelect">
                                            <input ref={keepLogin} onClick={(e) => {
                                                if( e.target.checked )
                                                    keepLogin.current.checked = true
                                                else
                                                    keepLogin.current.checked = false
                                            }} type="checkbox" defaultChecked={true} /> <span className="dCheckBox">자동 로그인</span>
                                        </label>
                                    </div>
                                    <div className="infoTxt"> 
                                        <Link to={ACTION.LINK_FORGOT_ID}>아이디 찾기</Link> / <Link to={ACTION.LINK_FORGOT_PW}>비밀번호 찾기</Link>
                                    </div>
                                </div>
                                <div className="btnWrap">
                                    <button type="submit" className="btn login apply"><strong>로그인</strong></button>
                                </div> 
                            </form>
                            </div>
                        </div>
                        {/* <div className="socialLogin fixedBottom">
                            <ul className="btnWrap">
                                <li>
                                    <a href="#" className="btn icon social btnNaver" onClick={
                                        ()=>{API.logOut()}
                                    }>네이버로 로그인</a>
                                </li>
                                <li>
                                    <a href="#" className="btn icon social btnKakao" onClick={()=>{
                                        let ev = new CustomEvent('sdlAppBridge',{detail : {type : 200, data : 'testtest'}});
                                        window.dispatchEvent(ev);
                                    }}>카카오로 로그인</a>
                                </li>
                                <li>
                                    <a href="#" className="btn icon social btnGoogle" onClick={aaa}>구글로 로그인</a>
                                </li>
                            </ul>
                            <p className="loginInfo">
                                슬배생이 처음이시라면?
                                <Link to={{pathname: ACTION.LINK_SIGNUP_AGREE}} className="goLink">
                                    <strong>회원가입</strong>
                                </Link>
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}


    
