import React, { useMemo, useState, useEffect, useCallback } from 'react';

// 조회성 x
// 기본 사용자 정보: common <- 장바구니 or 메뉴 상세(바로 주문)

export const orderInfo = {
    DP: "픽업",
    UserAddress: "서울시 구로구",
    MarketInfo: {
                MarketName: "카페 드롭탑 신도림점",
                MarketAddr: "서울시 영등포구 영등포로 143"
                },
    "주문자 정보": "서울시 구로구 구로동 3-25 신도림테크노마트",
   
    "주문 메뉴": [
                    {"메뉴명": "오곡라떼",
                    "수량": 2, 
                    "옵션": ["펄 기본", "휘핑크림"],
                    "가격": 6400
                    }
                ],
    "배달팁": "2500",
    "할인 혜택": {
                "추가 할인": "500"
                },
}

const MakeOrder = () => {

    const [payMethod, setPayMethod] = useState("");

    const activePayMethod = useCallback((method) => {
        if(method === payMethod)
            return "active";
        else return "";

        console.log("setPayMethod");
    })

    useEffect(() => {
        console.log(payMethod); 
    }, [payMethod]);

    return (
        <>
            <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a href="#" className="icon pageBack">Back</a>
                </div>            
                <div className="middleArea">
                    <h1 className="headerTitle">배달 주문하기</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="rowSection">
                    <div className="infoCard">
                        <h2 className="title">주문자 정보</h2>
                        <div className="descBox">
                            <p className="descInfo">
                                서울시 구로구 구로동 3-25 신도림테크노마트
                            </p>
                            <div className="descInput">
                                <label className="textInput" >
                                    <input type="text" title="상세주소" placeholder="상세주소를 입력하세요" />
                                </label>
                                <label className="textInput">
                                    <input type="text" title="전화 번호" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sectionBlock"></div>
                <div className="rowSection">
                    <div className="infoCard">
                        <h2 className="title">요청사항</h2>
                        <div className="descBox">
                            <p className="descInfo">매장에 요청해요~</p>
                            <div className="descInput">
                                <label className="textInput" >
                                    <input type="text" title="요청 사항" placeholder="예) 얼음 조금만 넣어주세요." />
                                </label>
                            </div>
                            <div className="descInput">
                                <label className="checkSelect">
                                    <input type="checkbox"/> <span className="dCheckBox">일회용품 줄이기</span>
                                    <span className="checkInfo">일회용 수저, 포크 안 주셔도 돼요~</span>
                                </label>
                                
                            </div>
                        </div>
                        <div className="descBox">
                            <p className="descInfo">라이더에게 요청해요~</p>
                            <div className="descInput">
                                <label className="textInput" >
                                    <input type="text" title="요청 사항" placeholder="예) 집 앞에 두고 가세요~" />
                                </label>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="sectionBlock"></div>
                <div className="rowSection">
                    <div className="historyCard">
                        <h2 className="title">주문내역</h2>
                        <ul className="historyList">
                            <li>
                                <span className="name">
                                    오곡라떼 x 2
                                    <span className="options">펄 기본, 휘핑크</span>
                                </span>
                                <span className="amount">12,800원</span>
                            </li>
                            <li>
                                <span className="name">
                                    배달팁
                                    <a href="#"><span className="icon questionMark">?</span></a>
                                </span>
                                <span className="amount">2,500원</span>
                            </li>
                        </ul>
                        <h2 className="title">할인혜택</h2>
                        <ul className="historyList">
                            <li>
                                <span className="name">추가 할인</span>
                                <span className="amount">500원</span>
                            </li>
                        </ul>
                        <h2 className="title">결제금액</h2>
                        <ul className="historyList">
                            <li>
                                <span className="name">
                                    주문금액
                                </span>
                                <span className="amount">9,600원</span>
                            </li>
                            <li>
                                <span className="name">
                                    할인금액
                                </span>
                                <span className="amount">-500원</span>
                            </li>
                        </ul>
                        <div className="historyTotal">
                            <span className="name">총 결제금액</span>
                            <span className="amount">9,100원</span>
                        </div>
                    </div>
                </div>
                <div className="sectionBlock"></div>
                <div className="rowSection">
                    <div className="infoCard">
                        <h2 className="title">결제방법</h2>
                        <div className="payWayList">
                            <ul className="payWay">
                                {/* <!-- active 클래스 추가 --> */}
                                <li className="active">
                                    <a href="#">신용카드</a>
                                </li>
                                <li>
                                    <a href="#">휴대폰 결제</a>
                                </li>
                                <li>
                                    <a href="#">계좌이체</a>
                                </li>
                                <li>
                                    <a href="#">가상계좌</a>
                                </li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
                <div className="rowSection">
                    <div className="agreeBox">
                        <ul className="agreelist">
                            <li>
                                <span>
                                    이용약관 및 동의
                                </span>
                                <a href="#" className="viewList">내용보기</a>
                            </li>
                            <li>
                                <span>
                                    개인정보 수집 및 이용동의
                                </span>
                                <a href="#" className="viewList">내용보기</a>
                            </li>
                            <li>
                                <span>
                                    개인정보 제3자 제공동의
                                </span>
                                <a href="#" className="viewList">내용보기</a>
                            </li>
                            <li>
                                <span>
                                    위치기반서비스약관
                                </span>
                                <a href="#" className="viewList">내용보기</a>
                            </li>
                            <li>
                                <span>
                                    전자금융거래 이용약관
                                </span>
                                <a href="#" className="viewList">내용보기</a>
                            </li>
                        </ul>
                        <label className="checkSelect">
                            <input type="checkbox"/> <span className="dCheckBox">위의 내용을 확인하였으며 결제에 동의합니다.</span>
                        </label>
                    </div>
                </div>
                <div className="fixedBtn flex3half1">
                    <a href="#" className="btn addOrder">18,200원 주문하기 </a>
                </div>
            </div>
        </div>


    </div>
        </>
    );
};

export default function OrderSection() {
    return (
        <>
            <MakeOrder/>
        </>
    );
};

export const PickComp1 = (render) => {

    if(!render) return null;
    else {
        return (
            <>
                <div className="sectionBlock"></div>
                <div className="rowSection">
                    <div className="infoCard">
                        <h2 className="title">매장 정보</h2>
                        <div className="descBox">
                            <p className="descInfo">
                                카페 드롭탑 신도림점
                            </p>
                            <p className="descInfoSmall">
                                서울시 영등포구 영등포로 143
                                <button type="button" className="btn borderBtn btnSmall">주소복사</button>
                            </p>
                        </div>
                    </div>
                </div>
            </>
            );
    }
}

export const PickComp2 = (render) => {

    if(!render) return null;
    else {
        return (
            <>
                <div className="sectionBlock"></div>
                <div className="rowSection">
                    <p className="pickInfoMsg">
                        고객님께서는 픽업 주문을 하고 계십니다.<br />
                        매장으로 직접 방문해주세요~
                    </p>
                </div>
            </>
            );
    }
}
