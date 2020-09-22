import React,{useContext} from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as ACTION from '../common/ActionTypes'
import {SDLContext} from '../context/SDLStore'

const FooterNavgation = ()=>{

    const location = useLocation()
    const {data} = useContext(SDLContext)

    return(
        <>
            {
                data.channel.channelUIType === 'A' && 
                <div id="nav">
                    <div>
                        <ul className="navList">
                            <li className={ACTION.LINK_HOME === location.pathname ? "home active" : "home"} >
                                <Link to={{pathname: ACTION.LINK_HOME, state : {from : data.mainLocation}}}>홈</Link>
                            </li>
                            <li className={ACTION.LINK_AROUND_MAP === location.pathname ? "map active" : "map"}>
                                <Link to={{pathname: ACTION.LINK_AROUND_MAP}}>주변지도</Link>
                            </li>
                            <li className={
                                ACTION.LINK_MY_SDL === location.pathname || 
                                ACTION.LINK_SETTING === location.pathname ||
                                ACTION.LINK_PWD_RESET === location.pathname ||
                                ACTION.LINK_MYINFO === location.pathname ||
                                ACTION.LINK_UNREGISTER === location.pathname ? "myPage active" : "myPage"}>
                                <Link to={{pathname: ACTION.LINK_MY_SDL}}>my슬배생</Link>
                            </li>
                            <li className={
                                ACTION.LINK_ORDER_HISTORY === location.pathname ||
                                ACTION.LINK_ORDER_DETAIL === location.pathname  ? "myOrder active" : "myOrder"}>
                                <Link to={{pathname: ACTION.LINK_ORDER_HISTORY}}>주문내역</Link>
                            </li>
                            <li className={ACTION.LINK_MY_JJIM === location.pathname ? "myLike active" : "myLike"}>
                                <Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default FooterNavgation