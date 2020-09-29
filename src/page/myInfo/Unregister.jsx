import React, {useEffect, useState, useRef, useContext} from 'react';
import { Link, useHistory } from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import useAsync from '../../hook/useAcync'
import * as API from '../../Api'

import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import Alert from '../popup/Alert'
import FooterNavgation from '../../components/FooterNavgation';

const Container = ()=>{
    
    // 회원 정보 요청
    const [state, refech] = useAsync(
        API.getMemberInfo
    )

    const { loading, data, error } = state;

    return(
        <>
            <Header/>
            <Content loading = {loading} memberData = {data} error = {error}/>
            <FooterNavgation/>
        </>
    )
}
const Header = ()=>{

    const {dispatch} = useContext(SDLContext);

    const onClickBackBtn = (e) => {
        e.preventDefault();
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    };

    return(
        <>
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={onClickBackBtn} className="icon pageClose"></a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">회원탈퇴</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

const Content = ({loading,memberData,error})=>{

    const {dispatch, data} = useContext(SDLContext);
    const history = useHistory()

    // sns 회원 여부
    const [isSns, setIsSns] = useState(false)
    const [mbrId, setMbrId] = useState("")
    

    const toastCallback = (data) => {
        data.dispatch({type : REDUCER_ACTION.HIDE_TOAST})
    }

    const idRef = useRef()
    const checkRef = useRef()
    const [active, setActive] = useState(false)

    // 팝업
    const [modal, setModal] = useState({
        showModal: false,
        dataModal: {
            type: "",
            title: "",
            desc: "",
            handleComfirm: ''
        }
    })

    const onClickBackBtn = (e) => {
        e.preventDefault();
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    };

    const handleClickOpen = (data) => {
        setModal({
            showModal: true,
            dataModal: data
        })
    };

    const handleClose_modal = () => {
        setModal({ ...modal, showModal: false });
    };

    const onHandleChange = () => {
        if(!isSns && idRef.current.value !== '' && checkRef.current.checked || isSns && checkRef.current.checked) {
            setActive(true)
        }else{
            setActive(false)
        } 
    }

    useEffect(() => {
        
        if( !loading && memberData!= null && memberData.code ) {
            if(memberData.data.mbrAuthChnlCd !== "SDL") {
                // SNS 회원
                setIsSns(true)
            }
            else
                // 일반 가입 회원
                setIsSns(false)
            setMbrId(memberData.data.mbrId)
        }
    }, [loading,memberData,error])

    const doUnregister = () => {

        if(!isSns && idRef.current.value === '') 
            return ;
        else if( !checkRef.current.checked) return ;
        else if( !isSns && idRef.current.value !== memberData.data.mbrId ) {
            dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '이메일 주소가 잘못되었습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }
        else if( !checkRef.current.checked ) {
            dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '회원 탈퇴 동의에 체크해야 합니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
            return ;
        }

        // 제로페이 상품권 확인
        API.getZeroPayBalance()
        .then((res) => {

            // 잔고 있는 경우 제로페이 화면 안내
            if(res.data.returnCode === "1") {
                handleClickOpen({
                    type: 'ALERT_CONFIRM',
                    desc: '보유하신 제로페이 상품권을\n\r모두 사용하셔야 탈퇴 가능합니다.',
                    handleComfirm: (() => {
                        history.push(ACTION.LINK_ZERO_PAY)
                    })
                })
                return ;
            }
            else if(res.data.returnCode === "0" /* 잔고 없음 */ || res.data.returnCode === "2"/* 비회원 */ ) {
                
                handleClickOpen({
                    type: 'CONFIRM',
                    desc : '정말 회원탈퇴를 하시겠습니까?',
                    handleComfirm: (()=> {

                        // 슬배생 회원 탈퇴
                        API.unregister(mbrId)
                        .then((res) => {
                            if(res.code) {
                                handleClose_modal()

                                handleClickOpen({
                                    type: 'ALERT_CONFIRM',
                                    desc: '회원탈퇴가 완료되었습니다. 그동안 슬배생을 이용해 주셔서 감사합니다.',
                                    handleComfirm: (() => {
                                        history.replace({pathname:ACTION.LINK_HOME, state : {from : data.mainLocation}})
                                    })
                                })
                            }
                        })
                        .catch((err) => { 
                            dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '슬배생 회원탈퇴 실패.', code : '', dispatch : dispatch} , callback : toastCallback}})
                        })
                
                    })
                })
            }

        })
    }

    if(loading){
        return (
            <>
                <div className="pageLoding">
                    <div className="stateWrap">
                        <div className='loading'>로딩중..</div>
                    </div>
                </div>
            </>
        )
    }

    if(error){
        return <></>
    }

    if(memberData === null){
        return <></>
    }

    return(
        <>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <div className="secessionBox">
                                    <p className="title"><strong>탈퇴 시<br />꼭 확인하세요.</strong></p>
                                    <ul className="listBox">
                                        <li>슬배생 회원정보는 삭제되며, 삭제된 데이터는 복구되지 않습니다. 거래내역에 대한 기본 정보는 탈퇴 후 5년간 보관합니다. </li>
                                        <li>탈퇴 후 재가입할 경우 탈퇴 전의 주문내역, 찜등의 정보가 모두 삭제되며 복구되지 않습니다.</li>
                                        <li>탈퇴 후 리뷰 삭제 불가합니다.</li>
                                        <li>제로페이 상품권을 구매하신 회원은 상품권을 모두 사용하셔야 탈퇴가 가능합니다.</li>
                                        <li>제로페이 상품권은 구매 후 7일 이내에 환불이 가능하오니 확인해주시기 바랍니다.</li>
                                    </ul>
                                    <p className="formTitle"><strong>회원정보 확인</strong></p>
                                    { !isSns && <ul className="formList">
                                        <li>
                                            <label className="textInput">
                                                <input ref={idRef} onChange={onHandleChange} type="email" title="이메일" placeholder="이메일 주소를 입력하세요" />
                                            </label>  
                                        </li>
                                    </ul> }
                                    <p className="formCheck">
                                        <label className="checkSelect">
                                            <input ref={checkRef} onChange={onHandleChange} type="checkbox"/> <span className="dCheckBox">위 내용을 확인하였으며, 회원탈퇴에 동의합니다.</span>
                                        </label>
                                    </p>
                                </div>
                                <div className="btnWrap">
                                    <ul className="btnInner">
                                        <li><button onClick={onClickBackBtn} className="btn login default"><strong>취소</strong></button></li>
                                        <li>
                                            <button className={active? "btn login apply" : "btn login disable"} type="button" 
                                                        onClick={() => { doUnregister()}}><strong>회원탈퇴하기</strong>
                                            </button>
                                        </li>
                                    </ul> 
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Alert open={modal.showModal} data={modal.dataModal} handleClose={handleClose_modal}></Alert>
        </>
    )
}

export default Container


