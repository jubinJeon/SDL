import React, {useState, useEffect, useRef,useContext} from 'react'
import { Link } from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import useAsync from '../../hook/useAcync'
import * as API from '../../Api'
import * as APPBridge from '../../appBridge'

import {SDLContext} from '../../context/SDLStore'
import FooterNavigation from '../../components/FooterNavgation'

export default ({history}) => {

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack();
    };

    const {dispatch} = useContext(SDLContext);
    
    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    const handleLogout = () => {
        API.logOut()
        .then((data) => {
            if(data.code) 
                history.replace({pathname:ACTION.LINK_MY_SDL, popupTxt: '로그아웃 되었습니다.'})
                APPBridge.SDL_dispatchClearCookie()

        })
    }

    const nickRef = useRef()

    const [state, refech] = useAsync(
        API.getMemberInfo
    )

    const {loading, data, error} = state;

    const [states, setStates] = useState({
        nickname: '',
        userId: '',
        hp: ''
    })

    useEffect(() => {
        if(!loading && data) {
            console.log(data)
            setStates({
                nickname: data.data.mbrNick,
                userId: data.data.mbrId,
                hp: data.data.cnctNo
            })
        }
    }, [state])

    const onHandleChange = (e) => {
        setStates({
            nickname: e.target.value,
            userId: states.userId,
            hp: states.hp
        })
    }

    const onHandleclear = () => {
        setStates({
            nickname: '',
            userId: states.userId,
            hp: states.hp
        })
    }

    const changeNickname = () => {
        if(nickRef.current.value == '') {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '닉네임을 입력해주세요.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }

        API.changeNickname(nickRef.current.value)
        .then((data) => {
            if(data.code) {
                history.replace({pathname:ACTION.LINK_MY_SDL, popupTxt: '회원정보 수정이 완료되었습니다.'})
            }
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
                        <a onClick={onClickBackBtn} className="icon pageClose">CLOSE</a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">내 정보 수정</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <ul className="registerList">
                                    <li>
                                        <span className="leftCell">
                                            <label htmlFor="register_nic">닉네임</label>
                                        </span>
                                        <span className="rightCell">
                                            <span className="textInput withDel">
                                                <input onChange={onHandleChange} ref={nickRef} value={states.nickname} type="text" id="register_nic" placeholder="2자~10이내로 닉네임을 입력해주세요" />
                                                <button className="delInput justDel" type="button" onClick={onHandleclear}>삭제</button>
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className="leftCell">
                                            아이디
                                        </span>
                                        <span className="rightCell">
                                            {states.userId}
                                        </span>
                                    </li>
                                    <li className="editeBtn">
                                        <span className="leftCell">
                                            비밀번호
                                        </span>
                                        <span className="rightCell">
                                            **********
                                            <button onClick={()=>history.push(ACTION.LINK_PWD_RESET)} className="singleBtn disable " >변경</button>
                                        </span>
                                    </li>
                                    <li className="editeBtn">
                                        <span className="leftCell">
                                            휴대폰 번호
                                        </span>
                                        <span className="rightCell">
                                            {states.hp}
                                            <button onClick={()=> history.push({pathname: ACTION.LINK_HP_RESET, hp: states.hp})} className="singleBtn disable ">변경</button>
                                        </span>
                                    </li>
                                </ul>
                                <div className="btnWrap fullWidth topBlock">
                                    <button onClick={changeNickname} className="btn login apply"><strong>완료</strong></button>
                                </div>
                            </div>
                        </div>
                        <div className="logOut">
                            <a onClick={handleLogout}>로그아웃</a> / <Link to={ACTION.LINK_UNREGISTER}>회원탈퇴</Link>
                        </div>
                    </div>
                </div>
            </div>
            <FooterNavigation/>
        </div>
    )
}