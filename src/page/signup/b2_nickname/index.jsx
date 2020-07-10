import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import Joining_Header from '../../../components/HeaderCloser'

export default () => {
    const keyEvent = () =>{
        var _originalSize = window.innerWidth + window.innerHeight;
        window.addEventListener('resize', function(){
            if(window.innerWidth + window.innerHeight != _originalSize){
                document.querySelector(".fixedBottom").classList.add("active");
            }else{
                document.querySelector(".fixedBottom").classList.remove("active");
            }
        });
    }

    return (
        <div id="wrap">
            <Joining_Header headerTitle='닉네임설정'/>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <p className="textMsg">슬배생에서 활동하실 닉네임을 설정해주세요~</p>
                                <ul className="registerList">
                                    <li>
                                        <span className="leftCell">
                                            <label for="register_nic">닉네임</label>
                                        </span>
                                        <span className="rightCell">
                                            <span className="textInput">
                                                <input type="text" id="register_nic" placeholder="2자~10이내로 닉네임을 입력해주세요"/>
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="formInBtn">
                                <div className="btnWrap fullWidth">
                                    <Link to={{pathname: ACTION.LINK_MY_SDL}}>
                                        <button type="submit" className="btn login disable"><strong>완료</strong></button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}