
/*global daum*/
import React, { useEffect, useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import { useState } from 'react';
import { pullSearchAddress, pushDefaultAddress, removeSearchAddress } from '../../util/Utils'
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'

/**
 *******MAIN*******
 *      주소
 */
export default ({history,location}) => {

    /** 
     * hook
     */
    const {dispatch,data} = useContext(SDLContext);

    // 이벤트 헨들러
    const handleOnClick = (e) =>{
        e.preventDefault();
        dispatch({type: REDUCER_ACTION.HISTORY_BACK})
        // history.replace(location.state.from)
    }

    return (
            <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={handleOnClick} className="icon pageClose">CLOSE</a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">{location.state.headerTitle}</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="staticTitleView">
                            <div className="locationSearch">
                                <div>
                                    {/* https 적용시 아래 주석 해제 */}
                                    <Link to={{pathname: ACTION.LINK_ADDRESS_SETTING_MAP , type : 1, state : location.state}} replace className="btn icon location">현 위치로 주소 설정</Link>
                                    {/* <Link to={{pathname: ACTION.LINK_ADDRESS_SETTING_MAP , type : 5}} className="btn icon location">현 위치로 주소 설정</Link> */}
                                </div>
                                {/* <div>
                                    <h2 className="titleAddress">주소 검색</h2>
                                    <div>
                                        <span className="textInput">
                                            <input type="text" title="검색" placeholder="예) 판교역로 235, 분당 주공, 삼평동 681" />
                                            <button className="search" type="button">검색</button>
                                        </span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="sectionBlock"></div>
                        
                        <ApiArea history={history} />
                            
                        <div className="sectionBlock"></div>
                        <div className="searchRecently fixed_nav">
                            <h2 className="title">최근 주소</h2>
                            <ul className="recentlyList typeAddress">
                                <SearchAddress history={history}/>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * 컴포넌트 - 주소 찾는 큰화면 이미지 
 * @param {*} param0 
 */
const ApiArea = ({history}) => {
    
    /** 
     * hook
     */
    const location = useLocation()

    /** 
     * hook
     */
    useEffect(() => {
        var element_wrap = document.getElementById('apiArea');
        var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);

        new daum.Postcode({
            oncomplete: function(data) {

                console.log('ApiArea oncomplete',data)
                document.body.scrollTop = currentScroll;
                var addr = ''

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }
                history.replace({pathname:ACTION.LINK_ADDRESS_SETTING_MAP, type: 2 , data: data, state : location.state});
            },
            // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분.
            // iframe을 넣은 element의 높이값을 조정한다.
            onresize : function(size) {
                element_wrap.style.height = size.height+'px';
            },
            width : '100%',
            height : '100%'
        }).embed(element_wrap);

    })
    
    return (
        <>
            {/* <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script> */}
            <div id="apiArea" style={{width:"100%",height:"300px",position:"relative"}}></div>
         </>
    )
}

/**
 * 컴포넌트 - 검색 주소
 * @param {*} param0 
 */
const SearchAddress = ({history}) => {

     /** 
     * hook
     */
    const location = useLocation()
    const [searchAddress, setSearchAddress] = useState([])
    const {dispatch,data} = useContext(SDLContext);

     /** 
     * hook
     */
    useEffect(()=>{
        setSearchAddress(pullSearchAddress)
    }, [])

    if(searchAddress.length === 0) {
        return '최근 지정한 주소가 없어요'
    }

    return(
        <>
        {searchAddress.map((address)=> 
            <li key={address.key}>
                <a onClick={()=> {
                                pushDefaultAddress(address,'KAKAO_API')
                                dispatch({type:REDUCER_ACTION.SAVED_DELIVERY_ADDRESS})
                                history.replace(location.state.from)
                                }
                }>
                    {address.address.address_name} { address.address_detail }
                    {address.road_address && <span className="moreMsg">[도로명] {address.road_address.address_name} {address.address_detail}</span>} 
                </a>
                <button type="button" className="del" onClick={()=>{
                        removeSearchAddress(address.key)
                        setSearchAddress(pullSearchAddress)
                    }}>삭제</button>
            </li>
        )}
        </>
    )
}