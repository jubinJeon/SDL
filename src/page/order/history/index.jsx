import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import {REDUCER_ACTION} from '../../../context/SDLReducer'
import {SDLContext} from '../../../context/SDLStore'
import useAsync from '../../../hook/useAcync';
import Alert from '../../popup/Alert'
import { numberFormat, unescapehtmlcode } from '../../../util/Utils';

// const retrieveOrderHistory = () => {
//     return API.orderHistory()
//     .then((result) => {
//         if(result.code) {
//             console.log(result.data)
//             return result.data
//         }
//     })
// }

const orderHistoryList = [
    {  
        // strId 매장 id(링크)
        index: 0,   // ordrId
        DP: 0, 
        status: 0,    // 0: 배달 중
        time: '오후 5:20 도착 예정'  ,
        name: '카페 이디야 신도림점',// strNm
        menu: ['오곡라떼', '어쩌고', '다른거'],
        price: 8800 // ordrPrc
      },
      {
        index: 1,
        DP: 0, 
        status: 1,    //1: 배달 완료
        time: '2020.05.18 오전 08:10'  ,
        name: '카페 탐탐 신도림점',
        menu: ['아메리카노', '딴거', '어쩌고', '다른거'],
        price: 12000
      },
      {
        index: 2,
        DP: 1, 
        status: 2,    // 2: 주문 완료
        time: '오후 10:10'  ,
        name: '맛없는 돈까스 신도림점',
        menu: ['치즈돈까스'],
        price: 9000
      },
      {
        index: 3,
        DP: 1, 
        status: 3,    // 3: 픽업 완료
        time: '2020.05.17 오후 12:10'  ,
        name: '맛잇는 돈까스 구디',
        menu: ['왕돈까스', '딴거'],
        price: 13000
      },
      

  ];


export default ( {history} ) => {
    const {cdata, dispatch} = useContext(SDLContext)
    
    //팝업
    const [modal, setModal] = useState({
    showModal: false,
    dataModal: {
        type: "",
        title: "",
        desc: ""
    }
    })
    const handleClickOpen = (data) => {
        setModal({
            showModal: true,
            dataModal: data
        })
    };
    
    const handleClose = () => {
    setModal({ ...modal, showModal: false });
    };
    //팝업
    // const data1 = useMemo(() => retrieveOrderHistory(), [])
    // const [historyList, setHistory] = useState(data1)
    
    // useEffect(() => {
    //     console.log(data)
    //     console.log(historyList)
    // })

    const doFilter = (DP) => {
        const style = {
            display: 'none'
        }
        if(DP === filter) return '{}';
        else return style;
    }
    const [filter, setFilter] = useState(2);
    const [state, refetch] = useAsync(API.orderHistory, [])
    const {loading, error, data} = state

    useEffect(() =>  {
        if( !loading && data) {
            console.log(data)
        }
    }, [state])


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
    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="middleArea">
                        <h1 className="headerTitle">주문내역</h1>
                    </div>
                    <div className="rightArea" onClick={refetch}>
                        <a className="icon reflash">
                            새로고침
                        </a>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="listSort pageSort">
                            <div className="btnWrap leftCol">
                                {/* <!-- active 클래스 추가 & 삭제 --> */}
                                <button type="button" className={filter === 2 ? ('btn icon star active') : 'btn'} onClick={()=>setFilter(2)}>전체</button>
                                <button type="button" className={filter === 0 ? ('btn icon star active') : 'btn'} onClick={()=>setFilter(0)}>배달</button>
                                <button type="button" className={filter === 1 ? ('btn icon star active') : 'btn'} onClick={()=>setFilter(1)}>픽업</button>
                            </div>                      
                        </div>
                        <div className="sectionBlock" ></div>
                        { data && data.data.length != 0 ?
                            data.data.map((order, idx) => {
                                return (
                                    ( (order.ordrKindCd.indexOf("9") != -1 ? 0:1) === filter || 2 === filter) && 
                                    <React.Fragment key={order.ordrId}>
                                        <div className="orderInfoList typeResult">
                                            <SingleHistoryComponent order={order} handleClickOpen={handleClickOpen} dispatch={dispatch} history={history}/>
                                        </div>
                                        <div className="sectionBlock" ></div>
                                    </React.Fragment>
                                )
                            })
                        :
                            <div className="emptyWrap noneData">
                                <div className="empty">
                                    <p className="emptyMsg_1">주문내역이 없습니다.</p>
                                    {/* <div className="bottomButton">
                                        <button type="button" className="listBottomMore">과거 주문내역 확인하기</button>
                                    </div> */}
                                </div>
                            </div>
                        }

                        {/* // <>
                        //     <div key={data.ordrId} className="orderInfoList typeResult" style={{display: (data.DP === filter || filter === 2) ? 'block': 'none'}}>
                        //         <SingleHistoryComponent data={data} />
                        //     </div>
                        //     <div key={data.index+'sb'} className="sectionBlock" style={{display: (data.DP === filter|| filter === 2)? 'block': 'none'}}></div>
                        // </> */}

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
        <Alert open={modal.showModal} data={modal.dataModal} handleClose={handleClose}></Alert>
        </div>
    )
};



