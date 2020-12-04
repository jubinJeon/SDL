import React, { useState, useEffect,  useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

import * as ACTION from '../../common/ActionTypes'
import {SDLContext} from '../../context/SDLStore'

import * as API from '../../Api'
import { pullDefaultAddress, pushDefaultAddress, numberFormat, unescapehtmlcode, decimalToMeterFormat, getOS , addressSearchByCoords } from '../../util/Utils'
import {SDL_dispatchGetLocation} from '../../appBridge'
import FooterNavgation from '../../components/FooterNavgation';

export default ({history}) => {

    // 0: 매장 1: 휴게소 2: 메뉴
    const [state, setState] = useState("store")

    const [locationData, setLocationData] = useState(null);

    const {data} = useContext(SDLContext)

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
            //모범생 채널일 경우 
            if(data.channel.channelCode === 'CH00002046'){
                addressSearchByCoords(data.location.ch00002046.longitude, data.location.ch00002046.Latitude,(address)=>{
                    setLocationData(address);
                    pushDefaultAddress(address,'DEFAULT');             
                });   
            }else{
                addressSearchByCoords(data.location.sdl.longitude, data.location.sdl.Latitude,(address)=>{
                    setLocationData(address)
                    pushDefaultAddress(address,'DEFAULT')                                         
                });   
            }
        }     
    }

    useEffect(()=>{

        window.addEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)

        // 저장된 주소 가져오기
        const storedDefaultAddress = pullDefaultAddress()

        if(storedDefaultAddress !== null && Object.keys(storedDefaultAddress).length !== 0){

            setLocationData(storedDefaultAddress)

        }else{
            if(getOS() === 'IOS'){

                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                    SDL_dispatchGetLocation()
                }else{
                    //모범생 채널일 경우 
                    if(data.channel.channelCode === 'CH00002046'){
                        addressSearchByCoords(data.location.ch00002046.longitude, data.location.ch00002046.Latitude,(address)=>{
                            setLocationData(address);
                            pushDefaultAddress(address,'DEFAULT');             
                        });   
                    }else{
                        addressSearchByCoords(data.location.sdl.longitude, data.location.sdl.Latitude,(address)=>{
                            setLocationData(address)
                            pushDefaultAddress(address,'DEFAULT')                                         
                        });   
                    }
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
                        //모범생 채널일 경우 
                        if(data.channel.channelCode === 'CH00002046'){
                            addressSearchByCoords(data.location.ch00002046.longitude, data.location.ch00002046.Latitude,(address)=>{
                                setLocationData(address);
                                pushDefaultAddress(address,'DEFAULT');             
                            });   
                        }else{
                            addressSearchByCoords(data.location.sdl.longitude, data.location.sdl.Latitude,(address)=>{
                                setLocationData(address)
                                pushDefaultAddress(address,'DEFAULT')                                         
                            });   
                        }
                    }, {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 2000
                    });
                }else{
                    //모범생 채널일 경우 
                    if(data.channel.channelCode === 'CH00002046'){
                        addressSearchByCoords(data.location.ch00002046.longitude, data.location.ch00002046.Latitude,(address)=>{
                            setLocationData(address);
                            pushDefaultAddress(address,'DEFAULT');             
                        });   
                    }else{
                        addressSearchByCoords(data.location.sdl.longitude, data.location.sdl.Latitude,(address)=>{
                            setLocationData(address)
                            pushDefaultAddress(address,'DEFAULT')                                         
                        });   
                    }
                }
            }
        }

        return () =>{
            window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        }
    },[])
   
    if (locationData === null) return <></>

    return (
        <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="middleArea">
                    <h1 className="headerTitle">마이찜</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="fullHeight">
                    <div className="listSort pageSort">
                        <div className="btnWrap leftCol">
                            <button type="button" value="store" className={state == "store" ? "active btn" : "btn"} onClick={activeClicked}>매장</button>
                            {
                                data.channel.channelUIType === 'A' && (
                                <button type="button" value="rest" className={state == "rest" ? "active btn" : "btn"} onClick={activeClicked}>휴게소</button>
                                )
                            }
                           <button type="button" value="menu" className={state == "menu" ? "active btn" : "btn"} onClick={activeClicked}>메뉴</button>
                        </div>                       
                    </div>
                    {state == "menu" ? <LikeMenu defaultAddress = {locationData} history={history}/>
                                    : 
                                       <LikeStore defaultAddress = {locationData} history={history} state={state}/> 
                    }
                </div>
            </div>
        </div>
        <FooterNavgation/>
    </div>
    )

    // state true: 매장 
    function activeClicked(e) {
        if(state !== e.currentTarget.value) {
            setState(e.currentTarget.value)
        }
    }

}

