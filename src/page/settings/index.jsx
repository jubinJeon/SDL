import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import useAsync from '../../hook/useAcync'
import * as API from '../../Api'

export default ({history, location}) => {

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    // 회원 여부
    const [isMember, setIsMember] = useState(false)

    // 설정 정보 조회
    const [state, refetch] = useAsync(API.userSettings, [])
    const { loading, error, data } = state

    const [keeplogedin, setKeep] = useState(false)
    const [agreePush, setAgree] = useState(false)

    const setlogedStatus = (e) => {
        setKeep(e.target.checked)
        console.log(e.target.checked)
        API.keepLogin(e.target.checked ? 1 : 0)
        .then((data) => {
            console.log(data)
        })
    }

    const setAgreePush = (e) => {
        setAgree(e.target.checked)
        console.log(e.target.checked)
        API.agreePush(e.target.checked ? 1 : 0)
        .then((data) => {
            console.log(data)
        })
    }

    useEffect(() => {
        if(!loading && data) {
            console.log(data.data)
            var keep = data.data.isKeepLogin === 0 ? false : true
            setKeep(keep)

            var agree = data.data.adPushFg === 0 ? false : true
            setAgree(agree)

            // 회원 여부 조회(for 로그인 유지 show/hide)
            API.getMemberInfo()
            .then((data) => {
                    console.log(data)
                    setIsMember(true)
            })
            .catch((err) => {
                if(err.response.status == 403) {
                    setIsMember(false)
                }
                else {
                    console.log(err.response)
                }
            })

            
        }
    }, [state])


    if (loading) return (
        <div className="">
            <div className="stateWrap">
                <div className="loading">로딩중..</div>
            </div>
        </div>
    )
    else if (error) return (
        <div className="">
            <div className="stateWrap">
                <div className="error">에러가 발생했습니다</div>
            </div>
        </div>
    )

    return (
    
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={handleOnClick} className="icon pageBack">Back</a>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">설정</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="pageToplView">
                            <ul className="settingList">
                                { isMember && 
                                <li>
                                    <span>로그인 유지</span>
                                    <label className="checkToggle">
                                        <input onChange={e=>setlogedStatus(e)} checked={keeplogedin} type="checkbox" title="로그인 유지" />
                                        <span className="slider"></span>
                                    </label>
                                </li> }
                                <li>
                                    <span>푸시 알림 동의</span>
                                    <label className="checkToggle" title="푸시 알림 동의">
                                        <input onChange={e=>setAgreePush(e)} checked={agreePush} type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="sectionBlock"></div>
                        <div className="arrowList">
                            <ul>
                                <li>
                                    {console.log(ACTION.LINK_SERVICE_TERMS)}
                                    <Link to={{pathname: ACTION.LINK_SERVICE_TERMS}} className="listLine">
                                        서비스 약관
                                    </Link>
                                </li>
                                <li>
                                    <a className="listLine">오픈소스 라이선스 </a>
                                </li>
                                <li className="msgBlock">
                                    <span className="msgTxt">
                                        현재 버전 1.1.1.0
                                        <span className="moreMsg">현재 최신 버전입니다.</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="nav">
                <div>
                    <ul className="navList">
                        <li className="home"><Link to={{pathname: ACTION.LINK_HOME}}>홈</Link></li>
                        <li className="map"><Link to={{pathname: ACTION.LINK_AROUND_MAP}}>주변지도</Link></li>
                        <li className="myPage active"><Link to={{pathname: ACTION.LINK_MY_SDL}}>my슬배생</Link></li>
                        <li className="myOrder"><Link to={{pathname: ACTION.LINK_ORDER_HISTORY}}>주문내역</Link></li>
                        <li className="myLike"><Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};