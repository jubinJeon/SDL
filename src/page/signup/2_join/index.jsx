import React, {useState, useEffect,useCallback,useContext} from 'react';
import { Link } from 'react-router-dom';

import Joining_Header from '../../../components/HeaderCloser'
import * as ACTION from '../../../common/ActionTypes'
import {REDUCER_ACTION} from '../../../context/SDLReducer'
import {SDLContext} from '../../../context/SDLStore'

export default ({history}) => {

    const {data,dispatch} = useContext(SDLContext)

    var authWindow

    // const handleBtnClick = ()=>{
    //     const win = window.open("", "_black", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");

    //     const hiddenData1 = React.createElement('input',{type:'hidden', name : 'accessId',value : 'asdasdasd'})
    //     const formElement = React.createElement('form',{method:'post',target:'_black',action:'http://192.168.23.97:8080/api/v1/members/check/join"'}, 
    //     [hiddenData1, formElement]);
    //     // formElement.submit()
    //     formElement.dispatchEvent(new Event('submit'))

    //     console.log('handleBtnClick')
    // }

    const callback = useCallback((event) => {

        if ( event.origin.indexOf(process.env.REACT_APP_SDL_API_DOMAIN) !== -1 ) {
            // console.log(event)
            const data = JSON.parse(event.data)

            if(data.code) {
                // 다음 단계
                history.replace({pathname: ACTION.LINK_SIGNUP_FORM, data: data})
                dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})
            }
            else {
                // 중복 안내
                history.replace({pathname: ACTION.LINK_SIGNUP_DUP, mbrId: data.data.mbrId})
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

        dispatch({type: REDUCER_ACTION.OPEN_AUTH_WIN_POP})
    }, [])


    return (

        <div id="wrap">
            <Joining_Header headerTitle='회원가입'/>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <div className="btnWrap">
                                    <button onClick={handleBtnClick} className="btn login default"><strong>휴대폰 본인 인증하기</strong></button>
                                </div>
                            </div>
                        </div>
                        {/* <div className="socialLogin fixedBottom">
                            <ul className="btnWrap">
                                <li>
                                    <a href="#" className="btn icon social btnNaver">네이버로 로그인</a>
                                </li>
                                <li>
                                    <a href="#" className="btn icon social btnKakao">카카오로 로그인</a>
                                </li>
                                <li>
                                    <a href="#" className="btn icon social btnGoogle">구글로 로그인</a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