const LikeStore = (props) => {
    
    const [result, setResult] = useState(null)

    useEffect (() => {
        props.state == "store" ?
            API.getJjimStore(props.defaultAddress.y, props.defaultAddress.x)
            .then((data)=>{
                console.log(data.data)
                setResult(data.data)
            })
            .catch((error) => {
                setResult([]);
            })
        :
            API.getJjimRest(props.defaultAddress.y, props.defaultAddress.x)
            .then((data)=>{
                console.log(data.data)
                setResult(data.data)
            })
            .catch((error) => {
                setResult([]);
            })
    }, [props.state]);
    
    const countRef = useRef(0)

    const changeCountRef = () => countRef.current.textContent = Number(countRef.current.textContent) -1
    
    return (
        <>
        <div className="listWrap">
            <p className="sortResult"><strong>총 <span className="num" ref={countRef} >{result !== null ? result.length : 0}</span>개 매장</strong></p>
            {
                result === null ?
                null
                :
                <>
                { result.length !== 0 ?
                    <ul className="listContent typeLikeItems">
                        {result.map((store) => 
                            <li key={store.strId} >
                                {store != "Y" &&
                                    <LazyLoad once >
                                        <DipMarketCmpnt market={store} changeCountRef={changeCountRef} restYN={props.state}/>
                                    </LazyLoad>
                                }
                            </li>
                        )}
                    </ul>
                    :
                    <div className="emptyWrap noneData">
                        <div className="empty">
                            <p className="emptyMsg_1">찜 내역이 없습니다.</p>
                        </div>
                    </div>
                }
                </>
            }
        </div>
        </>
    )
}

const LikeMenu = ({defaultAddress, history}) => {
    
    const {dispatch} = useContext(SDLContext);
    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }
    
    const [result, setResult] = useState(null)

    useEffect (() => {
        API.getJjimMenu(defaultAddress.y, defaultAddress.x, "")
        .then((data)=>{
            setResult(data.data)
            console.log(data.data)
        })
        .catch((error) => {
            setResult([]);
        })
    }, []);

    const countRef = useRef(0)
    
    return (
        <div className="listWrap">
        <p className="sortResult"><strong>총 <span className="num" ref={countRef} >{result !== null ? Number(result.length) : 0}</span>개 메뉴</strong></p>
        {
            result === null ?
            null
            :
            <div className="storeMenuList">
                {result.length !== 0 ? 
                        <div className="itemsList ">
                            <ul className="listContent">
                                {result.map((menus) => 
                                    <li key={menus.prdId} style={{display: 'block'}}>
                                        
                                            <a onClick={ menus.isHld === "Y" ?
                                                            () => dispatch({type : 'TOAST', payload : {show : true,
                                                                            data : {msg: '오늘은 휴무일입니다.', code : '', dispatch : dispatch},
                                                                            callback : toastCallback}})
                                                        :
                                                            menus.isOpen === "N" ?
                                                                () => dispatch({type : 'TOAST', payload : {show : true,
                                                                                data : {msg: '지금은 영업 준비중입니다.', code : '', dispatch : dispatch},
                                                                                callback : toastCallback}})
                                                            :
                                                                menus.isBreakTime === "Y" ?
                                                                    () => dispatch({type : 'TOAST', payload : {show : true,
                                                                        data : {msg: '지금은 영업 준비중입니다.', code : '', dispatch : dispatch},
                                                                        callback : toastCallback}})
                                                                :
                                                                    ()=> {
                                                                        // const data = { bizCtgGrp : process.env.REACT_APP_REST_AREA_CATEGORY_CODE }
                                                                        // pushShowScreen(data)
                                                                        history.push({
                                                                            pathname: ACTION.LINK_MARKET_DETAIL+`${menus.strId}`,
                                                                            state: {
                                                                                strId : menus.strId,
                                                                                storeCd: menus.storeCd /* == 'R' ? process.env.REACT_APP_REST_AREA_CODE : '' */
                                                                            }
                                                                        })
                                                                    }
                                                        }>
                                            <div>
                                                <p className="strName">
                                                    <span className="strNm">{unescapehtmlcode(menus.strNm)}</span>
                                                </p>
                                                <p className="itemName">
                                                    <span className="name">{unescapehtmlcode(menus.prdNm)}</span>
                                                </p>
                                                <p className="itemDesc">{menus.prdDesc} </p>
                                                <p className="itemPrice"><strong>{numberFormat(Number(menus.normalPrice))}원</strong></p>
                                            </div>
                                        </a>
                                        <button onClick={(e)=> {
                                            API.menuDipdel(menus.strId, menus.storeCd, menus.prdId)
                                            // refech()
                                            e.target.parentElement.setAttribute("style", "display: none")
                                            countRef.current.textContent = Number(countRef.current.textContent) -1

                                        }} type="button" className="delRow">삭제</button>
                                    </li>
                                )}
                                
                            </ul>
                        </div>
                    :
                        <div className="emptyWrap noneData">
                            <div className="empty">
                                <p className="emptyMsg_1">찜 내역이 없습니다.</p>
                            </div>
                        </div>
                    }
            </div>
        }
        </div>
    )
}

