/*global kakao*/
import React, {useRef,createRef,useState, useCallback, useEffect,useContext} from 'react';
import Swiper from 'react-id-swiper';
// Version >= 2.4.0
import 'swiper/css/swiper.css';
import { Link , useHistory, useLocation} from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import useAsync from '../../hook/useAcync' 
import * as API from '../../Api'
import Image from '../../components/Image';
import { pullDefaultAddress, pushDefaultAddress, pushShowScreen, unescapehtmlcode, pushPushToken,
    getQueryStringParams, removeShowScreenDataAll, removeCartDataAll, getOS , addressSearchByCoords } from '../../util/Utils' 
import * as AppBridge from '../../appBridge'
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import {SDL_dispatchGeofencing, SDL_dispatchGetLocation} from '../../appBridge'
import FooterNavgation from '../../components/FooterNavgation'


/**
 * ***** MAIN *****
 * @param {*} history (ROUTER)
 */
const MainContainer = ({history})=>{

    const location = useLocation()
    const [locationData, setLocationData] = useState(null);

    // 주소 가지오는 함수
    const dispatchGetLocationCallback = (event) => {
        console.log('dispatchGetLocationCallback', event)
        const code = event.detail.code
        const lat = event.detail.latitude
        const lng = event.detail.longitude

        if(code){
            addressSearchByCoords(lat, lng,(address)=>{
                setLocationData(address)
                pushDefaultAddress(address,'iOS_LOCATION_SERVICE')
            })
        }else{
            addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                setLocationData(address)
                pushDefaultAddress(address,'DEFAULT')
            })
        }
        
    }

    // QR 가지오는 함수
    const dispatchInternalQRCallback = (event) => {

        const data = event.detail.data

        history.push({
            pathname:ACTION.LINK_MARKET_DETAIL+`${data.strId}`,
            state: {
                strId : data.strId,
                storeCd : data.storeCd
            }
        })

    }

    useEffect(()=>{

        window.addEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        window.addEventListener('SDL_dispatchInternalQR',dispatchInternalQRCallback, false)

        // 저장된 주소 가져오기 (디폴트 주소)
        const storedDefaultAddress = pullDefaultAddress()

        // 디폴트 주소 없으면 
        if(storedDefaultAddress !== null && Object.keys(storedDefaultAddress).length !== 0){

            setLocationData(storedDefaultAddress)

        }else{
            if(getOS() === 'IOS'){

                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                    SDL_dispatchGetLocation()
                }else{

                    addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                        setLocationData(address)
                        pushDefaultAddress(address,'DEFAULT')
                    })
                }           
            }else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
        
                        addressSearchByCoords(position.coords.latitude,position.coords.longitude,(address)=>{
                            setLocationData(address)
                            pushDefaultAddress(address)
                        })
        
                    }, function(error) {
                        
                        console.error(error);
                        addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                            setLocationData(address)
                            pushDefaultAddress(address,'DEFAULT')
                        })
            
                    }, {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 2000
                    });
                }else{
                    
                    addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                        setLocationData(address)
                        pushDefaultAddress(address,'DEFAULT')
                    })
                }
            }
        }

        //현재 보고있는 위치 삭제 (SCREEN => 카테고리 데이터)
        removeShowScreenDataAll()

        //카트 정보 삭제
        removeCartDataAll()

        const param = getQueryStringParams(location.state.from.search)

        try{
            // 푸시토크값을 업데이트를 한다.
            // home에서는 token 업데이트
            console.log('token', param.token)
            API.upDatePushToken(param.token, param.os)
            .then((res)=>{
                pushPushToken(param.token)
            })
            .catch((err)=>{})

            //휴게소 리스트를 미리 가지온다?
            API.getAllRestArea()
            .then((res)=>{
                if(res){
                    console.log('res', res)
                    SDL_dispatchGeofencing(res)
                }
            })
            .catch((err)=>{})

        }catch(err){
            
        }

        //unMount
        return () =>{
            window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
            window.removeEventListener('SDL_dispatchInternalQR',dispatchInternalQRCallback, false)          
        }
    },[])
    
    // 주소없으면 빈 화면 
    if(locationData === null) return (<></>)

    return (
        <>
            <div id="wrap">
                <Header defaultAddress={locationData}/>
                <div id="container">
                    <div id="content">
                        <BannerSection history={history}/>
                        <CategorySection history={history} defaultAddress={locationData}/>
                        <NewStoreSection/>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    )
}

