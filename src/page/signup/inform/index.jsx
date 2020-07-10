import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'

import Joining_Header from '../../../components/HeaderCloser'

export default ({history, location}) => {
    return (
        <div id="wrap">
            <Joining_Header headerTitle='중복안내'/>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <p className="findMsg">
                                    안녕하세요~ 회원님!<br />
                                    <strong className="findResult">{location.mbrId}</strong>
                                    이미 회원가입이 되어 있습니다.
                                </p>
                                <div className="btnWrap">
                                        <button onClick={()=>history.replace(ACTION.LINK_LOGIN)} className="btn login default"><strong>로그인 하러가기</strong></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}