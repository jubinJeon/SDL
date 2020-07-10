import React, {useState, useCallback, useRef, useEffect, useContext} from 'react';
import {REDUCER_ACTION} from '../../context/SDLReducer'

import * as ACTION from '../../common/ActionTypes'
import * as API from '../../Api'
import {SDLContext} from '../../context/SDLStore'


export default ({history}) => {

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    const {dispatch} = useContext(SDLContext);

    const [authorized, setAuth] = useState(false)
    const idRef = useRef()
    const [mbrCi, setMbrCi] = useState('')

    var authWindow

    const callback = useCallback((event) => {
        
        if (event.origin.indexOf(process.env.REACT_APP_SDL_API_DOMAIN) !== -1) {
            const data = JSON.parse(event.data)
            console.log(data)

            if(data.code) {
                setAuth(true)
                setMbrCi(data.data.mbrCi)
                dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})
            }
            else {
                
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: '일치하는 아이디가 없습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})
            }
        }
    })

    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    useEffect(() => {
        // window 이벤트 리스너를 등록한다.
        window.addEventListener("message", callback, false);
        
        return () => {
            window.removeEventListener("message", callback, false);
        }
    }, [])

    const handleBtnClick = useCallback(() => {
        const check = idRef.current.value.indexOf('@')

        if( check== 0 || check==-1 || check==idRef.current.value.length-1 ) {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '이메일 형식을 확인해주세요.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return;
        }

        dispatch({type : REDUCER_ACTION.OPEN_FIND_PW_WIN_POP, payload : { mbrId : idRef.current.value}})
        
    }, [])

    const passRef = useRef()
    const rePassRef = useRef()
    const [active, setActive] = useState(false)

    const onHandleChange = () => {
        if( passRef.current.value != '' && rePassRef.current.value != '') {
            setActive(true)
        } else
            setActive(false)
    }

    const doResetPw = e => {
        e.preventDefault();

        if(passRef.current.value == '' || rePassRef.current.value == '') {
            return ;
        }

        if(passRef.current.value != rePassRef.current.value) {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '비밀번호가 일치하지 않습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }

        API.nonMemResetPwd(idRef.current.value, mbrCi, passRef.current.value, rePassRef.current.value)
        .then((data) => {
            
            if(data.code)
                history.replace({pathname:ACTION.LINK_MYPAGE, popupTxt: '비밀번호 변경이 완료되었습니다.'})
            
        })
        .catch((err) => {
            if(err.response.status == 400) {
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
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
                <a className="icon pageClose" onClick={handleOnClick}>CLOSE</a>
                </div>            
                <div className="middleArea">
                    <h1 className="headerTitle">비밀번호 찾기</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="fullHeight">
                    <div className="sectionRow">
                        <div className="loginForm">
                            <h2 className="pageTitle">아이디(이메일)</h2>
                            <ul className="formList">
                                <li>
                                    <label className="textInput">
                                        <input disabled={authorized} ref={idRef} type="eamil" title="이메일" placeholder="이메일 주소를 입력하세요" />
                                    </label>  
                                </li>
                            </ul>
                            { !authorized && <><h2 className="pageTitle">휴대폰 본인 인증</h2>
                            <div className="btnWrap">
                                {/* <!-- 수정 ver.01 0603 텍스트 수정 --> */}
                                <button onClick={handleBtnClick} className="btn login default"><strong>본인 인증하기</strong></button>
                            </div></>}
                            { authorized && 
                            <>
                                {/* <!-- 수정 ver.01 0603 인증 완료 후 --> */}
                                <h2 className="pageTitle">휴대폰 본인 인증</h2>
                                <div className="btnWrap">
                                    <button className="btn login disable"><strong>본인 인증완료</strong></button>
                                </div> 
                                <h2 className="pageTitle">비밀번호 변경</h2>
                                <ul className="formList">
                                    <li>
                                        <label className="textInput">
                                            <input onChange={onHandleChange} ref={passRef} type="password" title="비밀번호" placeholder="비밀번호를 입력하세요" />
                                        </label>
                                    </li>
                                    <li>
                                        <label className="textInput">
                                            <input onChange={onHandleChange} ref={rePassRef} type="password" title="비밀번호 다시입력" placeholder="비밀번호를 다시 입력하세요" />
                                        </label>  
                                    </li>
                                </ul>
                                {/* <!-- //수정 ver.01 0603 인증 완료 후 --> */}
                                <div className="btnWrap">
                                    { active ? <button onClick={doResetPw} className="btn login default"><strong>확인</strong></button>
                                    : <button onClick={doResetPw} className="btn login disable"><strong>확인</strong></button> }
                                </div> 
                            </> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}