import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import {REDUCER_ACTION} from '../../../context/SDLReducer'
import {SDLContext} from '../../../context/SDLStore'
import useAsync from '../../../hook/useAcync';
import { numberFormat, unescapehtmlcode } from '../../../util/Utils';
import FooterNavigation from '../../../components/FooterNavgation'


const OrderHistory = ( {history} ) => {
    
    const {dispatch} = useContext(SDLContext)

    // 회원 여부
    const [isMember, setIsMember] = useState(false)

    // 과거 주문내역 존재 여부
    const [pastOrderYN, setPastOrderYN] = useState(false)

    const [filter, setFilter] = useState(2);
    const [state, refetch] = useAsync(API.orderHistory, [])
    const {loading, error, data} = state
    const [historyData, setHistoryData] = useState()

    useEffect(() =>  {
        if( !loading && data ) {

            const result = data.data

            // 회원 여부 조회(for 리뷰쓰기 show/hide)
            API.getMemberInfo()
            .then((data) => {
                // console.log(data)
                setIsMember(true)
                setHistoryData(result)
            })
            .catch((err) => {
                if(err.response.status == 403) {
                    setIsMember(false)
                    setHistoryData(result)
                }
                else {
                    console.log(err.response)
                }
            })
            
            // 과거 주문 이력 조회
            API.pastOrderYN()
            .then((data) => {
                
                if(data.data.result === "1")
                    setPastOrderYN(true)
                else
                    setPastOrderYN(false)
            })
            .catch((err) => {
                // if(err.response.status == 403) {
                //     setIsMember(false)
                // }
                // else {
                    console.log(err.response)
                // }
            })

        }
    }, [state])

    useEffect(() => {
        console.log(historyData)
    }, [historyData])
    
    const nativePushCallback = (event) => {
        console.log(event)
        // history.replace(ACTION.LINK_ORDER_HISTORY)
        if(event.detail.type === 'NOTIFICATION_WHEN_IN_FOREGROUND'){
            refetch()
        }
    }

    useEffect(()=>{
        window.addEventListener('SDL_nativeEvent',nativePushCallback)

        return () =>{
            window.removeEventListener('SDL_nativeEvent',nativePushCallback)
        }
    },[])


    if (loading) return (
        <>
            <div className="">
                <div className="stateWrap">
                    <div className="loading">로딩중..</div>
                </div>
            </div>
        </>
    )

    if (error) return (
        <div className="">
            <div className="stateWrap">
                <div className="error">에러가 발생했습니다</div>
            </div>
        </div>
    )
    return (
        <div id="wrap">
            <Header reload = {refetch}/>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="listSort pageSort">
                            <div className="btnWrap leftCol">
                                {/* <!-- active 클래스 추가 & 삭제 --> */}
                                <button type="button" className={filter === 2 ? ('btn active') : 'btn'} onClick={()=>setFilter(2)}>전체</button>
                                <button type="button" className={filter === 0 ? ('btn active') : 'btn'} onClick={()=>setFilter(0)}>배달</button>
                                <button type="button" className={filter === 1 ? ('btn active') : 'btn'} onClick={()=>setFilter(1)}>픽업</button>
                            </div>                      
                        </div>
                        <div className="sectionBlock" ></div>
                        { historyData == null ?
                        null
                        :
                        <>
                            { historyData.length !== 0 ?
                                historyData.map((order, idx) => {
                                    return (
                                        ( (order.ordrKindCd.indexOf("9") !== -1 ? 0:1) === filter || 2 === filter) && /* order.canRvwYn === "Y" && */
                                        <React.Fragment key={order.ordrId}>
                                            <div className="orderInfoList typeResult">
                                                <SingleHistoryComponent order={order} dispatch={dispatch} history={history} isMember={isMember} refetch={refetch}/>
                                            </div>
                                            <div className="sectionBlock" ></div>
                                        </React.Fragment>
                                    )
                                })
                            :
                                <div className="emptyWrap noneData">
                                    <div className="empty">
                                        <p className="emptyMsg_1">주문내역이 없습니다.</p>
                                    </div>
                                </div>
                            }
                            { pastOrderYN &&
                            <div className="bottomButton">
                                <button type="button" className="listBottomMore" onClick={
                                    e => {
                                        e.target.parentElement.setAttribute("style", "display: none")
                                        API.orderHistory(1)
                                        .then((data) => {
                                            // console.log(data.data)
                                            if(data.data.length > 0)    // always true
                                                setHistoryData([...historyData, ...data.data]) 
                                        })
                                    }
                                }>과거 주문내역 확인하기</button>
                            </div> }
                        </>
                        }
                    </div>
                </div>
            </div>
            <FooterNavigation/>
        </div>
    )
};

