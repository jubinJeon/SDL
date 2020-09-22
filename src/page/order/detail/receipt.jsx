import React, { useEffect, useState }  from 'react'

import * as API from '../../../Api'
import useAsync from '../../../hook/useAcync';
import { unescapehtmlcode, numberFormat } from '../../../util/Utils'

export default ({location, history})  => {

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack()
    };

    const [state, refetch] = useAsync(() => API.receipt(
        location.storeCd, location.ordrId), [])
    const {loading, error} = state
    const [receipt, setReceipt] = useState()

    useEffect(() => {
        if( !loading && state.data) {
            console.log(state.data.data)
            setReceipt(state.data.data)

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
    else if(!receipt) return <>
        <div className="">
            <div className="stateWrap">
                <div className="loading">로딩중..</div>
            </div>
        </div>
    </>

    return ( receipt &&
        <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a onClick={onClickBackBtn} className="icon pageClose">CLOSE</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">전자 영수증</h1>
                </div>
                {/* <div className="rightArea">
                    <a href="#" className="icon delCart">
                        영수증받기
                    </a>
                </div> */}
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="fullHeight">
                    <div className="orderInfoList typeResult typeReceipt">
                        <h2 className="listTitle">판매자 정보</h2>
                        <ul className="infoLIst">
                            <li>
                                <span className="leftCell">
                                    판매처
                                </span>
                                <span className="rightCell">
                                    {unescapehtmlcode(receipt.strNm)}
                                </span>
                            </li>
                            <li>
                                <span className="leftCell">
                                    문의처
                                </span>
                                <span className="rightCell">
                                    {receipt.strTel}
                                </span>
                            </li>
                            <li>
                                <span className="leftCell">
                                    주소
                                </span>
                                <span className="rightCell">
                                    {unescapehtmlcode(receipt.strAddr)}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="sectionBlock"></div>
                    <div className="orderInfoList typeResult typeReceipt">
                        <h2 className="listTitle">결제 정보</h2>
                        <ul className="infoLIst">
                            <li>
                                <span className="leftCell">거래 일시</span>
                                <span className="rightCell">{receipt.payDtm}</span>
                            </li>
                            <li>
                                <span className="leftCell">결제 수단</span>
                                <span className="rightCell">{receipt.payMthdNm}</span>
                            </li>
                            <li>
                                <span className="leftCell">결제 카드</span>
                                <span className="rightCell">{receipt.payCardNm}</span>
                            </li>
                            <li>
                                <span className="leftCell">결제 구분</span>
                                <span className="rightCell">{receipt.payCardQuota}</span>
                            </li>
                            <li>
                                <span className="leftCell">승인 번호</span>
                                <span className="rightCell">{receipt.payAuthNo}</span>
                            </li>
                            {/* <!-- 수정 ver.01 0603 주문 취소 cancleItem 추가 --> */}
                            <li className={receipt.ordrStusCd != "2000" && receipt.ordrStusCd != "9000" && receipt.ordrStusCd != "9999" ?
                                            "payResult" : "payResult cancleItem"}>
                                <span className="leftCell"><strong>결제 금액</strong></span>
                                <span className="rightCell"><strong>{numberFormat(receipt.payPrc)}원</strong></span>
                            </li>
                            <li>
                                <span className="leftCell">공급가</span>
                                <span className="rightCell">{numberFormat(receipt.splPrc)}원</span>
                            </li>
                            <li>
                                <span className="leftCell">부가세</span>
                                <span className="rightCell">{numberFormat(receipt.vatPrc)}원</span>
                            </li>
                        </ul>
                    </div>
                    <div className="sectionBlock"></div>
                    <div className="orderInfoList typeResult">
                        <h2 className="listTitle">품목 정보</h2>
                        <ul className="infoLIst">
                            { receipt.prdInfo.map((prd, i) => 
                                <li key={i}>
                                    <span className="leftCell">
                                        {unescapehtmlcode(prd.prdNm)} x {prd.ordrCnt}
                                        <span className="options">
                                            {prd.option.map((option, i) => {
                                                return (
                                                    i != prd.option.length -1  ?
                                                    unescapehtmlcode(option+', ') : unescapehtmlcode(option)
                                                )
                                        })}</span>
                                    </span>
                                    <span className="rightCell">
                                        <strong>{numberFormat(prd.prdPrc*prd.ordrCnt)}원</strong>
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <p className="bottomMsg">
                        본 전자영수증은 세금계산서 등 증명서류로 활용할 수 없으며,
                        해당 주문에 대한 금액을 수령/영수하였음을
                        확인하는 용도로 발행됩니다.
                    </p>
                </div>
            </div>
        </div>
    </div>
    )
}