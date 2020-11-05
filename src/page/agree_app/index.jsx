import React, { useState, useContext, useRef } from 'react';
import {setAccessId,pushPushToken,getQueryStringParams,getOS} from '../../util/Utils'
import * as API from '../../Api'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import {SDLContext} from '../../context/SDLStore'
import { Link } from 'react-router-dom';
import {SDL_dispatchCloseApp} from '../../appBridge'
import * as ACTION from '../../common/ActionTypes'

/**
 *****MAIN*****
 *  동의 약관
 */
export default ({history,location}) => {

    /** 
     * hook
     */
    const [data, setData]  = useState({
        agreeAll : false,
        agree1 : false,
        agress2 : false,
        canGo : false
    })
    const {dispatch} = useContext(SDLContext)

    const refAgreeAll = useRef()
    const refAgree1 = useRef()
    const refAgree2 = useRef()
    
    let { from } = location.state || { from: { pathname: "/" } };

    // 이벤트 헨들러 (확인 버튼)
    const btnConfirmClick = (e) => {
        
        // os=AN&version=1&token=dsfjkldjflkdj2123123213
        const param = getQueryStringParams(location.state.from.search)
        console.log('os: ' , param.os);
        console.log('version: ' , param.version);
        console.log('token: ' , param.token);

        if(data.agree1 === false){
            alert('위치기반 서비스 약관 동의는 필수입니다.');
            return;
        }

        // 이용약관 동의 누룰시에 
        API.anonymous(param.version,param.os,param.token,refAgree2.current.checked ? 1 : 0)
        .then((data) => {
            // (accessId 생성 => 암호화)
            console.log('resonseData',data.data.accessId);
            setAccessId(data.data.accessId)
            // push(토큰 생성)
            pushPushToken(param.token)
            history.replace(from);
        })
        .catch((err) => {
        })
    }

    // 이벤트 헨들러 (동의)
    const allAgreeChangListener = () => {

        if(refAgreeAll.current.checked){
            setData({allAgree : true, agree1 : true, agree2 : true, canGo : true})
        }else{
            setData({allAgree : false, agree1 : false, agree2 : false, canGo : false})
        }
    }

    // 이벤트 헨들러 (동의 1)
    const agree1ChangListener = () => {

        if(refAgree1.current.checked){
            if(refAgree2.current.checked === true){
                setData({allAgree : true, agree1 : true, agree2 : true, canGo : true})
            }else{
                setData({allAgree : false, agree1 : true, agree2 : false, canGo : true})
            }     
        }else{
            setData({...data, allAgree : false, agree1 : false,  canGo : false})
        }
    }

    // 이벤트 헨들러 (동의 2)
    const agree2ChangListener = () => {
        if(refAgree2.current.checked){
            if(refAgree1.current.checked === true){
                setData({allAgree : true, agree1 : true, agree2 : true, canGo : true})
            }else{
                setData({allAgree : false, agree2 : true, canGo : false})
            }     
        }else{
            if(refAgree1.current.checked === true){
                setData({allAgree : false, agree1 : true, agree2 : false, canGo : true})
            }else{
                setData({allAgree : false, agree1 : false, agree2 : false,  canGo : false})
            }
        }
    }

    // 이벤트 헨들러 (x 버튼)
    const handelCloseBtn = () => {
        dispatch({  type:REDUCER_ACTION.SHOW_CONFIRM, 
            payload:{   data : { title: '알림', desc : '앱을 종료하시겠습니까?'},
                        callback : (res)=>{
                                    if(res === 1){
                                        SDL_dispatchCloseApp()
                                    }else{
                                        dispatch({type : REDUCER_ACTION.HIDE_CONFIRM})
                                    }
                                }
                     }
        })
    }

    return(
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        {getOS !== 'IOS' &&
                            <button onClick={handelCloseBtn} className="icon pageClose">CLOSE</button>
                        }
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">이용약관 동의</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <div className="agreeWelcome normal">
                                    <p className="welcomeMsg">
                                        <strong>아래의 약관에 동의하신 후<br />
                                        슬배생 서비스를 이용해주세요.</strong>
                                    </p>
                                    <div className="welcomeCheck">
                                        <label className="checkSelect">
                                            <input type="checkbox" checked={data.allAgree} onChange={allAgreeChangListener} ref={refAgreeAll}/> <strong className="dCheckBox">전체동의</strong>
                                        </label>
                                    </div>
                                </div>
                                <ul className="agreeList default">
                                    <li>
                                        <span>
                                            <label className="checkSelect">
                                                <input type="checkbox" checked={data.agree1} onChange={agree1ChangListener} ref={refAgree1}/> <span className="dCheckBox">위치 기반 서비스 약관 동의 <span className="importTxt">(필수)</span></span>
                                                {/* <button className="checkDetail">자세히 보기</button> */}                                                
                                            </label>
                                            <Link className="checkDetail" to={{
                                                pathname: ACTION.LINK_SERVICE_TERMS,
                                                idx : 3,
                                                title : '위치기반서비스 이용약관'
                                            }}>자세히 보기</Link>
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            <label className="checkSelect">
                                                <input type="checkbox" checked={data.agree2} onChange={agree2ChangListener} ref={refAgree2}/> <span className="dCheckBox">마케팅 정보 앱 푸시 알림 수신 동의 (선택)</span>
                                                <span className="checkDetail">이벤트 및 혜택 정보를 받아 보실 수 있습니다.</span>
                                            </label>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="fixedBottom">
                        <div className="btnWrap fullWidth">
                            <button className={data.canGo ? "btn login default" : "btn login disable"} onClick={btnConfirmClick} disabled={!data.canGo}><strong>확인</strong></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>   
    )
}

