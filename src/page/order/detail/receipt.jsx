import React from 'react'

export default ({history})  => {

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack()
    };

    return (
        <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a onClick={onClickBackBtn} className="icon pageClose">CLOSE</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">전자 영수증</h1>
                </div>
                <div className="rightArea">
                    <a href="#" className="icon delCart">
                        영수증받기
                    </a>
                </div>
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
                                    도미노피자 신도림점
                                </span>
                            </li>
                            <li>
                                <span className="leftCell">
                                    문의처
                                </span>
                                <span className="rightCell">
                                    02-3456-7890
                                </span>
                            </li>
                            <li>
                                <span className="leftCell">
                                    주소
                                </span>
                                <span className="rightCell">
                                    서울시 구로구 새말로 27
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
                                <span className="rightCell">2020년 05월 08일 16:00:25</span>
                            </li>
                            <li>
                                <span className="leftCell">결제 수단</span>
                                <span className="rightCell">신용카드</span>
                            </li>
                            <li>
                                <span className="leftCell">결제 카드</span>
                                <span className="rightCell">BC카드</span>
                            </li>
                            <li>
                                <span className="leftCell">결제 구분</span>
                                <span className="rightCell">일시불</span>
                            </li>
                            <li>
                                <span className="leftCell">승인 번호</span>
                                <span className="rightCell">12345678</span>
                            </li>
                            {/* <!-- 수정 ver.01 0603 주문 취소 cancleItem 추가 --> */}
                            <li className="payResult">
                                <span className="leftCell"><strong>결제 금액</strong></span>
                                <span className="rightCell"><strong>85,700원</strong></span>
                            </li>
                            <li>
                                <span className="leftCell">공급가</span>
                                <span className="rightCell">80,000원</span>
                            </li>
                            <li>
                                <span className="leftCell">부가세</span>
                                <span className="rightCell">5,700원</span>
                            </li>
                            {/* <!-- 수정 ver.01 0603 주문 취소 cancleItem 클래스 추가 추가 --> */}
                            <li className="payResult cancleItem">
                                <span className="leftCell"><strong>결제 금액</strong></span>
                                <span className="rightCell"><strong>-85,700원</strong></span>
                            </li>
                            <li className="cancleItem">
                                <span className="leftCell">공급가</span>
                                <span className="rightCell">-80,000원</span>
                            </li>
                            <li className="cancleItem">
                                <span className="leftCell">부가세</span>
                                <span className="rightCell">-5,700원</span>
                            </li>
                        </ul>
                    </div>
                    <div className="sectionBlock"></div>
                    <div className="orderInfoList typeResult">
                        <h2 className="listTitle">품목 정보</h2>
                        <ul className="infoLIst">
                            <li>
                                <span className="leftCell">
                                    오곡라떼 x 2
                                    <span className="options">펄 기본, 휘핑크림</span>
                                </span>
                                <span className="rightCell">
                                    <strong>12,800원</strong>
                                </span>
                            </li>
                            <li>
                                <span className="leftCell">
                                    오곡라떼 x 2
                                    <span className="options">펄 기본, 휘핑크림</span>
                                </span>
                                <span className="rightCell">
                                    <strong>12,800원</strong>
                                </span>
                            </li>
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