/*global kakao*/
import React, {useRef,createRef,useState, useCallback, useEffect,useContext} from 'react';
import Swiper from 'react-id-swiper';
// Version >= 2.4.0
import 'swiper/css/swiper.css';
import { Link , useHistory, useLocation} from 'react-router-dom';

import * as ACTION from '../../common/ActionTypes'
import useAsync from '../../hook/useAcync' 
import useAddress from '../../hook/useAddress' 
import * as API from '../../Api'
import Image from '../../components/Image';
import { pullDefaultAddress, pushDefaultAddress, pushShowScreen, unescapehtmlcode, pushPushToken,
    getQueryStringParams, removeShowScreenDataAll, removeCartDataAll } from '../../util/Utils' 
import * as AppBridge from '../../appBridge'
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'

const MainContainer = ({history})=>{

    const location = useLocation()

    // 로컬 저장소에 주소정보가 있는지 확인한다.
    const [addressParam] = useState(() => {
        const storedDefaultAddress = pullDefaultAddress()
        const type = Object.keys(storedDefaultAddress).length === 0 ? 1 : 4;
        return {latitude : 0,longitude : 0,addressName : '',type : type}
    });

    useEffect(()=>{

        removeShowScreenDataAll()
        removeCartDataAll()
        try{
            // 푸시토크값을 업데이트를 한다.
            const param = getQueryStringParams(location.state.from.search)
            console.log('token', param.token)
            API.upDatePushToken(param.token)
            .then((res)=>{
                pushPushToken(param.token)
            })
            .catch((err)=>{})
        }catch(err){}
    },[])
    
    const defaultAddress = useAddress(addressParam,[])

    if(addressParam.type ===1){
        pushDefaultAddress(defaultAddress)
    }

    return (
        <>
            <div id="wrap">
                <Header defaultAddress={defaultAddress}/>
                <div id="container">
                    <div id="content">
                        <BannerSection history={history}/>
                        <CategorySection defaultAddress={defaultAddress}/>
                        <NewStoreSection/>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    )
}

const Header = ({defaultAddress})=>{

    const {dispatch} = useContext(SDLContext)

    const history = useHistory();

    let address = '';

    if(Object.keys(defaultAddress).length !== 0){
        if(defaultAddress.road_address){
            address = defaultAddress.road_address.address_name
        }else{
            address = defaultAddress.address.address_name
        }
    }

    const toastCallback = (data) => {
        console.log('toastCallback', data)
        data.dispatch({type : 'TOAST', payload : {show : false }})
        history.push({pathname : ACTION.LINK_MYPAGE})
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

    return (
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a className="icon zeroPay" onClick = {() => {doZeroPay(dispatch)}}>Zero Pay</a>
                    {/* <Link to = {{pathname:ACTION.LINK_ZERO_PAY}} className="icon zeroPay">Zero Pay</Link> */}
                </div>            
                <div className="middleArea">
                <Link to={{pathname: ACTION.LINK_ADDRESS_SETTING}} className="addressBox">{address}</Link>
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
        history.push({pathname : ACTION.LINK_MYPAGE})
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
                    <img src="/common/images/banner/img_tump_banner_0625_1.png" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" />
                </Link>
                </div>
                <div className="swiper-slide">
                    <img src="/common/images/banner/img_tump_banner_0625_2.png" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" />
                </div>
                <div className="swiper-slide">
                    <img src="/common/images/banner/img_tump_banner_0625_3.png" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" />
                </div>
                <div className="swiper-slide">
                    <img src="/common/images/banner/img_tump_banner_0625_4.png" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" />
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

const BannerSection = ({history})=>{

    return(
            <div className="mainBanner">
                <SimpleSwiperWithParams history={history}/>
            </div>
    );
}


const CategorySection = ({history, defaultAddress})=>{

    const [state,refetch] = useAsync(API.getCatogories,[]);
    const{loading, data,error} = state;

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
                        <li key={category.bizCtgDtlNmMi + "_" + index} className={"menu_" + category.bizCtgDtl}
                            onClick={() => clickedCategory(category.bizCtgDtl)}>
                            <Link to={{pathname : ACTION.LINK_MARKET}}>
                                {category.bizCtgGrpNm}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

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

const clickedCategory = (bizCtgDtl) => {
    const data = {
        bizCtgDtl : bizCtgDtl
    }
    pushShowScreen(data)
}

const clickedQrReader = () => {
    AppBridge.SDL_dispatchQrReader();
}

const NewStoreItem = ({storeData}) => {
    // console.log(storeData)
    return (
        <div className={storeData.isOpen === "N" || storeData.isBreakTime === "Y" || storeData.isHld === "Y"?"swiper-slide disableList":"swiper-slide"}>
            <Link className="" to = {{
                pathname:ACTION.LINK_MARKET_DETAIL+`${storeData.strId}`,
                state: {
                    strId : storeData.strId,
                    bizCtgDtl : ""
                }
             }}>
                <div className="productImg">
                    <Image src={storeData.imgModNm} alt={storeData.strNm} />
                    {storeData.isOpen === "N" || storeData.isBreakTime === "Y" || storeData.isHld === "Y" ? <span className="disableLabel"><strong>준비중</strong></span>: null }
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
    if (!data) return (
        <div className="noticeInner">    
            <p className="noticeMsg">공지사항 데이터가 없습니다.</p>
        </div>
    )

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
                        <p className={(!toggleActive) ? "title fnToggleBtn" : "title fnToggleBtn active"}  onClick={fnToggleBtn}>KIS정보통신(주)</p>
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
                    
                <div id="nav">
                    <div>
                        <ul className="navList">
                            <li className="home active"><Link to={{pathname: ACTION.LINK_HOME}} >홈</Link></li>
                            <li className="map"><Link to={{pathname: ACTION.LINK_AROUND_MAP}} >주변지도</Link></li>
                            <li className="myPage"><Link to={{pathname: ACTION.LINK_MYPAGE}} >my슬배생</Link></li>
                            <li className="myOrder"><Link to={{pathname: ACTION.LINK_ORDER_HISTORY}} >주문내역</Link></li>
                            <li className="myLike"><Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
    
}



export default MainContainer;