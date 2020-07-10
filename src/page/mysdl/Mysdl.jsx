import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import useAsync from '../../hook/useAcync'
import * as API from '../../Api'
import {SDLContext} from '../../context/SDLStore'

export default ({location}) => {

    const {dispatch} = useContext(SDLContext);

    // 토스트 팝업
    const [toastMsg, setToastMsg] = useState('')
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        if(location.popupTxt != undefined) {
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: location.popupTxt, code : '', dispatch : dispatch} , callback : toastCallback}})
        }
    }, [])
    
    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    const handleClick = () => {
        // setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };
     
    // 회원 정보 요청
    const [state, refech] = useAsync(
        API.getMemberInfo
    )
    const { loading, data, error } = state;

    // 회원 여부
    const [isMember, setIsMember] = useState(false)

    useEffect(() => {
        
        // 회원
        if( !loading && data!= null && data.code ) {
            // console.log(state)
            // console.log(data)
            setIsMember(true)
        }
        // 비회원
        else {
            setIsMember(false)
        }
    }, [state])

    if(loading) return (
        <>
            <div className="pageLoding">
                <div className="stateWrap">
                    <div className='loading'>로딩중..</div>
                </div>
            </div>
        </>
    );

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="middleArea">
                        <h1 className="headerTitle">My슬배생</h1>
                    </div>
                    <div className="rightArea">
                    <Link to={{pathname: ACTION.LINK_SETTING, isMember:isMember}} className="icon setting">
                        설정
                    </Link>
                </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">

                        { !loading && isMember ? 
                        <div className="pageToplView">
                            <div className="userInfo">
                                <Link to={ACTION.LINK_MYINFO}>
                                    <span className="userProfile"></span>
                                    <strong className="username">{data.data.mbrNick}</strong>
                                </Link>
                            </div>
                        </div>
                        :
                        <div className="pageToplView">
                            <div>
                                {/* <h1 className="logo">
                                    슬기로운 배달 생활 슬배생
                                </h1>   */}
                                <p className="logoInfo">로그인 하고 다양한 혜택을 받아보세요</p>
                                <div className="btnWrap typeFlex">
                                    <ul className="btnArea">
                                        <li>
                                            <Link to={{pathname: ACTION.LINK_LOGIN}} className="btn login apply">
                                                <strong>로그인</strong>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={{pathname: ACTION.LINK_SIGNUP_AGREE}} className="btn register defaultLine">
                                                <strong>회원가입</strong>
                                            </Link>
                                        </li>
                                    </ul>
                                </div> 
                            </div>
                        </div>
                        }


                        <div className="sectionBlock"></div>
                        <div className="arrowList">
                            <ul>
                                {/* { isMember &&
                                    <li>
                                        <Link to={{pathname: ACTION.LINK_REVIEW}} className="listLine">리뷰 관리</Link>
                                    </li>
                                }   */}
                                <li>
                                    <Link to={{pathname: ACTION.LINK_NOTICE_LIST}} className="listLine">공지사항</Link>
                                </li>
                                <li>
                                    <Link to={{pathname: ACTION.LINK_FAQ}} className="listLine">FAQ</Link>
                                </li>
                                <li>
                                    <Link to={{pathname: ACTION.LINK_CS}} className="listLine">고객센터</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* <FooterNav screenFocus="myPage"/> */}
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