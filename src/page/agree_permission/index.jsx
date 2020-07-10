import React from 'react';
import {setDidNoticeAppPermision} from '../../util/Utils'
import * as AppBridge from '../../appBridge'
import { useEffect } from 'react';


export default ({history,location}) => {

    let { from } = location.state || { from: { pathname: "/" } };

    const callback = (event)=>{

        console.log(event)
        setDidNoticeAppPermision();
        history.replace(from);

    }

    useEffect(()=>{

        console.log('addEventListener SDL_dispatchStartPermission')
        window.addEventListener('SDL_dispatchStartPermission',callback,false)

        return() => {
            console.log('addEventListener SDL_dispatchStartPermission')
            window.removeEventListener('SDL_dispatchStartPermission',callback,false)
        }

    },[])

    const btnConfirmClick = () => {
        
        AppBridge.SDL_dispatchStartPermission();
        
    }

    return(
        <>
            <div className="popWrap typeDimmed active">
                <div className="popInner">
                    <div className="popBody">
                        <div className="agreeRole">
                            <p className="desc">
                                편리한 슬배생 이용을 위해 <br />
                                아래의 접근 권한을 요청 드립니다.
                            </p>
                            <div className="needInfoBox">
                                <ul>
                                    <li className="info_1">
                                        <span>위치정보(필수)</span>
                                        <span className="moreInfo">현재 위치 및 휴게소 위치정보 수신</span>
                                    </li>
                                    <li className="info_2">
                                        <span>전화(필수)</span>
                                        <span className="moreInfo">매장 전화 연결</span>
                                    </li>
                                    <li className="info_3">
                                        <span>저장공간 (필수)</span>
                                        <span className="moreInfo">사진 리뷰 저장</span>
                                    </li>
                                    <li className="info_4">
                                        <span>사진/카메라(필수)</span>
                                        <span className="moreInfo">사진 리뷰 사진 첨부 및 QR코드 스캔 </span>
                                    </li>
                                </ul>
                            </div>
                            <ul className="moreInfo">
                                <li>안드로이드 마시멜로 6.0 이상 사용자</li>
                                <li>휴대폰 ‘설정>슬배생＇에서도 접근 권한을 변경하실 수 있습니다.</li>
                            </ul>
                            <div className="btnWrap">
                                <button onClick={btnConfirmClick} className="btn login apply">확인</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



