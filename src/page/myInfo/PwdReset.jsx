import React, {useState, useRef, useContext} from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import * as API from '../../Api'

import {SDLContext} from '../../context/SDLStore'

export default ({history}) => {

    const {dispatch} = useContext(SDLContext);


    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack();
    };

    const passRef = useRef()
    const rePassRef = useRef()

    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }
    
    const [isActive, setIsActive] = useState(false)

    const onHandleKeyup = () => {
        if( passRef.current.value != '' && rePassRef.current.value != '' )
            setIsActive(true)
        else
            setIsActive(false)
    }

    const doResetPw = e => {
        e.preventDefault();
        if(!isActive) return ;

        if(passRef.current.value == '' ||  rePassRef.current.value == '') {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '비밀번호를 입력하세요.', code:'', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }
        else if(passRef.current.value != rePassRef.current.value) {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '비밀번호가 일치하지 않습니다.', code:'', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }

        API.resetPwd(passRef.current.value, rePassRef.current.value)
        .then((data) => {
            if(data.code)
                history.replace({pathname:ACTION.LINK_MYPAGE, popupTxt: '비밀번호 변경이 완료되었습니다.'})
            
        })
        .catch((err) => {
            if(err.response.status == 400) {
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: '비밀번호는 영문+숫자+특수문자 조합 8~30자 입니다.', code:'', dispatch : dispatch} , callback : toastCallback}})
            }
            else {
                console.log(err.response)
            }
        })
    }
    
    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={onClickBackBtn} className="icon pageClose">CLOSE</a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">비밀번호 변경</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <form onSubmit={doResetPw}>
                            <div className="loginForm">
                                <ul className="formList">
                                    <li>
                                        <label className="textInput">
                                            <input ref={passRef} onChange={onHandleKeyup} type="password" title="비밀번호" placeholder="영문+숫자+특수문자 조합 8자리 이상" />
                                        </label>  
                                    </li>
                                    <li>
                                        <label className="textInput">
                                            <input ref={rePassRef} onChange={onHandleKeyup} type="password" title="비밀번호 다시입력" placeholder="비밀번호를 다시 입력해주세요" />
                                        </label>  
                                    </li>
                                </ul>
                                <div className="btnWrap">
                                    <button type="submit"  className={isActive ? "btn login default" :"btn login disable"}><strong>변경</strong></button>
                                </div> 
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div id="nav">
                <div>
                    <ul className="navList">
                        <li className="home"><Link to={{pathname: ACTION.LINK_HOME}}>홈</Link></li>
                        <li className="map"><Link to={{pathname: ACTION.LINK_AROUND_MAP}}>주변지도</Link></li>
                        <li className="myPage active"><Link to={{pathname: ACTION.LINK_MYPAGE}}>my슬배생</Link></li>
                        <li className="myOrder"><Link to={{pathname: ACTION.LINK_ORDER_HISTORY}}>주문내역</Link></li>
                        <li className="myLike"><Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}