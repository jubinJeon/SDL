import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import { numberFormat, unescapehtmlcode } from '../../../util/Utils' 
import {SDLContext} from '../../../context/SDLStore'
import {REDUCER_ACTION} from '../../../context/SDLReducer'


const OrderInform = ( {history, location} ) => {

    const {dispatch,data} = useContext(SDLContext)

    const [seconds, setSeconds] = useState(5);
    const timeouts = useRef();
    const [orderData, setOrderData] = useState()

    const handleOnclick = () => {
        
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
        
    }

    useEffect(() => {
        // setOrderData(orderDummyData)
        console.log('order inform location data', location)
        setOrderData(location.state.orderData)

        return () => {
            clearTimeout(timeouts.current)
            timeouts.current = [];
        }
    }, [])

    useEffect(() => {
        
        console.log(orderData)
    }, [orderData])

    useEffect(() => {

        if(data.channel.channelUIType === 'A' ){
            timeouts.current = setTimeout(() => {
                setSeconds(seconds -1);
            }, 1 * 1000);
        }
    })

    useEffect(() => {
        if(seconds === 0) {
            history.replace(ACTION.LINK_ORDER_HISTORY);
            clearTimeout(timeouts.current)
            timeouts.current = [];
            console.log('time out')
        }
    }, [seconds])

    if(orderData === undefined) return <div>로딩중</div>
    
    return ( 
        <>
            <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    
                    <div className="leftArea">
                        <a onClick={handleOnclick} className="icon pageClose">CLOSE</a>
                    </div>
                    
                    <div className="middleArea">
                        <h1 className="headerTitle">{orderData.ordrKindCd.indexOf('9') !== -1 ? '배달' : '픽업'} 주문완료</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="msgBox">
                         <p className={orderData.ordrKindCd.indexOf('9') !== -1 ? "orderComplate" : "orderComplate orderPick" }>
                                <strong>{unescapehtmlcode(orderData.strNm)}</strong><br />
                                매장에서 주문을 <strong>접수중</strong>입니다.
                            </p>
                        </div>
                        
                        {data.channel.channelUIType === 'A' &&
                            <div className="countMsg">
                            <p>
                                주문상태에 대한 확인을 위해<br />
                                <span>{seconds}</span>초 후 주문내역 페이지로 자동 이동합니다.
                            </p>
                        </div>   
                        }
                                         
                        <div className="orderInfoList">
                            <ul className="infoLIst">
                                <li>
                                {orderData.ordrKindCd.indexOf('9') !== -1 ?
                                <>
                                    <strong className="leftCell">배달주소</strong>
                                    <span className="rightCell">
                                        <span>{unescapehtmlcode(orderData.dlAddr)}</span>
                                        <span className="moreInfo">{unescapehtmlcode(orderData.dlAddrDtl)}</span>
                                    </span>
                                </>
                                    :
                                <>
                                    <strong className="leftCell">픽업주소</strong>
                                    <span className="rightCell">
                                        <span>{unescapehtmlcode(orderData.strAddr)}</span>
                                        <span className="moreInfo">{unescapehtmlcode(orderData.strAddrDtl)}</span>
                                    </span>
                                </>
                                }
                                </li>
                                <li>
                                    <strong className="leftCell">주문내역</strong>
                                    { orderData.prdInfo && orderData.prdInfo.map((menu) => {
                                        return (
                                        <React.Fragment key={menu.prdId}>
                                            <span className="rightCell">
                                                <span>{unescapehtmlcode(menu.prdNm)} x {menu.ordrCnt}</span>
                                                <span className="options">
                                                    {menu.option.map((option, index) => {
                                                        return (
                                                        <React.Fragment key={index}>
                                                            {index !== menu.option.length -1  ?
                                                                unescapehtmlcode(option.optPrdNm+', ') : unescapehtmlcode(option.optPrdNm)}
                                                        </React.Fragment>)
                                                    })}
                                                </span>
                                            </span>
                                            <br /><br />
                                        </React.Fragment>)
                                    })}
                                </li>
                                <li>
                                    <strong className="leftCell">결제금액</strong>
                                    <span className="rightCell">
                                        <strong className="amount">
                                            {numberFormat(Number(orderData.payPrc))} 원
                                        </strong>
                                        <span className="moreInfo">
                                            {orderData.ordrKindCd === '2ICP' && "바로결제"}
                                            {orderData.ordrKindCd === '9ICP' && "바로결제"}
                                            {orderData.ordrKindCd === '9ICA' && "만나서 카드 결제"}
                                            {orderData.ordrKindCd === '9ICM' && "만나서 현금 결제"}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <p className="bottomMsg">
                            주문 후, 조리가 시작되면 취소할 수 없습니다.<br />
                            { orderData.ordrKindCd.indexOf('9') == -1 &&
                              '주문 접수가 승인되면 대기번호를 안내해드립니다.' }
                            {/* {orderData.ordrKindCd.indexOf('9') != -1 ? '주문 접수가 되면 배달 소요시간이 안내됩니다.'
                             : '주문 접수가 승인되면 방문 예정 시간을 안내해드립니다.'} */}
                        </p>
                    </div>
                    {data.channel.channelUIType === 'A' &&
                        <div className="fixedBtn">
                            <Link to={{pathname: ACTION.LINK_HOME,state : {from : data.mainLocation}}} className="btn addCart">홈으로</Link>
                            <Link to = {{pathname:ACTION.LINK_ORDER_HISTORY}} className="btn addOrder">주문내역 확인</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
        </>
    );
};

export default OrderInform