import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as API from '../../../Api'
import * as ACTION from '../../../common/ActionTypes'
import { getCartCnt, pullDefaultAddress, unescapehtmlcode, numberFormat, pullCartData, changeShowToast, 
  changeOrderType, makeParamForCreateOrder, pushShowScreen, pullShowScreen, removeCartDataAll } from '../../../util/Utils'
// Version >= 2.4.0
import 'swiper/css/swiper.css';

import Review from './review';
import Menu from './menu';
import Info from './info';

import {SDLContext} from '../../../context/SDLStore'

const scrollFun = () =>{

  let herder = document.querySelector("#wrap.detailLayout");
  if(herder){
    let infoTitleTop = document.querySelector('.detailInfo .infoTitle').getBoundingClientRect().top;
    let detailMenu = document.querySelector('.detailMenu');
    const startScrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;    
    const scrollStart = () =>{     
      let menuTop = detailMenu.offsetTop; 
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      if (scrollTop > infoTitleTop && scrollTop > (startScrollTop - Math.abs(infoTitleTop))) {
        herder.classList.add("fixedMenu")
      }else{
        herder.classList.remove("fixedMenu")
      }      
      if (scrollTop > menuTop - 47) {
        detailMenu.classList.add('fixedMenu')
      }else{
        detailMenu.classList.remove('fixedMenu')
      }
    }
    window.addEventListener("scroll", scrollStart);
  }
  
}

const moreMsg = () =>{
  var moreBtn = document.querySelectorAll('.fnMoreBtn')
  // var moreMenu = document.querySelectorAll('.listTitle')
  var tabMenu = document.querySelectorAll('.detailMenu .menuTab li')
  var tabContent = document.querySelectorAll('.detailMenu .tebContent')
  var infoChoiceTab = document.querySelectorAll('.infoChoice .fnTabMenu li')
  var infoChoiceCon = document.querySelectorAll('.infoChoice .tebContent')
  
  moreBtn.forEach((v)=>{
    v.addEventListener("click", function(e){
      e.preventDefault()
      this.classList.toggle('active')
      this.previousSibling.classList.toggle('active')
    })
  })

  infoChoiceTab.forEach((v) =>{
    v.addEventListener('click', function(e){
      e.preventDefault();
      for(let siblings of this.parentNode.children){
        siblings.classList.remove('active')
      }
      for(let siblingsContent of infoChoiceCon){
        siblingsContent.classList.remove('active')
      }
      var cdx = document.querySelector(this.children[0].hash)
      this.classList.add('active')
      cdx.classList.add('active')
    })
  })

  tabMenu.forEach((v) =>{
    v.addEventListener('click', function(e){

      e.preventDefault();

      for(let siblings of this.parentNode.children){
        siblings.classList.remove('active')
      }
      
      for(let siblingsContent of tabContent){
        siblingsContent.classList.remove('active')
      }

      var cdx = document.querySelector(this.children[0].hash)
      this.classList.add('active')
      cdx.classList.add('active')
      window.scrollTo({
        top: cdx.offsetTop - 92
      })
    })
  })
}

// copyAddress_store classname을 가진 태그의 값을 클립보드로 복사
const copyMsg = (e) =>{
  var copyAddress = document.querySelector(".copyAddress_store").innerText
  var tempElem = document.createElement("textarea")
  document.body.appendChild(tempElem)
  tempElem.value = copyAddress;
  tempElem.select();
  document.execCommand("copy")
  document.body.removeChild(tempElem)
}

const toastCallback = (data) => {
  data.dispatch({type : 'TOAST', payload : {show : false }})
}

