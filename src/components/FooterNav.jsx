import React from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../common/ActionTypes'

const FooterNav = (props) => {
    return (
        <div id="nav">
            <div>
                <ul className="navList">
                    <li className={footerNavFocus("home", props.screenFocus)} id="home">
                        <Link to={{pathname: ACTION.LINK_HOME}}>홈</Link>
                    </li>
                
                
                    <li className={footerNavFocus("map", props.screenFocus)} id="map">
                        <Link to={{pathname: ACTION.LINK_AROUND_MAP}}>주변지도</Link>
                    </li>
                
                
                    <li className={footerNavFocus("myPage", props.screenFocus)} id="myPage">
                        <Link to={{pathname: ACTION.LINK_MY_SDL}}>my슬배생</Link>
                    </li>
                
                
                    <li className={footerNavFocus("myOrder", props.screenFocus)} id="myOrder">
                        <Link to={{pathname: ACTION.LINK_ORDER_HISTORY}}>주문내역</Link>
                    </li>
                
                    <li className={footerNavFocus("myLike", props.screenFocus)} id="myLike">
                        <Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link>
                    </li>
                </ul>
            </div>
        </div>
    )

    function footerNavFocus(id, focus) {
        if(id === focus) {
            return id + " active"
        }
        else {
            return id
        }
    }
}

export default FooterNav