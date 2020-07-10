import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../common/ActionTypes.jsx'
import FooterNav from '../common/FooterNav'

const LoginAftre = () => {

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="middleArea">
                        <h1 className="headerTitle">My슬배생</h1>
                    </div>
                    <div className="rightArea">
                    <Link to={{pathname: ACTION.LINK_SETTING}}>
                        <a className="icon setting">설정</a>
                    </Link>
                </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="pageToplView">
                            <div className="userInfo">
                                <a href="#">
                                    <span className="userProfile"></span>
                                    <strong className="username">달려라 하니님</strong>
                                </a>
                            </div>
                        </div>
                        <div className="sectionBlock"></div>
                        <div className="arrowList">
                            <ul>
                                <Link to={{pathname: ACTION.LINK_REVIEW}}>
                                    <li>
                                        <a href="#" className="listLine">리뷰 관리</a>
                                    </li></Link>
                                <Link to={{pathname: ACTION.LINK_NOTICE_LIST}}>
                                    <li>
                                        <a href="#" className="listLine">공지사항</a>
                                    </li></Link>
                                <Link to={{pathname: ACTION.LINK_FAQ}}>
                                    <li>
                                        <a href="#" className="listLine">FAQ </a>
                                    </li></Link>
                                <Link to={{pathname: ACTION.LINK_CS}}>
                                    <li>
                                        <a href="#" className="listLine">고객센터</a>
                                    </li></Link>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* <FooterNav screenFocus="myPage"/> */}
        </div>
    )
}

export default LoginAftre