const Header = ({reload}) => {

    const {dispatch,data} = useContext(SDLContext);

    const onClickBackBtn = ()=>{
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    }

    return(
        <>
            <div id="header">
                <div className="headerTop">

                    {
                        //data.channel.channelUIType !== 'A' && (
                        //    <div className="leftArea">
                        //        <a onClick={onClickBackBtn} className="icon pageBack">Back</a>
                        //    </div>
                        //)
                    }
                    
                    <div className="middleArea">
                        <h1 className="headerTitle">주문내역</h1>
                    </div>
                    <div className="rightArea" onClick={reload}>
                        <a className="icon reflash">
                            새로고침
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

const SingleHistoryComponent = ( {order, dispatch, history, isMember, refetch} ) => {
    // console.log(order)

    const titleColorSwitch = (status) => {
        const ordStusCd = parseInt(status)

        switch(ordStusCd) {
            /* 취소 */
            case 2000:
            case 9000:
                return "listTitle canceled"
            default:
                return "listTitle"
        }
    }

    const strStatusSwitch = (status) => {
        const ordStusCd = parseInt(status) 

        switch(ordStusCd) {

            ///////// 배달 픽업 공통 단계(1~3)
            /* 주문 접수중 */
            case 2003: /* 픽업 주문 접수 */
            case 9001: /* 배달 주문 접수 */
                return <>주문 접수중</>

            /* 주문 완료 */
            case 2005: /* 픽업 주문 확인 */
                return <>주문 접수 완료</>

            case 9003: /* 배달 주문 확인 */
                return <>주문 완료</>
            
            /* 준비중 */
            case 2007: /* 픽업 상품 준비중 */
            case 2085: /* 픽업 지연 */
            case 9005: /* 배달 상품 준비중 */
            case 9007: /* 배달 요청 */
            case 9009: /* 배달 접수 */
                return <>준비중</>
            
            ///////// 픽업 단계(4~5)
            /* 준비 완료 */
            case 2009: /* 픽업 대기 */
            case 2099: /* 픽업 미완료 */
                return <>준비 완료</>
            
            /* 픽업 완료 */
            case 2020: /* 픽업 완료 */
            case 2090: /* 픽업 지연 완료 */
                return <>픽업 완료</>
            
            ///////// 배달 단계(4~5)
            /* 배달중 */
            case 9011: /* 상품인도->배달중 */
            case 9085: /* 배달 지연 */
                return <>배달중</>
            
            /* 배달 완료 */
            case 9020: /* 배달 완료 */
            case 9090: /* 배달 지연 완료 */
            case 9098: /* 영수증 주문 취소 */
                return <>배달 완료</>

            ///////// 배달 픽업 공통 단계(6)
            case 2000: /* 픽업 주문 취소 */
            case 9000: /* 배달 주문 취소 */
            case 9999: /* 주문 취소 */
                return <>취소 완료</>
            default:

        }
    }

    const timeButtonSwitch = (status) => {
        
        const toastCallback = (data) => {
            data.dispatch({type : 'TOAST', payload : {show : false }})
        }

        const ordStusCd = parseInt(status)
        switch(ordStusCd) {

            ///////// 취소 버튼(1)
            case 2003: // 픽업 주문 접수
            case 9001: // 배달 주문 접수
            return (
                order.bizCtgGrp == process.env.REACT_APP_REST_AREA_CODE ? 
                null :
                <>
                { order.cancelFg == "1" &&
                    <a className="posRight moreFunBtn" onClick={() => {
                        dispatch({ type: REDUCER_ACTION.SHOW_CONFIRM,
                                payload: {data: {title: '정말 취소하시겠습니까?', desc: '주문하신 내역을 취소처리 하는중입니다. '
                                + '단, 해당 매장에서 이미 조리를 시작한 경우에는 주문 변경/취소가 불가능할 수 있으니, 매장으로 직접 전화하여 확인해 주시기 바랍니다.'
                                },
                                            callback: (res) => {
                                                if(res == 1) {
                                                    dispatch({type : REDUCER_ACTION.HIDE_CONFIRM})
                                                    
                                                    API.cancelOrder(order.storeCd, order.ordrId)
                                                    .then((data)=> {
                                                        dispatch({type: 'TOAST', payload: {show: true , data: {msg: '취소가 완료되었습니다.', code: '', dispatch: dispatch} , callback: toastCallback}})
                                                        refetch()
                                                    })
                                                    .catch((err) => { 
                                                        dispatch({type: 'TOAST', payload: {show: true , data: {msg: err.response.data.msg, code: '', dispatch: dispatch} , callback: toastCallback}})
                                                    })

                                                } else dispatch({type : REDUCER_ACTION.HIDE_CONFIRM})
                                            }
                                    }
                    })}}>취소</a>
                }
                </>
            )
                
            // return <a className="moreDate orderIng"></a>

            ///////// 아무 버튼 없음
            // 배달
            case 9003: /* 주문 확인 */
            case 9005: /* 상품 준비중 */
            case 9007: /* 배달 요청 */
            case 9009: /* 배달 접수 */
            case 9011: /* 상품인도->배달중 */
            case 9085: /* 배달 지연 */
                return <a href="#" className="moreDate orderIng"></a>

            ///////// 닉네임/주문번호 표기 -> 대기 번호로 변경 (2020.07.16)
            // 픽업
            case 2005: /* 픽업 주문 확인 */
            case 2007: /* 상품 준비중 */
            case 2009: /* 픽업 대기 */
            case 2085: /* 픽업 지연 */
            case 2099: /* 픽업 미완료 */
                // if(order.mbrFg != "1") return <a class="posRight moreFunBtn">{order.ordrId}</a>   // 비회원
                // else return <a class="posRight moreFunBtn">{order.mbrNick}</a>
                if(order.waitNum !== "")
                    return <a className="posRight moreFunBtn">대기번호 {order.waitNum}번</a>

            ///////// 일시/시간 표기
            // 픽업
            case 2020: /* 픽업 완료 */
            case 2090: /* 픽업 지연 완료 */
            // 배달
            case 9020: /* 배달 완료 */
            case 9090: /* 배달 지연 완료 */
            // actlRcvDtm, 2020-07-08 09:30:26
            // 당일/이외 처리
                return <a className="moreDate orderDone">{order.actlRcvDtm}</a>

            ///////// 취소 일시/시간 표기
            // 픽업
            case 2000: /* 픽업 주문 취소 */
            // 배달
            case 9000: /* 배달 주문 취소 */
            case 9098: /* 영수증 주문 취소 */
            case 9998: 
            case 9999: 
                return <a className="moreDate orderDone">{order.ordrCclDtm}</a>
            default:
        }
    }

    
    const timeButtonSwitch_Rest = (status) => {
        const ordStusCd = parseInt(status)

        switch(ordStusCd) {

            case 2000:
            case 9098: /* 영수증 주문 취소 */
            case 9999: 
                return <a className="moreDate orderDone">{order.ordrCclDtm}</a>

            case 2003:
                return null

            case 2005:
            case 2007:
            case 2009:
            case 2085:
            case 2099:
            case 2020:
            case 2090:
                return <a className="posRight moreFunBtn">대기번호 {order.waitNum}번</a>
            default:
        }

    }

    const bottomBtnSwitch = (status, history) => {
        const ordStusCd = parseInt(status)

        switch(ordStusCd) {
            //// 미완료 상태
            case 1001:  // 주문 중
            // 픽업 케이스
            case 2003:  // 주문 접수
            case 2005:  // 주문 확인
            case 2007:  // 상품 준비중
            case 2009:  // 픽업 대기
            case 2085:  // 픽업 지연
            case 2099:  // 픽업 미완료

            // 배달 케이스
            case 9001:  // 주문 접수
            case 9003:  // 주문 확인
            case 9005:  // 상품 준비중
            case 9007:  // 배달 요청
            case 9009:  // 배달 접수
            case 9011:  // 상품 인도->배달 중
            case 9085:  // 배달 지연
            case 9099:  // 배달 미완료
                return (
                <> 
                    <ul className="btnInner">
                        <OrderDetailBtn/>
                    </ul>
                </>
                );
            // 취소 완료 상태
            case 9999:  // 주문 취소
                return (
                    <>
                        <ul className="btnInner">
                            { order.ordrCclNm !== "" ?
                            <li>
                                <button className="btn detail" type="button" onClick={() => {
                                    dispatch({
                                        type: REDUCER_ACTION.SHOW_ALERT, 
                                        payload : {data : {title: '' , desc : '고객님께서 주문하신 내역이 '+order.ordrCclNm+'(으)로 주문접수가'
                                        + ' 취소되었습니다. 불편을 드려 죄송합니다. 결제 취소가 정상적으로 되지 않았을 경우, '
                                        +' 고객센터 1599-3700으로 연락을 요청드립니다.', code : 100},
                                        callback : () => {
                                          dispatch({type : REDUCER_ACTION.HIDE_ALERT})
                                        }
                                    }})
                                }}>
                                    취소 사유
                                </button>
                            </li>
                            :
                            null }
                            <OrderDetailBtn />
                        </ul>
                    </>
                );
            case 2000:  // 픽업 주문취소
            case 9000:  // 배달 주문 취소
            case 9098: /* 영수증 주문 취소 */
            case 9998: 
            case 2020:  // 픽업 완료
            case 2090:  // 픽업 지연 완료
            case 9020:  // 배달 완료
            case 9090:  // 배달 지연 완료
                return (
                <>
                    <ul className="btnInner">
                        { isMember ?
                            order.ordrKindCd.indexOf("9") != -1 ?
                                order.canRvwYn === "Y" ?
                                    <li>
                                        <Link to={{pathname: ACTION.LINK_MAKE_REVIEW, 
                                                    ordrId: order.ordrId,
                                                    ordrPrdNm: order.ordrPrdNm,
                                                    brdNm: order.brdNm,
                                                    ordrKindCd: order.ordrKindCd,
                                                    ordrDtm: order.ordrDtm
                                                }} 
                                            className="btn icon review" >리뷰쓰기</Link>
                                    </li>
                                    :
                                    <li>
                                        <a className="btn icon review disable">리뷰쓰기</a>
                                    </li>
                            : null 
                        : null}
                        <OrderDetailBtn />
                    </ul>
                </>
                );
            default:

        }
    }

    const OrderDetailBtn = () => {
        return (
            <li>
                <a onClick={() => {
                    dispatch({type: REDUCER_ACTION.ORDER_HISTORY, payload: {ordrId: order.ordrId, storeCd: order.storeCd, bizCtgGrp: order.bizCtgGrp}})
                    history.push({pathname: ACTION.LINK_ORDER_DETAIL})
                }
                } className="btn icon detail">주문상세</a>
            </li>
        )
    }

    return (
        <>
            <h2 className={ titleColorSwitch(order.ordStusCd) }>
                <div className="statusLabel">
                {order.ordrKindCd.indexOf("9") != -1?
                    <span className="label deli">배달</span>
                    : <span className="label pick">픽업</span>
                }
                </div>
                { strStatusSwitch(order.ordrStusCd) }
                { order.bizCtgGrp != process.env.REACT_APP_REST_AREA_CODE ? timeButtonSwitch(order.ordrStusCd) : timeButtonSwitch_Rest(order.ordrStusCd)}
            </h2>
            <div className="infoBox">
                <div className="infoInner">
                    <p className="title"><strong>{unescapehtmlcode(order.strNm)}</strong>
                        <Link to = {{pathname:ACTION.LINK_MARKET_DETAIL+`${order.strId}`
                                   , state: {
                                       strId: order.strId,
                                       storeCd: order.storeCd
                                    //    bizCtgGrp: order.bizCtgGrp
                                   }}} className="btnMenu">매장</Link>
                    </p>
                    <p className="option">{unescapehtmlcode(order.ordrPrdNm)} {numberFormat(order.ordrPrc)}원</p>
                    {/* <p className="option">{data.menu[0]} {data.menu.length > 1 ? (' 외 '+(data.menu.length-1)+'개') : ''} {data.price}원</p> */}
                </div>
                <div className="btnWrap">
                    { bottomBtnSwitch(order.ordrStusCd) }
                </div>
                
            </div>           
            
        </>
    )
}


export default OrderHistory