/** 
 * 1. 헤더 컴포넌트 (주소)
 */
const Header = ({defaultAddress})=>{

    const {dispatch} = useContext(SDLContext)

    const history = useHistory();
    const location = useLocation();

    let address = '';

    if(Object.keys(defaultAddress).length !== 0){
        if(defaultAddress.road_address){
            address = defaultAddress.road_address.address_name
        }else{
            address = defaultAddress.address.address_name
        }
    }

    // 슬배생 화면 
    const toastCallback = (data) => {
        console.log('toastCallback', data)
        data.dispatch({type : 'TOAST', payload : {show : false }})
        history.push({pathname : ACTION.LINK_MY_SDL})
    }


    //제로페이 왼쪽 상단 
    const doZeroPay = (dispatch) => {

        API.getUserJoinStatus()
        .then((res) => {

            if(Number(res.data.isSdlMember ) !== 1){
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: '로그인이 필요합니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                
            }else{
                history.push({pathname : ACTION.LINK_ZERO_PAY})
            }
        })
    }

    return (
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a className="icon zeroPay" onClick = {() => {doZeroPay(dispatch)}}>Zero Pay</a>
                    {/* <Link to = {{pathname:ACTION.LINK_ZERO_PAY}} className="icon zeroPay">Zero Pay</Link> */}
                </div>            
                <div className="middleArea">
                <Link to={{pathname: ACTION.LINK_ADDRESS_SETTING, state : {headerTitle : '주소검색', from : location}}} className="addressBox">{address}</Link>
                    {/* active 클래스로 제어 */}
                    <div className="tossPop active">
                        <div className="inner">
                            <p>배달 주소지를 확인해주세요.</p>
                        </div>
                    </div>
                </div>
                <div className="rightArea">
                    <button className="icon qrCode" onClick={() => clickedQrReader()}>QR Code</button>
                </div>
            </div>
        </div>
    );
}

/** 
 * 2. 중간 컴포넌트 (광고 부분) 
 */
const BannerSection = ({history})=>{

    return(
            <div className="mainBanner">
                <SimpleSwiperWithParams history={history}/>
            </div>
    );
}

/** 
 * 2. 중간 컴포넌트 (광고 부분) 
 *  -> 광고 리스트 
 */
