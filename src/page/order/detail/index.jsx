import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import {SDL_dispatchCallPhone} from '../../../appBridge'

import {SDLContext} from '../../../context/SDLStore'
import useAsync from '../../../hook/useAcync';
import { unescapehtmlcode, numberFormat } from '../../../util/Utils'
import FooterNavigation from '../../../components/FooterNavgation'

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

    const [state, refetch] = useAsync(() => API.orderHistoryDetail(contextData.recentOrderHistory.ordrId, contextData.recentOrderHistory.storeCd), [])
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
                        {order.ordrStusCd != "2000" && order.ordrStusCd != "9000" && order.ordrStusCd != "9999" ?
                            <div className={order.ordrKindCd.indexOf("9") != -1 ? "flowInner flowDeil" : 
                                                order.storeCd === 'R' ? 
                                                    "flowInner flowCancel" : "flowInner flowPick"}>
                                    {order.storeCd === 'R' ?/* flowRest */
                                        <RestOrderStatusDiagram cd={order.ordrStusCd} waitNum={order.waitNum}/>
                                    :
                                        <ul className="flowMap">
                                            <OrderStatusDiagram cd={order.ordrStusCd} /></ul>
                                    }
                            </div>
                            :
                            <div className="flowInner flowCancel">
                                <div className="flowArrive">
                                    <p><strong>주문 취소 완료</strong></p>
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
                                    <a href={'tel://' + order.cnctNo}>전화 걸기</a>
                                    <a className="btn location" 
                                        onClick={()=> history.push({pathname:ACTION.LINK_MARKET_DETAIL+`${order.strId}`
                                        , state: {
                                            strId: order.strId,
                                            storeCd: contextData.recentOrderHistory.storeCd
                                            // bizCtgGrp: order.bizCtgGrp
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
                                                    return (
                                                        i != menu.option.length -1  ?
                                                            unescapehtmlcode(option.optPrdNm+', ') : unescapehtmlcode(option.optPrdNm)
                                                    )
                                                })}
                                            </span>
                                        </span>
                                        <span className="rightCell">
                                            <strong>{numberFormat(Number(menu.prdPrc * menu.ordrCnt))}원</strong>
                                        </span>
                                    </li>
                                )}
                                {/* 배달 팁 */}
                                { order.ordrKindCd.indexOf("9") != -1 &&
                                <li>
                                    <span className="leftCell">
                                        배달팁
                                    </span>
                                    <span className="rightCell">
                                        <strong>{numberFormat(order.dlOrgPrc)}원</strong>
                                    </span>
                                </li> }
                            </ul>
                        </div>
                        <div className="sectionBlock"></div>
                        { order.discInfo.length > 0 &&
                        <>
                        <div className="orderInfoList typeResult">
                            <h2 className="listTitle">할인혜택</h2>
                            <ul className="infoLIst">

                                {order.discInfo.map((disc, i) => 
                                    <li key={i}>
                                        <span className="leftCell">
                                            {unescapehtmlcode(disc.reason)}
                                        </span>
                                        <span className="rightCell">
                                            <strong>{numberFormat(disc.price)}원</strong>
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div> 
                        <div className="sectionBlock"></div> 
                        </>}
                        <div className="orderInfoList typeResult">
                            <h2 className="listTitle">
                                결제금액
                                { order.ordrKindCd.indexOf("ICP") != -1 &&
                                <a onClick={()=> history.push({
                                    pathname: ACTION.LINK_ORDER_RECEIPT,
                                    storeCd: contextData.recentOrderHistory.storeCd,
                                    ordrId: order.ordrId
                                })
                                } className="moreBtn">영수증 확인</a> }
                            </h2>
                            <ul className="infoLIst">
                                <li>
                                    <span className="leftCell">
                                        주문금액
                                    </span>
                                    <span className="rightCell">
                                        <strong>{numberFormat(Number(order.ordrPrc)-Number(order.dlOrgPrc))}원</strong>
                                    </span>
                                </li>
                                { order.discPrc != "0" && <li>
                                    <span className="leftCell">
                                        할인금액
                                    </span>
                                    <span className="rightCell">
                                        <strong>- {numberFormat(parseInt(order.discPrc))}원</strong>
                                    </span>
                                </li> }
                                { order.ordrKindCd.indexOf("9") != -1 &&
                                <li>
                                    <span className="leftCell">
                                        배달팁
                                    </span>
                                    <span className="rightCell">
                                        <strong>{numberFormat(parseInt(order.dlPrc))}원</strong>
                                    </span>
                                </li>
                                }
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
                                            {/* {unescapehtmlcode(order.ordrKindNm)} */}
                                            {order.ordrKindCd == '2ICP' && "바로결제"}
                                            {order.ordrKindCd == '9ICP' && "바로결제"}
                                            {order.ordrKindCd == '9ICA' && "만나서 카드 결제"}
                                            {order.ordrKindCd == '9ICM' && "만나서 현금 결제"}
                                        </strong>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="sectionBlock"></div>
                        { (order.bizCtgGrp != process.env.REACT_APP_REST_AREA_CODE) &&
                            <>
                            <div className="orderInfoList typeResult">
                                <h2 className="listTitle">
                                    주문자 정보
                                </h2>
                                <ul className="infoLIst">
                                {order.ordrKindCd != '2ICP' && 
                                    <li>
                                        <span className="leftCell">
                                        <strong>배달주소</strong>
                                        </span>
                                        <span className="leftCell">
                                            {unescapehtmlcode(order.dlAddr)} {unescapehtmlcode(order.dlAddrDtl)} <br />
                                        </span>
                                    </li>
                                }
                                    <li>
                                        <span className="leftCell">
                                            <strong>전화번호</strong>
                                        </span>
                                        <span className="leftCell">
                                            {order.orderCnct}
                                        </span>
                                    </li>
                                    { order.ordrDesc != '' ?
                                        <li>
                                            <span className="leftCell">
                                                매장에 요청해요.
                                            </span>
                                            <span className="leftCell">
                                                {unescapehtmlcode(order.ordrDesc)}
                                            </span>
                                        </li> 
                                    : null }
                                    { order.ordrKindCd != '2ICP' && order.dlMnDesc != '' ?
                                        <li>
                                            <span className="leftCell">
                                                라이더에게 요청해요.
                                            </span>
                                            <span className="leftCell">
                                                {unescapehtmlcode(order.dlMnDesc)}
                                            </span>
                                        </li> 
                                    : null }
                                    { order.disposableUseFg === '1' ?
                                        <li>
                                            <span className="">
                                                일회용품은 안 주셔도 됩니다.
                                            </span>
                                        </li> 
                                    : null }                                    
                                </ul>
                            </div>
                            <div className="sectionBlock"></div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <FooterNavigation/>
        </div>
    );
};

const RestOrderStatusDiagram = ({cd, waitNum}) => {
    const ordrStusCd = parseInt(cd.toString())

    switch(ordrStusCd) {

        case 2003:
            return <>
                {/* <ul className="flowMap">
                    <li className="active">
                        <span>주문 접수중</span>
                    </li>
                    <li>
                        <span>주문 접수완료</span>
                    </li>
                </ul> */}
                <div class="flowArrive">
                    <p><strong>주문 접수 중</strong></p>
                </div>
            </>
        
        case 2005:
        case 2007:
        case 2009:
        case 2085:
        case 2099:
        case 2020:
        case 2090:
            if(waitNum !== "") {
                return <div className="flowArrive">
                            <p><strong>대기번호 : {waitNum}</strong></p>
                        </div>
            }
            else return <p></p>
        default:
    }

}

const OrderStatusDiagram = ({cd}) => {
        const ordrStusCd = parseInt(cd.toString())

        switch(ordrStusCd) {
            
            /* 주문 접수중 */
            case 2003: /* 픽업 주문 접수 */
                return <>
                        <li className="active"><span>주문 접수중</span></li>
                        <li><span>주문 접수완료</span></li>
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
                        <li className="active"><span>주문 접수완료</span></li>
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
                        <li><span>주문 접수완료</span></li>
                        <li className="active"><span>준비중</span></li>
                        <li><span>준비완료</span></li>
                        <li><span>픽업완료</span></li>
                    </>
            case 9005: /* 배달 상품 준비중 */
            case 9007: /* 배달 요청 */
            case 9009: /* 배달 접수 */
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
                    <li><span>주문 접수완료</span></li>
                    <li><span>준비중</span></li>
                    <li className="active"><span>준비 완료</span></li>
                    <li><span>픽업완료</span></li>
                </>
            
            case 9011: /* 상품인도->배달중 */
            case 9085: /* 배달 지연 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li><span>주문완료</span></li>
                    <li><span>준비중</span></li>
                    <li className="active"><span>배달중</span></li>
                    <li><span>배달완료</span></li>
                </>
            
            /* 픽업완료/배달완료 */
            case 2020: /* 픽업 완료 */
            case 2090: /* 픽업 지연 완료 */
                return <>
                    <li><span>주문 접수중</span></li>
                    <li><span>주문 접수완료</span></li>
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
            default:

        }
        
}