export default ({ history, location }) => {

  const data = location.state;   

  const {dispatch} = useContext(SDLContext);

  const onClickBackBtn = (e) => {
    e.preventDefault();

    if(getCartCnt() > 0) {
      dispatch({
        type : 'MODAL', 
        payload : {show : true , data : {type : 'CONFIRM_POP', title: '', desc : '매장 이동을 원하십니까? 장바구니에 담긴 메뉴는 모두 삭제됩니다.'} ,
        callback : (res) => {
          if(res){
            removeCartDataAll()
            history.goBack();
            dispatch({type : 'MODAL', payload : {show : false}})
          }else{
            dispatch({type : 'MODAL', payload : {show : false}})
          }
        }
      }})
    }
    else {
      history.goBack();
    }
  };
  
  const [resultInfoData, setResultInfoData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [balloon, setBalloon] = useState(null)
  
  const pullShowScreenData = pullShowScreen()
  let cartOrderType = null;
  
  useEffect (() => {
    const defaultAddress = pullDefaultAddress()
    const latitude = defaultAddress.y;
    const longitude = defaultAddress.x;

    let calc = 0;
    let cartData = pullCartData();

    if(cartData.showToast) {
      dispatch({type : 'TOAST', payload : {show : true , data : {msg: '장바구니에 담겼습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
      changeShowToast(false)
    }

    if(Object.keys(cartData).length > 0) {
      cartData.menus.map((menuList) => {
          calc += menuList.totalPrice * menuList.count
      })
  
      setTotalPrice(calc)
      setTotalCount(cartData.menus.length)
      cartOrderType = cartData.orderType;
    }

    const screenData = {
      bizCtgDtl : pullShowScreenData.bizCtgDtl,
      orderType : "",
      searchKeyword : pullShowScreenData.searchKeyword
    }

    // 한개의 매장 정보 조회
    API.getStores(latitude, longitude, "", "", "", location.state.strId)
    .then((data)=>{
        setResultInfoData(data.data)
        
        screenData.orderType = pullShowScreenData.orderType === 0 ? 
          data.data[0].dlvYn === "N" && data.data[0].pickYn === "Y" ? 1 : 0
          :
          pullShowScreenData.orderType 
        pushShowScreen(screenData)
    
        if(cartOrderType !== null) {
          setBalloon(cartOrderType === 0 ? true : false)
        }
        else if(data.data[0].dlvYn === "Y") {
          setBalloon(true)
        }
        else if(data.data[0].pickYn === "Y") {
          setBalloon(false)
        }
        moreMsg()
        scrollFun()
    })
    .catch((error) => {
        setResultInfoData([]);
    })
  }, []);
  
  const handleClick = () => {
    dispatch({type : 'TOAST', payload : {show : true , data : {msg: '주소가 복사되었습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
    copyMsg()
  };

  const toggleLiked = (e) =>{
      e.preventDefault();
      e.currentTarget.classList.toggle('active')
      var storeCd = ''

      // 일반 매장
      if(location.state.bizCtgDtl != '2029') {
        storeCd = 'S'
      } else storeCd = 'R'

      // 찜 등록
      if(e.currentTarget.classList.length > 2)
          API.storeDipAdd(storeCd, resultInfoData[0].strId)
      // 찜 삭제
      else
          API.storeDipdel(storeCd, resultInfoData[0].strId)
        
  }

  const doOrder = (balloon) => {

    const menuData = pullCartData();

    console.log('Store detail cart data', menuData)
    const addressData = pullDefaultAddress()
    const param = makeParamForCreateOrder(menuData,addressData)

    API.createOrder(param)
    .then((res)=>{

        // "code": 1,
        // "msg": "성공",
        // "data": {
        //     "partnerId": "MB0000020836",      //NonPg 파트너 아이디
        //     "nonPgPartnerCd": "BAA161",         //NonPg 파트너 코드
        //     "nonPgMerchantCd": "116814393902",   //NonPg 상정 코드
        //     "strPayTyp": "P9",               //매장결제타입(P7:PG, P8:전자상거래, P9:NonPG)
        //     "use2icpFg": "1",               //픽업선불 사용여부
        //     "use9icpFg": "1",               //배달선불 사용여부
        //     "use9icaFg": "0",               //배달후불(카드) 사용여부
        //     "use9icmFg": "0",               //배달후불(현금) 사용여부
        //     "ordrId": "00000000056857",         //주문번호
        //     "ordrPrc": "21500",               //주문금액
        //     "dlPrc": "1000",               //배달금액
        //     "discPrc": "0",                  //할인금액
        //     "payPrc": "22500"               //결제금액
        // }

        if(res.code === 1){

            const orderFormData = {
                addressData : addressData,
                menuData : menuData,
                orderData : res.data
            }

            console.log('Store detail create oreder data', orderFormData)

            history.push({
                pathname: ACTION.LINK_ORDER_FORM,
                state: { data: orderFormData , isFromCart : true }
            })
        }
        
    }).catch((err)=>{

      dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch} , callback : toastCallback}})
    // 주문생성 code 값별 오류졸류
    // =========================================
    // -1, "영업중인 매장이 아닙니다."
    // -2, "최소주문 금액을 채워주세요."
    // -3, "최대 주문수량을 초과하였습니다."
    // -4, "배달 가능한 지역이 아닙니다."
    // -5, "주문 가능한 상품이 없습니다."
    // -6, "추가상품만 주문할 수 없습니다."
    // -7, "비회원은 주류 구입이 불가합니다."
    // -8, "미성년자는 주류구입이 불가합니다."
    // -9, "주류 구매를 하시려면 연 1회 본인 인증이 필요합니다." (소셜회원)
    // -10, "주류는 음식값보다 초과 주문이 불가합니다."
    // -11, "주문금액이 틀립니다."
    })

}



  if(resultInfoData !== null && Object.keys(resultInfoData).length !== 0) {
    const thumImgUrl = 'http://images.kisvan.co.kr/smartorder/' + resultInfoData[0].imgModNm
    return (
      <>
        <div id="wrap" className="detailLayout">
          
          <div id="header">
            <div className="headerTop">
              <div className="leftArea">
                <a href="#" className="icon pageBack" onClick={onClickBackBtn}>Back</a>
              </div>
              <div className="middleArea">
                <h1 className="headerTitle">{unescapehtmlcode(resultInfoData[0].strNm)}</h1>
              </div>
              <div className="rightArea">
                <CartComponent/>
              </div>
            </div>
          </div>
          <div id="container">
            <div id="content">
              <div>

                {
                  location.state.bizCtgDtl === "2029"
                  ?
                  <>
                  <div className="detailView">
                    <div className="imgView">
                      <img src={thumImgUrl} />
                    </div>
                    <div className="detailInfo">
                      <div className="inner">
                        <div className="infoLabel">
                          {resultInfoData[0].dlvYn === "Y" ? <span className="deli">배달</span> : null}
                          {resultInfoData[0].pickYn === "Y" ?<span className="pick">픽업</span> : null}
                        </div>
                        <h1 className="infoTitle">{unescapehtmlcode(resultInfoData[0].strNm)}</h1>
                        <div className="infoShare">
                          <button type="button" className="btn like" onClick={toggleLiked}>찜</button>
                          <button type="button" className="btn share">공유</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="detailDesc">
                    <div className="infoChoice">
                      <div className="tebContent active">
                        <ul className="tabList">
                          <li>
                            <span className="title">위치안내</span>
                            <span className="desc">{resultInfoData[0].strAddr}{resultInfoData[0].strAddrDtl}</span>
                          </li>
                          <li>
                            <span className="title">운영시간</span>
                            <span className="desc">{resultInfoData[0].svcStaDtm} ~ {resultInfoData[0].svcEndDtm}</span>
                          </li>
                          <li>
                            <span className="title">휴무일</span>
                            <span className="desc">ex)연중휴무</span>
                          </li>
                          <li>
                            <span className="title">전화번호</span>
                            <span className="desc">{resultInfoData[0].repCnct}</span>
                          </li>
                          <li>
                            <span className="title">결제방법</span>
                            <span className="desc">ex)바로 결제</span>
                          </li>                          
                        </ul>
                      </div>
                    </div>
                  </div>
                  </>
                  :
                  <>
                  <div className="detailView">
                    <div className="imgView">
                      <img src={thumImgUrl} />
                    </div>
                    <div className="detailInfo">
                      <div className="inner">
                        <div className="infoLabel">
                          {resultInfoData[0].dlvYn === "Y" ? <span className="deli">배달</span> : null}
                          {resultInfoData[0].pickYn === "Y" ?<span className="pick">픽업</span> : null}
                        </div>
                        <h1 className="infoTitle">{unescapehtmlcode(resultInfoData[0].strNm)}</h1>
                        {/* <div>
                          <p className="infoRating">
                            <span className="star"></span>
                            <span className="star"></span>
                            <span className="star"></span>
                            <span className="star"></span>
                            <span className="star"></span>
                            <strong className="number">{resultInfoData[0].avrgStarPnt}</strong>
                          </p>
                          <div className="infoReview">
                            <span>리뷰 {resultInfoData[0].rvwCnt === "" ? "0" : resultInfoData[0].rvwCnt}</span>
                            <span>사장님 댓글  ex)345</span>
                          </div>
                        </div>
                        <div className="infoShare">
                          <button type="button" className="btn like" onClick={toggleLiked}>찜</button>
                          <button type="button" className="btn share">공유</button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="detailDesc">
                    <div className="infoChoice">
                      <ul className="tabMenu fnTabMenu">
                        {
                          resultInfoData[0].dlvYn === "Y" && resultInfoData[0].pickYn === "Y" ?
                          <>
                          <li className="deli active"><a href="#tab_option_01">배달</a></li>
                          <li className="pick"><a href="#tab_option_02">픽업</a></li> 
                          </>
                          :
                          null
                        }
                      </ul>

                      {resultInfoData[0].dlvYn === "Y" ? 
                        <div className="tebContent active" id="tab_option_01">
                          <ul className="tabList">
                            {
                              numberFormat(resultInfoData[0].dlMinOrdrPrc) === 0 ? null :
                              <li>
                                <span className="title">최소주문</span>
                                <span className="desc">{numberFormat(calcMinOderPrice(resultInfoData[0]))}원</span>
                              </li>
                            }
                            {
                              resultInfoData[0].yn9icp === "N" &&
                              resultInfoData[0].yn9ica === "N" &&
                              resultInfoData[0].yn9icm === "N" ? null :
                              <li>
                                <span className="title">결제방법</span>
                                <span className="desc">
                                  {resultInfoData[0].yn9icp === "Y" ? "바로결제" : null}
                                  {resultInfoData[0].yn9ica === "Y" ? ", 만나서 카드결제" : null}
                                  {resultInfoData[0].yn9icm === "Y" ? ", 만나서 현금결제" : null}
                                </span>
                              </li>
                            }
                            {
                              resultInfoData[0].expDlvTm === 0 ? null :
                              <li>
                                <span className="title">배달시간</span>
                                <span className="desc">
                                  {resultInfoData[0].expDlvTm}분 소요 예상
                                  <span className="icon questionMark" onClick={() => {clickedQ(dispatch)}}>?</span>
                                </span>
                              </li>
                            }
                            {
                              Number(resultInfoData[0].dlPrc1) === 0 && Number(resultInfoData[0].dlPrc2) === 0 && Number(resultInfoData[0].dlPrc3) === 0 ?
                              null :
                              <li>
                                <span className="title">배달팁</span>
                                {
                                  Number(resultInfoData[0].dlPrc3) !== 0
                                  ?
                                  <span className="desc">{numberFormat(resultInfoData[0].dlPrc3)}원 ~ {numberFormat(resultInfoData[0].dlPrc1)}원</span>
                                  :
                                  Number(resultInfoData[0].dlPrc2) !== 0
                                  ?
                                  <span className="desc">{numberFormat(resultInfoData[0].dlPrc2)}원 ~ {numberFormat(resultInfoData[0].dlPrc1)}원</span>
                                  :
                                  <span className="desc">{numberFormat(resultInfoData[0].dlPrc1)}원</span>
                                }                         
                              </li>
                            }
                            {/* {
                              resultInfoData[0].discRateUseFg === "0" || resultInfoData[0].discRateUseFg === "" ? null :
                              <li>
                                <span className="title">할인혜택</span>
                                <span className="desc">추가할인 {numberFormat(resultInfoData[0].discRate)}%</span>
                              </li>
                            } */}
                          </ul>
                        </div>
                      : null}
                      {
                        resultInfoData[0].pickYn === "Y" ?
                        <div className={
                          resultInfoData[0].dlvYn === "Y" && resultInfoData[0].pickYn === "Y" ? 
                          "tebContent" :
                          "tebContent active"
                        } id="tab_option_02">
                          <ul className="tabList">
                            <li>
                              <span className="title">위치안내</span>
                              <span className="desc">
                                <span className="copyAddress_store">{unescapehtmlcode(resultInfoData[0].strAddr)}
                                {unescapehtmlcode(resultInfoData[0].strAddrDtl)}</span>
                                <span className="moreFun">
                                  <button type="button" className="btn default" onClick={() => {
                                    var address = document.querySelector(".copyAddress_store").innerText
                                    
                                    history.push({pathname: ACTION.LINK_MARKET_DETAIL_MAP
                                                , address: address
                                                , storeNm: resultInfoData[0].strNm})
                                  } }>위치확인</button>
                                  <button type="button" onClick={handleClick} className="btn default">주소복사</button>
                                </span>
                              </span>
                            </li>
                            {
                              resultInfoData[0].yn2icp === "N" ? null :
                              <li>
                                <span className="title">결제방법</span>
                                <span className="desc">
                                  {resultInfoData[0].yn2icp === "Y" ? "바로결제" : null}
                                </span>
                              </li>
                            }
                            {/* {
                              resultInfoData[0].discRateUseFg === "0" || resultInfoData[0].discRateUseFg === "" ? null:
                              <li>
                                <span className="title">할인혜택</span>
                                <span className="desc">추가할인 {numberFormat(resultInfoData[0].discRate)}%</span>
                              </li>
                            } */}
                          </ul>
                        </div>
                        : null
                      }
                    </div>
                    {
                      resultInfoData[0].strEtc === "" ? null :
                      <div className="infoTalk">
                        <h2 className="title">사장님 이야기</h2>
                        <div className="dsec">
                          <p className="descMsg fnMoreContent">{(unescapehtmlcode(resultInfoData[0].strEtc))}</p>
                          <button type="button" className="msgMore fnMoreBtn">더보기</button>
                        </div>
                      </div>
                    }
                  </div>
                  </>
                }
                
                <div className="sectionBlock"></div>
                <div className="detailMenu">
                  {
                    location.state.bizCtgDtl === "2029"
                    ?
                    null
                    :
                    <>
                    <ul className="menuTab fnTabMenu">
                      <li className="active"><a href="#menu_cont">메뉴</a></li>
                      <li><a href="#info_cont">정보</a></li>
                      {/* <li><a href="#review_cont">리뷰</a></li> */}
                    </ul>
                    </>
                  }

                  <div className="tebContent menuContent active" id="menu_cont">
                    <Menu strId = {location.state.strId} 
                          strNm = {resultInfoData[0].strNm} 
                          strAddr= {resultInfoData[0].strAddr}
                          dlMinOrdrPrc = {resultInfoData[0].dlMinOrdrPrc}
                          dlMinOrdrPrc9icp = {resultInfoData[0].dlMinOrdrPrc9icp}
                          dlMinOrdrPrc9ica = {resultInfoData[0].dlMinOrdrPrc9ica}
                          dlMinOrdrPrc9icm = {resultInfoData[0].dlMinOrdrPrc9icm} 
                          prdOrgn={resultInfoData[0].prdOrgn}
                          bizCtgDtl ={location.state.bizCtgDtl} 
                          orderType={balloon ? 0 : 1}/>
                  </div>

                  <div className="tebContent infoContent" id="info_cont">
                    <Info strId = {location.state.strId} dlvYn={resultInfoData[0].dlvYn} />
                  </div>

                  {/* <div className="tebContent reviewContent" id="review_cont">
                    <Review></Review>
                  </div> */}
                </div>
                <div>
                  {
                    resultInfoData[0].pickYn === "Y" && resultInfoData[0].dlvYn === "Y" ?
                    pullShowScreenData.orderType ? 
                    <button className="balloonBtn deli" onClick={() => {
                      changeBalloonButton(setBalloon, true, changeOrderType, 0, pullShowScreenData.bizCtgDtl, pullShowScreenData.searchKeyword)}}>
                        배달전환
                    </button> :
                    <button className="balloonBtn pick" onClick={() => {
                      changeBalloonButton(setBalloon, false, changeOrderType, 1, pullShowScreenData.bizCtgDtl, pullShowScreenData.searchKeyword)}}>
                        픽업전환
                    </button>
                    :
                    null
                  }
                </div>
                {
                  totalCount !== 0 && totalCount !== undefined ? 
                  <div className="fixedBtn flex3half1">
                    <a className="btn infoMsg addOrder" 
                    onClick = {()=>{doOrder(balloon)}} > <span>{numberFormat(totalPrice)}원 주문하기 <span className="numberMsg">{totalCount}</span></span> </a>
                  </div>
                  :
                  null
                }
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }else{
    return null
  }

};



const CartComponent = () => {
  const cnt = getCartCnt()
  return (
    cnt !== 0 ?
    <Link to={{pathname: ACTION.LINK_CART}} className="icon orderCart">
      장바구니
      <span className="cartNum">{cnt}</span>
    </Link>
    :
    null
  )
}

function clickedQ (dispatch) {
  dispatch({type : 'TOAST', payload : {show : true , data : {msg: '실제 배달시간과는 차이가 있을 수 있습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
}

function changeBalloonButton(setBalloon, BalloonData, changeOrderType, OrderTypeData, bizCtgDtl, searchKeyword) {

  const data = {
    bizCtgDtl : bizCtgDtl,
    orderType : OrderTypeData,
    searchKeyword : searchKeyword
  }
  pushShowScreen(data)

  setBalloon((prev) => {
    return !prev
  });
  changeOrderType(OrderTypeData)
}

const calcMinOderPrice = (cartData) => {

    const dlMinOrdrPrc9icp = cartData.dlMinOrdrPrc9icp
    const dlMinOrdrPrc9ica = cartData.dlMinOrdrPrc9ica
    const dlMinOrdrPrc9icm = cartData.dlMinOrdrPrc9icm

    const arr = [Number(dlMinOrdrPrc9icp),Number(dlMinOrdrPrc9ica),Number(dlMinOrdrPrc9icm)]

    return Math.max.apply(null, arr);
}