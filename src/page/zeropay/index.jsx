import React , {useEffect, useRef, useContext} from 'react';
import { Link , useHistory, useLocation} from 'react-router-dom';
import {SDLContext} from '../../context/SDLStore'
import * as API from '../../Api'
import * as ACTION from '../../common/ActionTypes'
import * as AppBridge from '../../appBridge'
import {REDUCER_ACTION} from '../../context/SDLReducer'


const ZeroPay = ({history}) => {

    const {dispatch,data} = useContext(SDLContext)

    const refInput = useRef()
    const refForm = useRef()

    const callback = (event) => {
        
        if (event.origin === process.env.REACT_APP_SDL_ZEROPAY_JOIN_SETTING){
            
            if(event.detail.type === 'CLOSE_WINDOW_POP_UP'){
                dispatch({type: REDUCER_ACTION.CLOSE_WIN_POP})
            }
            
        }
    }

    const postCallback = (event) =>{
        event.preventDefault()
        if (event.origin === process.env.REACT_APP_SDL_API_DOMAIN){
            console.log('postCallback event',event.origin)
            dispatch({type: REDUCER_ACTION.CLOSE_WIN_POP})
            dispatch({type : 'HISTORY', payload : { action : '' , enable : true }})
        }
        
    }

    useEffect(()=>{
        console.log('add message event ')
        console.log('data',data)
        // window.addEventListener("SDL_nativeEvent", callback, false);
        window.addEventListener("message", postCallback, false);

        return () => {
            console.log('remove message event ')
            // window.removeEventListener("SDL_nativeEvent", callback, false);
            window.addEventListener("message", postCallback, false);
        }
    },[])


    const handleOnClick = (e) =>{
        e.preventDefault();
        // dispatch({type : 'HISTORY', payload : {action : 'BACK', enable : true }})
        history.push(ACTION.LINK_HOME)
    }

    /**
     * 체크페이 회원 정보 조회
     */
    const getCheckPayInfo = ()=>{

        const queryString = 
                `ID=${data.zeropay.ID}&`+
                `RQ_DTIME=${data.zeropay.RQ_DTIME}&`+
                `TNO=${data.zeropay.TNO}&`+
                `EV=${data.zeropay.SEARCH_EV}&`+
                `VV=${data.zeropay.SEARCH_VV}&`+
                `EM=${data.zeropay.EM}&`+
                `VM=${data.zeropay.VM}`
        API.getCheckPayInfo(queryString)
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    

    /**
     * 체크페이 설정화면으로 진입
     * @param {*} e 
     */
    const handleAccountManageBtn = (e)=>{

        API.getUserJoinStatus()
        .then((res) => {

            if(Number(res.data.isSdlMember) === 1 ){

                API.getDataForCheckpayjoin(process.env.REACT_APP_SDL_API_DOMAIN)
                .then((res)=>{
                    const url = process.env.REACT_APP_SDL_API_DOMAIN + '/api/v1/checkpay/forward/join' + 
                                `?ID=${res.data.ID}&`+
                                `RQ_DTIME=${res.data.RQ_DTIME}&`+
                                `TNO=${res.data.TNO}&`+
                                `EV=${res.data.EV_APP  }&`+
                                `VV=${res.data.VV_APP  }&`+
                                `EM=${res.data.EM}&`+
                                `VM=${res.data.VM}`

                    dispatch({type : REDUCER_ACTION.HIDE_ALERT})
                    dispatch({type: REDUCER_ACTION.OPEN_CHECK_PAY_MANAGE_POP , payload : {checkPayUrl : url}})
                })
                .catch((err)=>{
                    console.log('API.getDataForCheckpayjoin error!!!', err)
                })
                
            }
        })
        .catch((err)=>{
            console.log('API.getUserJoinStatus error!!!', err)
        })
    }


    const handleZoroPayBtn = ()=>{

        API.getUserJoinStatus()
        .then((res) => {

            let isSdlMember = Number(res.data.isSdlMember)
            let isCheckPayMember = Number(res.data.isCheckPayMember)
            let isZeroPayMember = Number(res.data.isZeroPayMember)
            let isAcctReg = Number(res.data.isAcctReg)

            
            // 체크페이 미가입 제로페이 미가입 상태인 경우
            // 체크 페이 가입 후 제로페이로 리턴하여 가입
            if(isSdlMember === 1 && isCheckPayMember === 0){
                
                dispatch({
                    type: REDUCER_ACTION.SHOW_ALERT, 
                    payload : {data : {title: '알림' , desc : '제로페이 미가입상태입니다. 회원가입으로 이동합니다.', code : 100},
                    callback : () => {
                        API.getDataForCheckpayjoin(process.env.REACT_APP_SDL_API_DOMAIN)
                        .then((res)=>{
                            const url = process.env.REACT_APP_SDL_API_DOMAIN + '/api/v1/checkpay/forward/join' + 
                                        `?ID=${res.data.ID}&`+
                                        `RQ_DTIME=${res.data.RQ_DTIME}&`+
                                        `TNO=${res.data.TNO}&`+
                                        `EV=${res.data.EV_APP  }&`+
                                        `VV=${res.data.VV_APP  }&`+
                                        `EM=${res.data.EM}&`+
                                        `VM=${res.data.VM}`

                            dispatch({type : REDUCER_ACTION.HIDE_ALERT})
                            dispatch({type: REDUCER_ACTION.OPEN_CHECK_PAY_MANAGE_POP , payload : {checkPayUrl : url}})
                        })
                        .catch((err)=>{
                            console.log('API.getDataForCheckpayjoin error!!!', err)
                        })
                    }
                }})
                return;
            }

            // 체크페이 계좌 미등록시
            if(isSdlMember === 1 && isCheckPayMember === 1 && isAcctReg === 0){

                dispatch({
                    type: REDUCER_ACTION.SHOW_ALERT, 
                    payload : {data : {title: '알림' , desc : '결제를 위하여 계좌등록 페이지로 이동합니다.', code : 100},
                    callback : () => {
                        API.getDataForCheckpayjoin(process.env.REACT_APP_SDL_API_DOMAIN)
                        .then((res)=>{
                            const url = process.env.REACT_APP_SDL_API_DOMAIN + '/api/v1/checkpay/forward/join' + 
                                        `?ID=${res.data.ID}&`+
                                        `RQ_DTIME=${res.data.RQ_DTIME}&`+
                                        `TNO=${res.data.TNO}&`+
                                        `EV=${res.data.EV_APP  }&`+
                                        `VV=${res.data.VV_APP  }&`+
                                        `EM=${res.data.EM}&`+
                                        `VM=${res.data.VM}`

                            dispatch({type : REDUCER_ACTION.HIDE_ALERT})
                            dispatch({type: REDUCER_ACTION.OPEN_CHECK_PAY_MANAGE_POP , payload : {checkPayUrl : url}})
                        })
                        .catch((err)=>{
                            console.log('API.getDataForCheckpayjoin error!!!', err)
                        })
                    }
                }})
                return;
            }

            // 제로페이 회원 미가입시
            if(isSdlMember === 1 && isCheckPayMember === 1 && isAcctReg === 1 && isZeroPayMember === 0){

                API.getDataForZeropayJoin()
                .then((res)=>{
                    const param = {
                        url : process.env.REACT_APP_SDL_ZEROPAY_SIGNUP,
                        saleChannel : res.data.saleChannel,
                        unm  : res.data.unm ,
                        mobile  : res.data.mobile ,
                        ci : res.data.ci ,
                        birthDate  : res.data.birthDate ,
                        sexCode  : res.data.sexCode  ,
                        sdlApiUrl : process.env.REACT_APP_SDL_API_DOMAIN
                    }
            
                    AppBridge.SDL_dispatchZeropay(JSON.stringify(param))
                })
                .catch((err)=>{
                    console.log('API.getDataForZeropayJoin error!!!', err)
                })
                return;
            }

            if(isSdlMember === 1 && isCheckPayMember === 1 && isZeroPayMember === 1){

                API.getDataForZeropayMain()
                .then((res)=>{
                    const param = {
                        url : process.env.REACT_APP_SDL_ZEROPAY_POINT,
                        saleChannel : res.data.saleChannel,
                        userNo : res.data.userNo ,
                        zpphash : res.data.zpphash ,
                        auth : res.data.authorization ,
                        sdlApiUrl : process.env.REACT_APP_SDL_API_DOMAIN
                    }
            
                    AppBridge.SDL_dispatchZeropay(JSON.stringify(param))
                })
                .catch((err)=>{
                    console.log('API.getDataForZeropayMain error!!!', err)
                })
                return;
            }
            
        
        })
        .catch((err)=>{
            console.log('API.getUserJoinStatus error!!!', err)
        })
        
    }

    const handleZeroPayStore = () => {
        dispatch({type: REDUCER_ACTION.OPEN_FIND_ZERO_PAY_WIN_POP})
    }

    const handleZeroPaySubsidy = () => {
        dispatch({type: REDUCER_ACTION.OPEN_ZERO_PAY_SUBSIDY})
    }

    return(
        <>
            <div id="wrap">
                <div id="header">
                    <div className="headerTop">
                        <div className="leftArea">
                            <a href="#" onClick={handleOnClick} className="icon pageClose">CLOSE</a>
                        </div>
                        <div className="middleArea">
                            <h1 className="headerTitle">제로페이</h1>
                        </div>
                        {/* <div className="rightArea">
                            <a className="icon setting" >
                                설정
                            </a>
                        </div> */}
                    </div>
                </div>
                <div id="container">
                    <div id="content">
                        <div className="fullHeight">
                            <div className="zeroInfo">
                                <img src="../common/images/bg_zero_pay_info.jpg" alt="" />
                                <p className="infoMsg">
                                    <strong>
                                        온누리상품권,<br />
                                        지역상품권 구매하고<br />
                                        결제하세요
                                    </strong>
                                </p>
                            </div>
                            <div className="gridWrap">
                                <div className="gridRow row_01">
                                    <div className="tailRow">
                                        <a className="tail_01" onClick={handleZoroPayBtn}>
                                            <p><span className="iconZeroPay">제로페이</span><br />모바일 상품권</p>
                                        </a>
                                    </div>
                                </div>
                                <div className="gridRow row_02">
                                    <div className="tailRow">
                                        <a  className="tail_02" onClick={handleZeroPayStore}>
                                            <p><span className="iconZeroPay">제로페이</span> 가맹점 찾기</p>
                                        </a>
                                    </div>
                                    <div className="tailRow">
                                        <a className="tail_03" onClick={handleAccountManageBtn}>
                                            <p><span className="iconZeroPay" >제로페이</span> 계좌관리</p>
                                        </a>
                                    </div>
                                </div>
                                <div className="gridRow row_banner">
                                    <a onClick={handleZeroPaySubsidy} >
                                        <img src="/common/images/bg_zero_pay_banner.png" alt="긴급재난지원금" />
                                    </a>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <form name = 'post' method='post'  target='_blan' action={process.env.REACT_APP_SDL_ZEROPAY_JOIN_SETTING} ref={refForm}>
                    <input type='hidden' value='' name='sId' ref = {refInput}></input>
                </form>
            </div>
        </>
    );
}

export default ZeroPay