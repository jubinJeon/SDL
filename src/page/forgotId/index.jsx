import React, {useState, useCallback, useEffect, useContext} from 'react';
import {REDUCER_ACTION} from '../../context/SDLReducer'
import {SDLContext} from '../../context/SDLStore'
import * as ACTION from '../../common/ActionTypes'

export default ({history}) => {

    const {data,dispatch} = useContext(SDLContext)

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    const [authorized, setAuth] = useState(0)   // 0: 미인증 1: 아이디 찾음 2: 회원정보 없음
    const [usrId, setUsrId] = useState('')
    
    const callback = useCallback((event) => {
        console.log('process.env.SDL_CERT_USER_URL', process.env.REACT_APP_SDL_CERT_FIND_USER_URL)

        if (event.origin.indexOf(process.env.REACT_APP_SDL_API_DOMAIN) !== -1) {
            // console.log(event)
            const data = JSON.parse(event.data)

            if(data.code) {
                setAuth(1)
                setUsrId(data.data.mbrId)
                dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})
            }
            else {
                setAuth(2)
                dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})
            }
        }
    })

    useEffect(() => {
        // window 이벤트 리스너를 등록한다.
        window.addEventListener("message", callback, false);

        return () => {
            window.removeEventListener("message", callback, false);
        }
    }, [])

    const handleBtnClick = useCallback(() => {

        dispatch({type : REDUCER_ACTION.OPEN_FIND_ID_WIN_POP})
    }, [])


    return (
    <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a className="icon pageClose" onClick={handleOnClick}>CLOSE</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">아이디 찾기</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="fullHeight">
                    <div className="sectionRow">
                        <div className="loginForm">
                            { authorized == 0 && <div>
                                <h2 className="pageTitle">휴대폰 본인 인증</h2>
                                <div className="btnWrap">
                                    <button onClick={handleBtnClick} className={!authorized ? "btn login default":"btn login disable"}><strong>본인 인증하기</strong></button>
                                </div>
                            </div> }
                            { authorized ==1 && 
                            <div>
                                <p className="findMsg">
                                    등록된 회원님의 아이디(이메일)입니다.
                                    <strong className="findResult">{usrId}</strong>
                                </p>
                                <div className="btnWrap">
                                    <button onClick={()=> history.replace(ACTION.LINK_LOGIN)} className="btn login default"><strong>로그인 하러 가기</strong></button>
                                </div>
                            </div>
                            }
                            { authorized == 2 && 
                            <div>
                                <p className="findMsg">
                                    일치하는 회원정보가 없습니다.
                                </p>
                                <div className="btnWrap">
                                    <button onClick={()=> history.replace(ACTION.LINK_SIGNUP_AGREE)} className="btn login default"><strong>회원가입</strong></button>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )

}