const DipMarketCmpnt = ({ market, changeCountRef, restYN }) => {
    
    const fn = (e, isOpen, isBreakTime, isHld) => {
        if(isOpen === "N" || isBreakTime === "Y" || isHld === "Y")
            e.preventDefault()
    }

    const thumImgUrl = market.imgModNm;

    return (
    <>
        <Link onClick={(e)=> {
                            fn(e, market.isOpen, market.isBreakTime, market.isHld)
                            // const data = { bizCtgGrp : process.env.REACT_APP_REST_AREA_CATEGORY_CODE }
                            // pushShowScreen(data)
                        }}
            to= {{
                    pathname: ACTION.LINK_MARKET_DETAIL+`${market.strId}`,
                    state: {
                        strId: market.strId,
                        storeCd: market.storeCd
                        // bizCtgGrp: market.bizCtgGrp
                    }
             }} className={market.isOpen === "N" || market.isBreakTime === "Y" || market.isHld === "Y"? "disableList" : ""}> 
                
            <div className="listImg">
                { market.isNewStr && <span className="newLabel"><strong>신규</strong></span>}
                { market.isOpen === "N" || market.isBreakTime === "Y" || market.isHld === "Y" ? <span className="disableLabel"><strong>준비중</strong></span> : null }
                <img src={thumImgUrl} alt="썸네일 이미지" onError={(e)=>{e.target.onerror = null; e.target.src="/common/images/no_image.png"}}/>
            </div>
            <div className="listInfo">
                <div className="infoLabel">
                    {(market.dlvYn === 'Y') ? <span className="label deli">배달</span> : null}
                    {(market.pickYn === 'Y') ? <span className="label pick">픽업</span> : null}
                </div>
                <div className="infoTitle">
                    <p className="title">{unescapehtmlcode(market.strNm)}</p>                    
                </div>
                <div className="infoDesc">
                    <ul>
                        <li>
                            {/* <span className="startPoint"><span className="star">{market.avrgStarPnt ==="" ? 0 : market.avrgStarPnt}</span>{market.rvwCnt ? " " + "(" + market.rvwCnt + ")" : ""}</span> */}
                            <span className="descLabel distance">{decimalToMeterFormat(market.distance)}</span>
                            {market.pickYn === 'Y' && market.dlvYn === 'N' ? null : <span className="descLabel deliveryTime">{market.expDlvTm}분 </span>}
                        </li>
                        {
                            market.prpPrdNm ?
                            <li>
                                <span className="infoDescMenu">
                                    {market.prpPrdNm ? unescapehtmlcode(market.prpPrdNm) : null}
                                </span>
                            </li>
                            : null
                        }
                        
                        <li>
                            {
                                market.pickYn === 'Y' && market.dlvYn === 'N' ? null : 
                                <>
                                <span className="descLabel"> 최소주문 {numberFormat(calcMinOderPrice(market))}원
                                </span>
                                {
                                  Number(market.dlPrc3) !== 0
                                  ?
                                  <span className="descLabel">배달팁 {numberFormat(market.dlPrc3)}원 ~ {numberFormat(market.dlPrc1)}원</span>
                                  :
                                  Number(market.dlPrc2) !== 0
                                  ?
                                  <span className="descLabel">배달팁 {numberFormat(market.dlPrc2)}원 ~ {numberFormat(market.dlPrc1)}원</span>
                                  :
                                  <span className="descLabel">배달팁 {numberFormat(market.dlPrc1)}원</span>
                                }    
                                </>
                            }
                        </li>
                        <li>
                            {market.strDlevYn === "1" ? <span className="infoLabel">배달팁할인</span> : null}
                            {market.strPkevYn === "1" ? <span className="infoLabel">픽업할인</span> : null}
                            {market.strStevYn === "1" ? <span className="infoLabel">추가할인</span> : null}
                            {restYN === 'store' && market.zeropayUseFg == '1' ? <span className="infoLabel zeroPay">제로페이</span> : null }
                        </li>
                    </ul>
                </div>
            </div>
        </Link>
        <button onClick={(e)=> {
            API.storeDipdel(market.storeCd, market.strId)
            // refech()
            e.target.parentElement.setAttribute("style", "display: none")
            changeCountRef()

        }} type="button" className="delRow">삭제</button>
    </>
    );
}

