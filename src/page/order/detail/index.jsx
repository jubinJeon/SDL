import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import {SDL_dispatchCallPhone} from '../../../appBridge'

import {SDLContext} from '../../../context/SDLStore'
import useAsync from '../../../hook/useAcync';
import { unescapehtmlcode, numberFormat } from '../../../util/Utils'

// dummy data from API server

export const orderInfo = {
    userYN: "N",
    DP: "픽업",
    marketInfo: {
                marketName: "카페 드롭탑 신도림점",
                marketAddr: "서울시 영등포구 영등포로 143"
                },
    userAddr: "서울시 구로구 구로동 3-25 신도림테크노마트",
    userPhone: "01098765432",
    menus: [
            {menuName: "블랙밀크티",
            amount: 2,
            options: ["펄 기본", "밀크폼 추가"],
            price: 5600
            },
            {menuName: "민트초코라떼",
            amount: 1,
            options: ["휘핑크림"],
            price: 4900
            }
            ],
    delivTip: 2500,
    discounts: [
                {
                    discountName: "추가 할인",
                    discountAmount: 500
                },
                {
                    discountName: "또 할인",
                    discountAmount: 1000
                }
            ],
}

export default ( {location, history} ) => {
    const {data, dispatch} = useContext(SDLContext)
    const contextData = data

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.replace(ACTION.LINK_ORDER_HISTORY)
    };

    const [state, refetch] = useAsync(() => API.orderHistoryDetail(
        contextData.recentOrderHistory.ordrId, contextData.recentOrderHistory.bizCtgDtl), [])
    const {loading, error} = state
    const [order, setOrder] = useState()

    useEffect(() => {
        if( !loading && state.data) {
            console.log(state.data.data)
            setOrder(state.data.data)
        }

        // console.log(contextData)
    }, [state, data])

    if (loading) return (
    <div className="">
        <div className="stateWrap">
            <div className="loading">로딩중..</div>
        </div>
    </div>
    )
    else if (error) return (
        <div className="">
            <div className="stateWrap">
                <div className="error">에러가 발생했습니다</div>
            </div>
        </div>
    )
    else if(!order) return <>
        <div className="">
            <div className="stateWrap">
                <div className="loading">로딩중..</div>
            </div>
        </div>
    </>

    return (order &&
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={onClickBackBtn} className="icon pageBack">Back</a>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">주문내역 상세</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="titleView">
                            <div className="flowResult">
                                <div className="infoLabel">
                                {order.ordrKindCd.indexOf("9") != -1 ?
                                    <span className="deli">배달</span>
                                    : <span className="pick">픽업</span>
                                }
                                </div>
                                <ul className="resultList">
                                    <li><strong>주문일시</strong> : {order.ordrDtm}</li>
                                    <li><strong>주문번호</strong> : {order.ordrId}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flowBox">
                            {order.ordrStusCd != "2000" && order.ordrStusCd != "9000" && order.ordrStusCd != "9999"?
                            <div className={order.ordrKindCd.indexOf("9") != -1 ? "flowInner flowDeil" : "flowInner flowPick"}>
                                <ul className="flowMap">
                                    <OrderStatusDiagram cd={order.ordrStusCd} />
                                </ul>
                            </div>
                            :
                            <div className="flowInner flowCancel">
                                <div className="flowArrive">
                                    <p><srong>주문 취소 완료</srong></p>
                                </div>
                            </div>
                        }
                        </div>    
                        <div className="orderInfoList typeResult">
                            <h2 className="listTitle">주문 매장</h2>
                            <div className="storeBox">
                                <div className="storeInfo">
                                    <p className="title"><strong>{unescapehtmlcode(order.strNm)}</strong></p>
                                    <p className="address">{unescapehtmlcode(order.strAddr)}</p>
                                </div>
                                <div className="storeContect">
                                    <a onClick={() => SDL_dispatchCallPhone({cnctNo: order.cnctNo})} className="btn tel">전화 걸기</a>
                                    <a className="btn location" 
                                        onClick={()=> history.push({pathname:ACTION.LINK_MARKET_DETAIL+`${order.strId}`
                                        , state: {
                                            strId: order.strId,
                                            bizCtgDtl: order.bizCtgDtl
                                        }})}>매장</a>
                                </div>
                            </div>                            
                        </div>
                        <div className="sectionBlock"></div>         
                        <div className="orderInfoList typeResult">
                            <h2 className="listTitle">주문내역</h2>
                            <ul className="infoLIst">

                                {order.prdInfo.map((menu, i) => 
                                    <li key={i}>
                                        <span className="leftCell">
                                            {unescapehtmlcode(menu.prdNm)} x {menu.ordrCnt}
                                            <span className="options">
                                                {menu.option.map((option, i) => {
                                                    i != menu.option.length -1  ?
                                                        unescapehtmlcode(option.optPrdNm+', ') : unescapehtmlcode(option.optPrdNm)
                                                })}
                                            </span>
                                        </span>
                                        <span className="rightCell">
                                            <strong>{numberFormat(menu.prdPrc)}원</strong>
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="sectionBlock"></div>
                        <div className="orderInfoList typeResult">
                            <h2 className="listTitle">
                                결제금액
                                {/* <a onClick={()=> history.push(ACTION.LINK_ORDER_RECEIPT)} className="moreBtn">영수증 확인</a> */}
                            </h2>
                            <ul className="infoLIst">
                                <li>
                                    <span className="leftCell">
                                        주문금액
                                    </span>
                                    <span className="rightCell">
                                        <strong>{numberFormat(order.ordrPrc)}원</strong>
                                    </span>
                                </li>
                                <li>
                                    <span className="leftCell">
                                        할인금액
                                    </span>
                                    <span className="rightCell">
                                        <strong>-{numberFormat(parseInt(order.discPrc))}원</strong>
                                    </span>
                                </li>
                            </ul>
                            <ul className="infoLIst result">
                                <li>
                                    <span className="leftCell">
                                        <strong className="total">총 결제금액</strong>
                                    </span>
                                    <span className="rightCell">
                                        <strong className="total">{numberFormat(order.payPrc)}원</strong>
                                    </span>
                                </li>
                                <li>
                                    <span className="leftCell">
                                        결제방법
                                    </span>
                                    <span className="rightCell">
                                        <strong>
                                            {unescapehtmlcode(order.ordrKindNm)}
                                        </strong>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="sectionBlock"></div>
                        <div className="orderInfoList typeResult">
                            <h2 className="listTitle">
                                주문자 정보
                            </h2>
                            <ul className="infoLIst">
                            {order.ordrKindCd != '2ICP' && 
                                <li className="address">
                                    <span className="leftCell">
                                    <strong>배달주소</strong>
                                    </span>
                                    <span className="rightCell">
                                        {order.dlAddr} {order.dlAddrDtl} <br />
                                    </span>
                                </li>
                            }
                                <li>
                                    <span className="leftCell">
                                        <strong>전화번호</strong>
                                    </span>
                                    <span className="rightCell">
                                        {order.orderCnct}
                                    </span>
                                </li>
                                <li>
                                    <span className="leftCell">
                                        매장에 요청해요~
                                    </span>
                                    <span className="rightCell">
                                        {order.ordrDesc}
                                    </span>
                                </li>
                                <li>
                                    <span className="leftCell">
                                        라이더에게 요청해요~
                                    </span>
                                    <span className="rightCell">
                                        {order.dlMnDesc}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="sectionBlock"></div>
                    </div>
                </div>
            </div>
            <div id="nav">
                <div>
                    <ul className="navList">
                        <li className="home"><Link to={{pathname: ACTION.LINK_HOME}}>홈</Link></li>
                        <li className="map"><Link to={{pathname: ACTION.LINK_AROUND_MAP}}>주변지도</Link></li>
                        <li className="myPage"><Link to={{pathname: ACTION.LINK_MYPAGE}}>my슬배생</Link></li>
                        <li className="myOrder active"><Link to={{pathname: ACTION.LINK_ORDER_HISTORY}}>주문내역</Link></li>
                        <li className="myLike"><Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const OrderStatusDiagram = ({cd}) => {
        const ordrStusCd = parseInt(cd.toString())

        switch(ordrStusCd) {
            
            /* 주문 접수중 */
            case 2003: /* 픽업 주문 접수 */
                return <>
                        <li className="active"><span>주문 접수중</span></li>
                        <li><span>주문완료</span></li>
                        <li><span>준비중</span></li>
                        <li><span>준비완료</span></li>
                        <li><span>픽업완료</span></li>
                    </>
            case 9001: /* 배달 주문 접수 */
                return <>
                        <li className="active"><span>주문 접수중</span></li>
                        <li><span>주문완료</span></li>
                        <li><span>준비중</span></li>
                        <li><span>배달중</span></li>
                        <li><span>배달완료</span></li>
                    </>

            /* 주문 완료 */
            case 2005: /* 픽업 주문 확인 */
                return <>
                        <li><span>주문 접수중</span></li>
                        <li className="active"><span>주문완료</span></li>
                        <li><span>준비중</span></li>
                        <li><span>준비완료</span></li>
                        <li><span>픽업완료</span></li>
                    </>
            case 9003: /* 배달 주문 확인 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li className="active"><span>주문완료</span></li>
                    <li><span>준비중</span></li>
                    <li><span>배달중</span></li>
                    <li><span>배달완료</span></li>
                </>
            
            /* 준비중 */
            case 2007: /* 픽업 상품 준비중 */
            case 2085: /* 픽업 지연 */
                return <>
                        <li><span>주문 접수중</span></li>
                        <li><span>주문완료</span></li>
                        <li className="active"><span>준비중</span></li>
                        <li><span>준비완료</span></li>
                        <li><span>픽업완료</span></li>
                    </>
            case 9005: /* 배달 상품 준비중 */
            case 9007: /* 배달 요청 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li><span>주문완료</span></li>
                    <li className="active"><span>준비중</span></li>
                    <li><span>배달중</span></li>
                    <li><span>배달완료</span></li>
                </>
            
            /* 준비완료/배달중 */
            case 2009: /* 픽업 대기 */
            case 2099: /* 픽업 미완료 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li><span>주문완료</span></li>
                    <li><span>준비중</span></li>
                    <li className="active"><span>준비 완료</span></li>
                    <li><span>픽업완료</span></li>
                </>
            
            case 9009: /* 배달 접수 */
            case 9011: /* 상품인도->배달중 */
            case 9085: /* 배달 지연 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li><span>주문완료</span></li>
                    <li className="active"><span>준비중</span></li>
                    <li><span>배달중</span></li>
                    <li><span>배달완료</span></li>
                </>
            
            /* 픽업완료/배달완료 */
            case 2020: /* 픽업 완료 */
            case 2090: /* 픽업 지연 완료 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li><span>주문완료</span></li>
                    <li><span>준비중</span></li>
                    <li><span>준비 완료</span></li>
                    <li className="active"><span>픽업완료</span></li>
                </>
            
            case 9020: /* 배달 완료 */
            case 9090: /* 배달 지연 완료 */
            case 9098: /* 영수증 주문 취소 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li><span>주문완료</span></li>
                    <li><span>준비중</span></li>
                    <li><span>배달중</span></li>
                    <li className="active"><span>배달완료</span></li>
                </>

        }

        // 휴게소 
        // <div className="flowInner flowRest">
        //     {/* <!-- active 클래스 변경 --> */}
        //     <ul className="flowMap">
        //         <li><span>주문 접수중</span></li>
        //         <li className="active"><span>주문완료</span></li>
        //     </ul>
        //     <div className="flowArrive">
        //         <p><srong>대기번호 : 137</srong></p>
        //     </div>
        // </div>
        
        {/* <div className="flowArrive">
            <p><strong>오후 5시 20분 도착 예정</strong></p>
        </div> */}
        
}