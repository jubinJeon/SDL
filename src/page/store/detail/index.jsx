import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import * as API from '../../../Api'
import * as ACTION from '../../../common/ActionTypes'
import { getCartCnt, pullDefaultAddress, unescapehtmlcode, numberFormat, pullCartData, changeShowToast, 
  changeOrderType, makeParamForCreateOrder, pushShowScreen, pullShowScreen, removeCartDataAll, tmFormat } from '../../../util/Utils'
import { SDL_dispatchCallPhone } from '../../../appBridge'
// Version >= 2.4.0
import 'swiper/css/swiper.css';

import Review from './review';
import Menu from './menu';
import Info from './info';

import {SDLContext} from '../../../context/SDLStore'
import {REDUCER_ACTION} from '../../../context/SDLReducer'

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
  data.dispatch({type : REDUCER_ACTION.HIDE_TOAST})

  if(data.code === -4){
    if(data.sdlContextData.channel.channelUIType === 'C'){
      data.dispatch({type: REDUCER_ACTION.INIT_DELIVERY_ADDRESS})
    }
  }
  
}

export default ({ history, location }) => {


  const {dispatch,data} = useContext(SDLContext);

  const onClickBackBtn = (e) => {
    e.preventDefault();

    dispatch({type:REDUCER_ACTION.HISTORY_BACK})

  };
  
  const [resultInfoData, setResultInfoData] = useState(null);
  const [resultDetailData, setResultDetailData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [balloon, setBalloon] = useState(null)
  
  const pullShowScreenData = pullShowScreen()
  let cartOrderType = null;
  
  const [thumImgUrl, setThumImgUrl] = useState(null)
  const [star, setStart] = useState(null)
  
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
      bizCtgGrp : pullShowScreenData.bizCtgGrp,
      orderType : "",
      searchKeyword : pullShowScreenData.searchKeyword
    }
    
    if (location.state.storeCd === "R") {
      // 한개의 휴게소 매장 상세 정보 조회
      API.getRestDetails(location.state.strId)
      .then((data)=>{
        setResultInfoData(data.data)

        setThumImgUrl(data.data.bsnInfoVo.imgModNm)
          
        screenData.orderType = 1
        pushShowScreen(screenData)
        
        moreMsg()
        scrollFun()
      })
      .catch((error) => {
        setResultDetailData([]);
      })
    }
    else {
      // 한개의 매장 정보 조회
      API.getStores(latitude, longitude, "", "", "", location.state.strId)
      .then((data)=>{
          setResultInfoData(data.data)

          setThumImgUrl(data.data[0].imgModNm)
          setStart(Math.round(data.data[0].avrPoints))
          
          screenData.orderType = pullShowScreenData.orderType === 0 || pullShowScreenData.orderType == undefined ? 
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
    }
  }, []);

  useEffect(()=>{

    if(resultInfoData !== null){
        if(data.channel.channelUIType === 'C' && data.channel.hasDeliveryAddress === true){
            doOrder(data)
        }
    }
},[resultInfoData])
  
  const handleClick = () => {
    dispatch({type : 'TOAST', payload : {show : true , data : {msg: '주소가 복사되었습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
    copyMsg()
  };

  // 일반 매장 찜
  const toggleLiked = (e) => { 
      e.preventDefault();
      e.currentTarget.classList.toggle('active')
      var storeCd = 'S'

      // 찜 등록
      if(e.currentTarget.classList.length > 2)
          API.storeDipAdd(storeCd, resultInfoData[0].strId)
      // 찜 삭제
      else
          API.storeDipdel(storeCd, resultInfoData[0].strId)
        
  }

  // 휴게소 찜
  const toggleLiked_rest = (e) => { 
      e.preventDefault();
      e.currentTarget.classList.toggle('active')
      var storeCd = 'R'

      // 찜 등록
      if(e.currentTarget.classList.length > 2)
          API.storeDipAdd(storeCd, location.state.strId)
      // 찜 삭제
      else
          API.storeDipdel(storeCd, location.state.strId)
        
  }
  
  const doOrder = (sdlContextData) => {

    const menuData = pullCartData();

    let check = 1
    let nomalPrice = 0
    let adultPrice = 0

    menuData.menus.map((menu) => {
        if(menu.adultPrdFg != 1) {
            check =  0
            nomalPrice += menu.totalPrice * menu.count
        } else {
            adultPrice += menu.totalPrice * menu.count
        }
    })

    if(check) {
        dispatch({type : 'TOAST', payload : {show : true , data : {msg: '주류만 주문이 불가합니다. 다른 메뉴를 추가해주세요.', code : 'linkCart', dispatch : dispatch, history : history} , callback : toastCallback}})
        return true
    }else if(adultPrice > nomalPrice) {
        dispatch({type : 'TOAST', payload : {show : true , data : {msg: '주류는 음식값보다 초과 주문이 불가합니다.', code : 'linkCart', dispatch : dispatch, history : history} , callback : toastCallback}})
        return true
    }
    
    console.log('Store detail cart data', menuData)
    const addressData = pullDefaultAddress()
    

    const deliverySettingToastCallback = (data) => {
      data.dispatch({type: REDUCER_ACTION.HIDE_TOAST})
      history.replace({pathname: ACTION.LINK_ADDRESS_SETTING, state : {headerTitle : '배달주소설정', from : location}})
    }

    if(sdlContextData.channel.channelUIType === 'C' && sdlContextData.channel.hasDeliveryAddress === false){

      dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '배달주소를 설정하여주세요.', code : 'linkCart', dispatch : dispatch, history : history} , callback : deliverySettingToastCallback}})

  }else{

    const param = makeParamForCreateOrder(menuData, addressData)
      API.createOrder(param)
      .then((res)=>{
          if(res.code === 1){

              const orderFormData = {
                  addressData : addressData,
                  menuData : menuData,
                  orderData : res.data
              }

              console.log('Store detail create oreder data', orderFormData)

              history.replace({
                  pathname: ACTION.LINK_ORDER_FORM,
                  state: { data: orderFormData , isFromCart : true,from : location }
              })
          }
          
      }).catch((err)=>{

        if(err.response.data.code === -7) {
          dispatch({
            type : REDUCER_ACTION.SHOW_MODAL, 
            payload : {data : {type : 'LOGIN'} ,
            callback : (res) => {
              if(res){
                dispatch({type : REDUCER_ACTION.HIDE_MODAL})
              }else{
                dispatch({type : REDUCER_ACTION.HIDE_MODAL})
              }
            }
          }})
        } else if(err.response.data.code === -4){
            dispatch({type:REDUCER_ACTION.INIT_DELIVERY_ADDRESS})
            dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch, history : history, location : location, sdlContextData: sdlContextData} , callback : toastCallback}})
        } else {
          dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch} , callback : toastCallback}})
        }
      })
    }
  }

