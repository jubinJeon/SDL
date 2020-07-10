import React from 'react';
import WrapPage from '../common/WrapPage';
import { Link } from 'react-router-dom';

import * as ACTION from '../common/ActionTypes.jsx'


export default ({history}) => {

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    return(
    <WrapPage>
    <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a  onClick={handleOnClick} className="icon pageBack">Back</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">My슬배생</h1>
                </div>
                <div className="rightArea">
                    <Link to={{pathname: ACTION.LINK_SETTING}} className="icon setting">
                        설정
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
                            <li>
                                <a href="#" className="listLine">리뷰 관리</a>
                            </li>
                            <li>
                                <a href="#" className="listLine">공지사항</a>
                            </li>
                            <li>
                                <a href="#" className="listLine">FAQ </a>
                            </li>
                            <li>
                                <a href="#" className="listLine">고객센터</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div id="nav">
            <div>
            <ul className="navList">
                <li className="home">
                    <Link to={{pathname: ACTION.LINK_HOME}}>홈</Link>
                </li>
                <li className="map">
                    <Link to={{pathname: ACTION.LINK_AROUND_MAP}}>주변지도</Link>
                </li>
                <li className="myPage active">
                    <Link to={{pathname: ACTION.LINK_MY_SDL}}>my슬배생</Link>
                </li>
                <li className="myOrder">
                    <Link to={{pathname: ACTION.LINK_ORDER_HISTORY}}>주문내역</Link>
                </li>
                <li className="myLike">
                    <Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link>
                </li>
            </ul>
            </div>
        </div>
    </div>
    </WrapPage>
    );
}
