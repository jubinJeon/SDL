import React, {useContext} from 'react';
import * as ACTION from '../../../common/ActionTypes'
import {Link} from 'react-router-dom';

import * as API from '../../../Api'
import {SDLContext} from '../../../context/SDLStore'


export default ({location, history}) => {
    
    const {dispatch} = useContext(SDLContext)

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack();
    };
      
    const toastCallback = (data) => {
        console.log('toastCallback', data)
        data.dispatch({type : 'TOAST', payload : {show : false }})
        history.push({pathname : ACTION.LINK_MYPAGE})
    }

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a href="#" onClick={onClickBackBtn} className="icon pageClose">CLOSE</a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">배너 전체보기</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="bannerWrap">
                            <ul className="bannerList">
                                <li>
                                    <Link to={{
                                        pathname : ACTION.LINK_BANNER_DETAIL,
                                        img: "/common/images/banner/img_tump_banner_0625_1_full.png",
                                        imgLink: ACTION.LINK_ZERO_PAY,
                                        imgOnClickfunc: function () {
                                            API.getUserJoinStatus()
                                            .then((res) => {
                                                if(Number(res.data.isSdlMember ) !== 1){
                                                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: '로그인이 필요합니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                                                    
                                                }else{
                                                    history.push({pathname : ACTION.LINK_ZERO_PAY})
                                                }
                                            })
                                        }
                                    }}>
                                        <img src="/common/images/banner/img_tump_banner_0625_1.png" alt="이벤트" />
                                    </Link>
                                </li>
                                <li>
                                    <img src="/common/images/banner/img_tump_banner_0625_2.png" alt="이벤트" />
                                </li>
                                <li>
                                    <img src="/common/images/banner/img_tump_banner_0625_3.png" alt="이벤트" />
                                </li>
                                <li>
                                    <img src="/common/images/banner/img_tump_banner_0625_4.png" alt="이벤트" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