const SimpleSwiperWithParams = ({history}) => {
    const params = {
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
        clickable: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      loop: false,
    }
    
    const {dispatch} = useContext(SDLContext)
    
    const toastCallback = (data) => {
        console.log('toastCallback', data)
        data.dispatch({type : 'TOAST', payload : {show : false }})
        history.push({pathname : ACTION.LINK_MY_SDL})
    }
   
    return(
        <>
            <Swiper {...params}>
                <div className="swiper-slide">
                <Link to={{
                            pathname : ACTION.LINK_BANNER_DETAIL,
                            img: "/common/images/banner/img_tump_banner_0625_1_full.png",
                            imgLink: ACTION.LINK_ZERO_PAY,
                            imgOnClickfunc: function () {
                                API.getUserJoinStatus()
                                .then((res) => {
                                    if(Number(res.data.isSdlMember ) !== 1){
                                        dispatch({type : 'TOAST', payload : {show : true , data : {msg: '로그인이 필요합니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                                        
                                    }else{
                                        history.push({pathname : ACTION.LINK_ZERO_PAY})
                                    }
                                })
                            }
                        }}>
                    <Image src="/common/images/banner/img_tump_banner_0625_1.png"  local={true}/>
                </Link>
                </div>
                <div className="swiper-slide">
                    <Image src="/common/images/banner/img_tump_banner_0625_2.png"  local={true}/>
                </div>
                <div className="swiper-slide">
                    <Image src="/common/images/banner/img_tump_banner_0625_3.png" local={true}/>
                </div>
                <div className="swiper-slide">
                    <Image src="/common/images/banner/img_tump_banner_0625_4.png"  local={true}/>
                </div>
            </Swiper>
            <Link className="viewAll" to={{
                pathname : ACTION.LINK_BANNER_LIST
            }}>
                전체 보기
            </Link>
        </>
    )
  }

/** 
 *  2. 중간 카테고리 ~ 제로페이 화면까지 컴포넌트 (중간)
 */
const CategorySection = ({history, defaultAddress})=>{

    const [state,refetch] = useAsync(API.getCatogories,[]);
    const{loading, data,error} = state;
    const {dispatch} = useContext(SDLContext)
    
    const toastCallback = (data) => {
        console.log('toastCallback', data)
        data.dispatch({type : 'TOAST', payload : {show : false }})
        history.push({pathname : ACTION.LINK_MY_SDL})
    }

    const doZeroPay = (dispatch) => {

        API.getUserJoinStatus()
        .then((res) => {

            if(Number(res.data.isSdlMember ) !== 1){
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: '로그인이 필요합니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                
            }else{
                history.push({pathname : ACTION.LINK_ZERO_PAY})
            }
        })
    }

    if (loading || error || !data) return (
        <div className="categorySection">
            <div className="categoryArea"></div>
            <div className="searchBox"></div>
            <ul className="categoryMenu"></ul>
        </div>
    );

    return(
        <div className="categorySection">
            <div className="categoryArea">
                <form>
                    <div className="searchBox">
                        <Link to={{pathname : ACTION.LINK_SEARCH}}>
                            <input type="text" className="searchInput" placeholder="음식, 가게 이름으로 검색하세요" />
                            <button className="searchBtn">검색</button>
                        </Link>
                    </div>
                </form>
                <ul className="categoryMenu">
                    {data.data.map((category, index) => 
                        <li key={category.bizCtgDtlNmMi + "_" + index} className={"menu_" + category.bizCtgGrp}
                            onClick={() => clickedCategory(category.bizCtgGrp)}>
                            <Link to={{pathname : ACTION.LINK_MARKET}}>
                                {category.bizCtgGrpNm}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
            <div className="zeropayBanner">
               <a onClick = {() => {doZeroPay(dispatch)}} >
                    <img src="/common/images/zeropaybanner.png" alt="제로페이 상품권 구매"/>
               </a>
            </div>
        </div>
    );
}

// function (푸시 스크린: 카테고리 넣어줌)
const clickedCategory = (bizCtgGrp) => {
    const data = {
        bizCtgGrp : bizCtgGrp
    }
    pushShowScreen(data)
}


/** 
 *  3. 하단 컴포넌트 ( 새로나왔어요 부분 )
 */
const NewStoreSection = ()=>{

    const params = {
        slidesPerView: 1.25,
        spaceBetween: 7,
        initialSlide:0,
    }

    const [state,refetch] = useAsync(API.getNewStores,[]);
    const {loading, data, error} = state;

    if (loading) return (
        <div className="rollingSection">

        </div>
    );

    if (error) return (
        <div className="rollingSection">

        </div>
    );

    if (!data) return null;

    return(
        <div className="rollingSection">
            <h2 className="title">새로 나왔어요</h2>
            <div className="productList">
                <Swiper {...params} >
                    {
                        data.data.map((store)=>{
                            return  <NewStoreItem key={store.strId} storeData = {store} />
                        })
                    }
                </Swiper>
                
            </div>
        </div>
    );
}

// function (qr)
const clickedQrReader = () => {
    AppBridge.SDL_dispatchQrReader();
}

/** 
 * 3. 하단 컴포넌트 ( 새로나왔어요 부분 )
 *  -> 새로운 매장 컴포넌트 
 */
const NewStoreItem = ({storeData}) => {
    // console.log(storeData)
    return (
        <div className={storeData.isOpen !== "N" || storeData.isBreakTime === "Y" || storeData.isHld === "Y"?"swiper-slide disableList":"swiper-slide"}>
            <Link className="" to = {{
                pathname:ACTION.LINK_MARKET_DETAIL+`${storeData.strId}`,
                state: {
                    strId : storeData.strId,
                    bizCtgGrp : "",
                    storeCd : 'S'
                }
             }}>
                <div className="productImg">
                    <Image src={storeData.imgModNm} alt={storeData.strNm} />
                    {storeData.isOpen !== "N" || storeData.isBreakTime === "Y" || storeData.isHld === "Y" ? <span className="disableLabel"><strong>준비중</strong></span>: null }
                </div>
                <div className="productInfo">
                    <p className="label">
                        {storeData.dlvYn === 'Y' && <span className="deli">배달</span>}
                        {storeData.pickYn === 'Y' && <span className="pick">픽업</span>}
                    </p>
                    <p className="title">{unescapehtmlcode(storeData.strNm)}</p>
                    {/* <p className="desc"><span>기타설명 데이터 없습니다.</span></p> */}
                </div>   
            </Link> 
        </div>
    )
}

/** 
 *  4. 푸터 컴포넌트 (홈, 주변지도, my슬배생, 주문내역) 
 */
const Footer = () => {

    
    
    const [toggleActive, setTggleActive] = useState(false)

    const fnToggleBtn = () => {
        if(!toggleActive){
            setTggleActive(true)
        }else{
            setTggleActive(false)
        }
    }

    return (
        <>
            <div id="footer">
                <NoticeSection/>
                <div className="footerInner">
                    <div className="footerCompany">
                        <p className={(!toggleActive) ? "title fnToggleBtn" : "title fnToggleBtn active"}  onClick={fnToggleBtn}><span className="text">KIS정보통신(주)</span></p>
                        <p className="desc fnToggleCon">
                            대표이사 : 조성태, 한상일<br />
                            주소 : 서울시 구로구 새말로 97, 센터포인트웨스트 22층<br />
                            통신판매신고 : 2019-서울구로-1928<br />
                            고객센터 : mobile@kisvan.co.kr <br />
                        </p>
                    </div>
                    <p className="footerMsg">
                        KIS정보통신은 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 KIS정보통신은 상품거래정보 및 거래에 대한 책임을 지지 않습니다.
                    </p>
                    <p className="footerLink">
                        <Link to={{pathname: ACTION.LINK_BUSINESS_INFO}} >사업자정보확인</Link>
                        <Link to={{pathname: ACTION.LINK_SERVICE_TERMS, idx : 0}} >이용약관</Link>
                        <Link to={{pathname: ACTION.LINK_SERVICE_TERMS, idx : 2}} >전자금융거래 이용약관</Link>
                        <Link to={{pathname: ACTION.LINK_SERVICE_TERMS, idx : 1}} ><strong>개인정보 처리방침</strong></Link>
                    </p>
                </div>
                    
                <FooterNavgation/>
            </div>
        </>
    );
    
}

/** 
 *  4. 푸터컴포넌트 (홈, 주변지도, my슬배생, 주문내역) 
 *   -> 공지사항 컴포넌트
 */
const NoticeSection = () => {

    // 공지사항 조회
    const [state, refetch] = useAsync(() => {
        return API.getNoticeList(0, 1)
    }, [])

    const { loading, error, data } = state;

    if (loading) return (
        <div className="noticeInner"></div>
    )

    if (error) return (
        <div className="noticeInner"></div>
    )
    
    if(data === null) return null
    
    if(Object.keys(data).length === 0){
        return (
            <div className="noticeInner">    
                <p className="noticeMsg">공지사항 데이터가 없습니다.</p>
            </div>
        )
    }

    return (
        <>
            <div className="noticeInner">    
                <p className="noticeMsg">
                    <Link to={{pathname: ACTION.LINK_NOTICE_DETAIL + data.data[0].brcId
                            , data: data.data[0]}}><span className="label">
                        공지</span>{data.data[0].boardTitle}</Link>
                    {/* ACTION.LINK_NOTICE_DETAIL+ `${notice.brcId}` 형으로 호출. -ys*/}
                </p>
                
            </div>
        </>
    )
}

export default MainContainer;