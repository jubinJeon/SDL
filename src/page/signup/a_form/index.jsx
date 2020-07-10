import React, {useState, useEffect, useRef, useContext} from 'react';
import { Link } from 'react-router-dom';

import Joining_Header from '../../../components/HeaderCloser'
import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import {SDLContext} from '../../../context/SDLStore'

export default ({location, history}) => {

    const {dispatch} = useContext(SDLContext);
    
    const idRef = useRef()
    const pwRef = useRef()
    const rePwRef = useRef()
    const nickRef = useRef()

    const [isActive, setIsActive] = useState(false)

    const keyEvent = () =>{
        var _originalSize = window.innerWidth + window.innerHeight;
        window.addEventListener('resize', function() {
            if(window.innerWidth + window.innerHeight != _originalSize){
                document.querySelector(".fixedBottom").classList.add("active");
            } else {
                document.querySelector(".fixedBottom").classList.remove("active");
            }
        });
    }

    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    const onHandleKeyup = () => {
        if( idRef.current.value != '' && pwRef.current.value != '' && rePwRef.current.value != '' && nickRef.current.value != '' )
            setIsActive(true)
        else
            setIsActive(false)
    }

    const register = () => {

        if(!isActive) return ;
        
        const memdata = location.data.data

        /* if( idRef.current.value == '' || pwRef.current.value == '' || rePwRef.current.value == '' || nickRef.current.value == '' ) {
            setToastMsg('모든 항목을 입력해주세요.')
            setOpen(true)
            return ;
        } else  */
        if( pwRef.current.value != rePwRef.current.value ) {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '비밀번호가 일치하지 않습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }

        API.checkId(idRef.current.value)
        .then((data) => {
                // 아이디 중복
                if(!data.code) {
                    console.log(data)
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: data.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
                    return ;
                }
                console.log(memdata)
                // 정상
                API.register(idRef.current.value,
                    pwRef.current.value,
                    rePwRef.current.value,
                    nickRef.current.value,
                    memdata.mbrNm,
                    memdata.cnctNo,
                    memdata.mbrCi,
                    memdata.mbrBrth,
                    memdata.gendCd,
                    "1").then((data) => {
                        console.log(data)
                        if(data.code) history.replace({pathname:ACTION.LINK_MYPAGE, popupTxt: '로그인 되었습니다.'})
                    })
                    .catch((err) => {
                        console.log(err.response)
                        dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg, code : '', dispatch : dispatch} , callback : toastCallback}})

                    })
        })
        .catch((err) =>  {
            console.log(err)
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
        })
    }

    return (
        <div id="wrap">
            <Joining_Header headerTitle='회원가입'/>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <div className="btnWrap">
                                    <strong className="btn login disable">휴대폰 본인 인증완료</strong>
                                </div>
                                <ul className="registerList">
                                    <li>
                                        <span className="leftCell">
                                            <label htmlFor="register_id">아이디</label>
                                        </span>
                                        <span className="rightCell">
                                            <span className="textInput">
                                                <input type="email" ref={idRef} onChange={onHandleKeyup} placeholder="이메일 주소를 입력하세요"/>
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className="leftCell">
                                            <label htmlFor="register_pw">비밀번호</label>
                                        </span>
                                        <span className="rightCell">
                                            <span className="textInput">
                                                <input type="password" ref={pwRef} onChange={onHandleKeyup} placeholder="영문+숫자+특수문자 조합 8자리 이상"/>
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className="leftCell">
                                            <label htmlFor="register_ck">비밀번호 확인</label>
                                        </span>
                                        <span className="rightCell">
                                            <span className="textInput">
                                                <input type="password" ref={rePwRef} onChange={onHandleKeyup} placeholder="비밀번호를 다시 입력해주세요"/>
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className="leftCell">
                                            <label htmlFor="register_nic">닉네임</label>
                                        </span>
                                        <span className="rightCell">
                                            <span className="textInput">
                                                <input type="text" ref={nickRef} onChange={onHandleKeyup} placeholder="2자~10이내로 닉네임을 입력해주세요"/>
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="formInBtn">
                                <div className="btnWrap fullWidth">
                                    <button onClick={register} className={isActive ? "btn login default" :"btn login disable"}><strong>완료</strong></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