const calcMinOderPrice = (cartData) => {

    const dlMinOrdrPrc9icp = cartData.dlMinOrdrPrc9icp
    const dlMinOrdrPrc9ica = cartData.dlMinOrdrPrc9ica
    const dlMinOrdrPrc9icm = cartData.dlMinOrdrPrc9icm

    const arr = [Number(dlMinOrdrPrc9icp),Number(dlMinOrdrPrc9ica),Number(dlMinOrdrPrc9icm)]

    return Math.max.apply(null, arr);
}

// 메뉴 찜 조회 기존 기획입니다.
// const LikeMenu = (props) => {

//     const [state, refech] = useAsync(()=>
//         API.getJjimMenu(props.defaultAddress.y, props.defaultAddress.x, "")
//     )
//     const { loading, data, error } = state;
//     const countRef = useRef(0)
    
//     return (
//         <div className="listWrap">
//         <p className="sortResult"><strong>총 <span className="num" ref={countRef} >{data !== null ? Number(data.data.length) : 0}</span>개 메뉴</strong></p>
//         {
//             data === null ?
//             null
//             :
//             <div className="storeMenuList">
//                 {data.data.length !== 0 ? 
//                 <>
//                 {/* map */}
//                     <div className="storeName">
//                         <div className="statusLabel">
//                             <span className="label deli">배달</span>
//                             <span className="label pick">픽업</span>
//                         </div>
//                         <strong className="name">마트 24 - 신도림점</strong>
//                     </div>
//                     <div className="itemsList ">
//                         <ul className="listContent">
//                             {/* map */}
//                                 <li>
//                                     <a href="#">
//                                         <div>
//                                             <p className="itemName">
//                                                 <span className="name">비프 샐러드</span>
//                                             </p>
//                                             <p className="itemDesc">한끼 식사로 든든 </p>
//                                             <p className="itemPrice"><span className="sale">6,000원</span><strong>5,800원</strong></p>
//                                         </div>
//                                     </a>
//                                     <button type="button" className="delRow">삭제</button>
//                                 </li>
//                             {/* map */}
//                         </ul>
//                     </div>
//                 {/* map */}
//                 </>
//                 :
//                 <div className="emptyWrap noneData">
//                     <div className="empty">
//                         <p className="emptyMsg_1">찜 내역이 없습니다.</p>
//                     </div>
//                 </div>
//                 }
//             </div>
//         }
//         </div>
//     )
// }