const SingleHistoryComponent = ( {order, handleClickOpen, dispatch, history} ) => {
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
            case 9009: /* 배달 접수 */
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

        }
    }

    const timeButtonSwitch = (status) => {
        const ordStusCd = parseInt(status) 
        switch(ordStusCd) {

            ///////// 취소 버튼(1)
            case 2003: // 픽업 주문 접수
            case 9001: // 배달 주문 접수
                // return <a href="#" class="posRight moreFunBtn">취소</a>
                return <a className="moreDate orderIng"></a>

            ///////// 아무 버튼 없음
            // 픽업
            case 2005: /* 픽업 주문 확인 */
            case 2007: /* 상품 준비중 */
            case 2085: /* 픽업 지연 */
            // 배달
            case 9003: /* 주문 확인 */
            case 9005: /* 상품 준비중 */
            case 9007: /* 배달 요청 */
            case 9009: /* 배달 접수 */
            case 9011: /* 상품인도->배달중 */
            case 9085: /* 배달 지연 */
                return <a href="#" className="moreDate orderIng"></a>

            ///////// 닉네임/주문번호 표기
            case 2009: /* 픽업 대기 */
            case 2099: /* 픽업 미완료 */
                if(order.mbrFg != "1") return <a class="posRight moreFunBtn">{order.ordrId}</a>   // 비회원
                else return <a class="posRight moreFunBtn">{order.mbrNick}</a>

            ///////// 일시/시간 표기
            // 픽업
            case 2000: /* 픽업 주문 취소 */
            case 2020: /* 픽업 완료 */
            case 2090: /* 픽업 지연 완료 */
            // 배달
            case 9000: /* 배달 주문 취소 */
            case 9020: /* 배달 완료 */
            case 9090: /* 배달 지연 완료 */
            case 9098: /* 영수증 주문 취소 */
            // actlRcvDtm, 2020-07-08 09:30:26
            // 당일/이외 처리
                if(order.isTodayOrdrFg == "1")
                    return <a href="#" className="moreDate orderDone">{order.actlRcvDtm.substring(11)}</a>
                else return <a href="#" className="moreDate orderDone">{order.actlRcvDtm}</a>

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
                        {/* <a className="btn icon detail">주문상세(준비중)</a> */}
                    </ul>
                </>
                );
            // 취소 완료 상태
            case 9999:  // 주문 취소
                return (
                <>
                    <ul className="btnInner">
                        <li>
                            <button className="btn detail" type="button" onClick={() => {
                                handleClickOpen({
                                    type : "ALERT",
                                    desc : '고객님께서 주문하신 내역이 '+order.ordrCclNm+'로 주문접수가'
                                    + ' 취소되었습니다. 불편을 드려 죄송합니다. 결제 취소가 정상적으로 되지 않았을 경우, '
                                    +' 고객센터 1599-3700으로 연락을 요청드립니다.'
                                })
                            }}>
                                취소 사유
                            </button>
                        </li>
                        <OrderDetailBtn />
                        {/* <a className="btn icon detail">주문상세(준비중)</a> */}
                    </ul>
                </>
                );
            case 2000:  // 픽업 주문취소
            case 9000:  // 배달 주문 취소
                return (
                    <>
                        <ul className="btnInner">
                        <OrderDetailBtn/>
                        {/* <a className="btn icon detail">주문상세(준비중)</a> */}
                        </ul>
                    </>
                    );
            // 정상 완료
            case 2020:  // 픽업 완료
            case 2090:  // 픽업 지연 완료
            case 9020:  // 배달 완료
            case 9090:  // 배달 지연 완료
                return (
                <>
                    <ul className="btnInner">
                    { order.canRegRvwYn === "Y" ?
                        <li>
                            {/* <Link to={{pathname: ACTION.LINK_MAKE_REVIEW}} 
                                className="btn icon review" >리뷰쓰기</Link> */}
                            <a className="btn icon review">리뷰쓰기(준비중)</a>
                        </li>
                        :
                        <li>
                            <a className="btn icon review disable">리뷰쓰기</a>
                        </li>
                    }
                        <OrderDetailBtn />
                        {/* <a className="btn icon detail">주문상세(준비중)</a> */}
                    </ul>
                </>
                );
        }
    }

    const OrderDetailBtn = () => {
        return (
            <li>
                <a onClick={() => {
                    dispatch({type: REDUCER_ACTION.ORDER_HISTORY, payload: {ordrId: order.ordrId, bizCtgDtl: order.bizCtgDtl}})
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
                { timeButtonSwitch(order.ordrStusCd) }
            </h2>
            <div className="infoBox">
                <div className="infoInner">
                    <p className="title"><strong>{unescapehtmlcode(order.strNm)}</strong>
                        <Link to = {{pathname:ACTION.LINK_MARKET_DETAIL+`${order.strId}`
                                   , state: {
                                       strId: order.strId,
                                       bizCtgDtl: order.bizCtgDtl
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