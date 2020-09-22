import React, { useEffect, useState, useRef } from 'react';

import * as API from '../../Api'
import * as ACTION from '../../common/ActionTypes'

export default ({history, location}) => {

    const prevPN = location.hp

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack();
    };

    const pnRef = useRef('')
    const authRef = useRef('')
    const [ipDisable, setDisable] = useState(false)

    const [showErrArea, setShowErrArea] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [showCodeArea, setShowCodeArea] = useState(false)

    const [btnTxt, setBtnTxt] = useState('인증번호 받기')

    const getAuthCode = () => {
        
        if( pnRef.current.value == '' ) {
            setErrMsg('휴대폰 번호를 입력해주세요.')
            setShowErrArea(true)
            return ;
        }
        else if( prevPN == pnRef.current.value) {
            setErrMsg('이전 번호와 동일합니다.')
            setShowErrArea(true)
            return ;
        }
        setShowErrArea(false)
        API.getAuthCodebyPhone(pnRef.current.value)
        .then((data) => {
            if(data.code) {
                console.log(data)
                setShowCodeArea(true)
                setBtnTxt('인증번호 재전송')
                setDisable(true)
            }
        })
        .catch((err) => {
            console.log(err.response)
            if(err.response.status == 400) {
                setErrMsg(err.response.data.msg)
                setShowErrArea(true)
            }
            else {
                console.log(err.response)
            }
        })
    }

    const changePwd = () => {

        if(authRef.current.value == '') {
            setErrMsg('인증번호를 입력해주세요')
            setShowErrArea(true)
            return ;
        }
        API.resetPhNum(pnRef.current.value, authRef.current.value)
        .then((data) => {
            if(data.code)
                history.replace({pathname:ACTION.LINK_MY_SDL, popupTxt: '휴대폰 번호 변경이 완료되었습니다.'})
        })
        .catch((err) => {
            if(err.response.status == 400) {
                // setErrMsg('인증번호가 일치하지 않습니다.')
                setErrMsg(err.response.data.msg)
                setShowErrArea(true)
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
                        <h1 className="headerTitle">휴대폰 번호 변경</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <div className="certifiArea">
                                    <div className="certifiRow">
                                        <label className="textInput">
                                            <input ref={pnRef} type="text" maxLength={11} disabled={ipDisable} title="phonenum" placeholder="휴대폰 번호를 입력하세요" />
                                        </label>
                                        <button className="btn defaultBtn" onClick={getAuthCode} >{btnTxt}</button>
                                    </div>
                                    { showCodeArea && <div className="certifiRow">
                                        <label className="textInput">
                                            <input ref={authRef} maxLength={8} type="text" title="인증번호" placeholder="인증번호를 입력하세요"/>
                                        </label>
                                        <button className="btn completeBtn" onClick={changePwd}>완료</button>
                                    </div>}
                                    { showErrArea && <div><p className="errMsg">{errMsg}</p></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}