// && Object.keys(resultInfoData).length !== 0
  if(resultInfoData !== null) {
    return (
      <>
        <div id="wrap" className="detailLayout">
          
          <div id="header">
            <div className="headerTop">
              <div className="leftArea">
                <a href="#" className="icon pageBack" onClick={onClickBackBtn}>Back</a>
              </div>
              <div className="middleArea">
                <h1 className="headerTitle">
                  {location.state.storeCd === "R" ? unescapehtmlcode(resultInfoData.bsnInfoVo.strNm) : unescapehtmlcode(resultInfoData[0].strNm)}
                </h1>
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
                  location.state.storeCd === "R"
                  ?
                  <>
                  <div className="detailView">
                    <div className="imgView">
                      <img src={thumImgUrl} onError={(e)=>{e.target.onerror = null; e.target.src="/common/images/no_image.png"}} />
                    </div>
                    <div className="detailInfo">
                      <div className="inner">
                        <div className="infoLabel">
                          <span className="pick">픽업</span>
                        </div>
                        <h1 className="infoTitle">{unescapehtmlcode(resultInfoData.bsnInfoVo.strNm)}</h1>
                        <div className="infoShare">
                          <button type="button" className={resultInfoData.bsnInfoVo.dipStrYn === "Y" ? "btn like active" : "btn like"} onClick={toggleLiked_rest}>찜</button>
                          {/* <button type="button" className="btn share">공유</button> */}
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
                            <span className="desc">{unescapehtmlcode(resultInfoData.bsnInfoVo.strAddr)}&nbsp;{unescapehtmlcode(resultInfoData.bsnInfoVo.strAddrDtl)}</span>
                          </li>
                          {
                            resultInfoData.oprTmList.length > 0 ?
                            <li>
                              <span className="title">운영시간</span>
                              <span className="desc">
                                평일 - {tmFormat(resultInfoData.oprTmList[1].staTm)} ~ {tmFormat(resultInfoData.oprTmList[1].endTm)}<br/>
                                토요일,일요일 - {tmFormat(resultInfoData.oprTmList[0].staTm)} ~ {tmFormat(resultInfoData.oprTmList[0].endTm)}
                              </span>
                            </li>
                            : null
                          }
                          {
                            resultInfoData.bsnInfoVo.cnctNo === null || resultInfoData.bsnInfoVo.cnctNo === "" ? null :
                            <li>
                              <span className="title">전화번호</span>
                              <span className="desc" onClick={() => SDL_dispatchCallPhone({cnctNo: resultInfoData.bsnInfoVo.cnctNo.replace(/-/g, '')})}>{resultInfoData.bsnInfoVo.cnctNo}</span>
                            </li>
                          }
                          {
                            resultInfoData.bsnInfoVo.yn2icp !== "Y" ? null :
                            <li>
                              <span className="title">결제방법</span>
                              <span className="desc">{resultInfoData.bsnInfoVo.yn2icp === "Y" ? "바로결제" : null}</span>
                            </li>   
                          }                       
                        </ul>
                      </div>
                    </div>
                  </div>
                  </>
                  :
                  <>
                  <div className="detailView">
                    <div className="imgView">
                      <img src={thumImgUrl} onError={(e)=>{e.target.onerror = null; e.target.src="/common/images/no_image.png"}}/>
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
                            <span className={star < 1 ? "star": "star on"}></span>
                            <span className={star < 2 ? "star": "star on"}></span>
                            <span className={star < 3 ? "star": "star on"}></span>
                            <span className={star < 4 ? "star": "star on"}></span>
                            <span className={star < 5 ? "star": "star on"}></span>
                            <strong className="number">{resultInfoData[0].avrPoints}</strong>
                          </p>
                          <div className="infoReview">
                            <span>리뷰 {resultInfoData[0].userRvwCnt === "" ? "0" : resultInfoData[0].userRvwCnt}</span>
                            <span>사장님 댓글 {resultInfoData[0].ownerRvwCnt === "" ? "0" : resultInfoData[0].ownerRvwCnt}</span>
                          </div>
                        </div> */}
                        <div className="infoShare">
                          <button type="button" className={resultInfoData[0].dipStrYn === "Y" ? "btn like active" : "btn like"} onClick={toggleLiked}>찜</button>
                          {/* <button type="button" className="btn share">공유</button> */}
                        </div>
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
                                  {resultInfoData[0].zeropayUseFg === '1'? <span className="zeroPay">제로페이</span> : null }
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
                            {
                              resultInfoData[0].strDlevYn === "1" || resultInfoData[0].strStevYn === "1" ?
                              <li>
                                <span className="title">할인혜택</span>
                                <span className="desc">
                                  {resultInfoData[0].strDlevYn === "1" && resultInfoData[0].strStevYn === "0" ? "배달팁할인" : null}
                                  {resultInfoData[0].strDlevYn === "1" && resultInfoData[0].strStevYn === "1" ? "배달팁할인, 추가할인" : null}
                                  {resultInfoData[0].strDlevYn === "0" && resultInfoData[0].strStevYn === "1" ? "추가할인" : null}
                                </span>
                              </li> : null
                            }
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
                                <span className="copyAddress_store">{unescapehtmlcode(resultInfoData[0].strAddr)}&nbsp;
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
                                {resultInfoData[0].zeropayUseFg === '1'? <span className="infoLabel zeroPay">제로페이</span> : null }
                              </li>
                            }
                            {
                              resultInfoData[0].strPkevYn === "1" || resultInfoData[0].strStevYn === "1" ?
                              <li>
                                <span className="title">할인혜택</span>
                                <span className="desc">
                                  {resultInfoData[0].strPkevYn === "1" && resultInfoData[0].strStevYn === "0" ? "픽업할인" : null}
                                  {resultInfoData[0].strPkevYn === "1" && resultInfoData[0].strStevYn === "1" ? "픽업할인, 추가할인" : null}
                                  {resultInfoData[0].strPkevYn === "0" && resultInfoData[0].strStevYn === "1" ? "추가할인" : null}
                                </span>
                              </li> :null
                            }
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
                          <p className="descMsg fnMoreContent">{unescapehtmlcode(resultInfoData[0].strEtc)}</p>
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
                    location.state.storeCd === "R" ?
                    <div className="tebContent menuContent onlyState active" id="menu_cont">
                      <Menu strId = {location.state.strId} 
                            strNm = {resultInfoData.bsnInfoVo.strNm} 
                            strAddr= {resultInfoData.bsnInfoVo.strAddr}
                            // dlMinOrdrPrc = {resultInfoData[0].dlMinOrdrPrc}
                            // dlMinOrdrPrc9icp = {resultInfoData[0].dlMinOrdrPrc9icp}
                            // dlMinOrdrPrc9ica = {resultInfoData[0].dlMinOrdrPrc9ica}
                            // dlMinOrdrPrc9icm = {resultInfoData[0].dlMinOrdrPrc9icm} 
                            prdOrgn={resultInfoData.bsnInfoVo.prdOrgn}
                            storeCd ={location.state.storeCd} 
                            orderType={balloon ? 0 : 1}
                            brdId = {resultInfoData.bsnInfoVo.brdId}/>
                    </div>
                    :
                    <>
                    <ul className="menuTab fnTabMenu">
                      <li className="active"><a href="#menu_cont">메뉴</a></li>
                      <li><a href="#info_cont">정보</a></li>
                      <li><a href="#review_cont">리뷰</a></li>
                    </ul>
                    <div className="tebContent menuContent active" id="menu_cont">
                      <Menu strId = {location.state.strId} 
                            strNm = {resultInfoData[0].strNm} 
                            strAddr= {resultInfoData[0].strAddr}
                            dlMinOrdrPrc = {resultInfoData[0].dlMinOrdrPrc}
                            dlMinOrdrPrc9icp = {resultInfoData[0].dlMinOrdrPrc9icp}
                            dlMinOrdrPrc9ica = {resultInfoData[0].dlMinOrdrPrc9ica}
                            dlMinOrdrPrc9icm = {resultInfoData[0].dlMinOrdrPrc9icm} 
                            prdOrgn={resultInfoData[0].prdOrgn}
                            storeCd ={location.state.storeCd} 
                            orderType={balloon ? 0 : 1}
                            brdId = {resultInfoData[0].brdId}/>
                    </div>

                    <div className="tebContent infoContent" id="info_cont">
                      <Info strId = {location.state.strId} dlvYn={resultInfoData[0].dlvYn} />
                    </div>

                    <div className="tebContent reviewContent" id="review_cont">
                      <Review strId = {location.state.strId} />
                    </div>
                    </>
                  }
                </div>
                <div>
                  {
                    location.state.storeCd === "R" ? null : 
                    resultInfoData[0].pickYn === "Y" && resultInfoData[0].dlvYn === "Y" ?
                    
                    <div className={pullShowScreenData.orderType ? "balloonBtn pickActive" : "balloonBtn deliActive"}>
                      <button className="deli" onClick={() => {
                        changeBalloonButton(setBalloon, true, changeOrderType, 0, pullShowScreenData.bizCtgGrp, pullShowScreenData.searchKeyword, dispatch)}}>
                          배달
                      </button> 
                      <button className="pick" onClick={() => {
                        changeBalloonButton(setBalloon, false, changeOrderType, 1, pullShowScreenData.bizCtgGrp, pullShowScreenData.searchKeyword, dispatch)}}>
                          픽업
                      </button>
                    </div>
                    :
                    null
                  }
                </div>
                {
                  data.channel.channelUIType === 'A' && totalCount !== 0 && totalCount !== undefined ? 
                  <div className="fixedBtn flex3half1">
                    <a className="btn infoMsg addOrder" 
                    onClick = {()=>{doOrder(data)}} > <span>{numberFormat(totalPrice)}원 주문하기 <span className="numberMsg">{totalCount}</span></span> </a>
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

function changeBalloonButton(setBalloon, BalloonData, changeOrderType, OrderTypeData, bizCtgGrp, searchKeyword, dispatch) {

  const data = {
    bizCtgGrp : bizCtgGrp,
    orderType : OrderTypeData,
    searchKeyword : searchKeyword
  }
  pushShowScreen(data)

  setBalloon((prev) => {
    return !prev
  });
  changeOrderType(OrderTypeData)
    
  let message = OrderTypeData ? "지금 주문하시는 메뉴는 픽업메뉴입니다." : "지금 주문하시는 메뉴는 배달메뉴입니다."
 
  dispatch({type : 'TOAST', payload : {show : true , data : {msg: message, code : '', dispatch : dispatch} , callback : toastCallback}})

}

const calcMinOderPrice = (cartData) => {

    const dlMinOrdrPrc9icp = cartData.dlMinOrdrPrc9icp
    const dlMinOrdrPrc9ica = cartData.dlMinOrdrPrc9ica
    const dlMinOrdrPrc9icm = cartData.dlMinOrdrPrc9icm

    const arr = [Number(dlMinOrdrPrc9icp),Number(dlMinOrdrPrc9ica),Number(dlMinOrdrPrc9icm)]

    return Math.max.apply(null, arr);
}