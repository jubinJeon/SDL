/*global kakao*/
import React, { useEffect, useState, useRef, useContext } from 'react';
import * as API from '../../Api'
import { pullDefaultAddress, getOS } from '../../util/Utils';
import SingleMarketCmpnt from '../../components/SingleMarketCmpnt'
import {SDL_dispatchGetLocation} from '../../appBridge'

import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import * as ACTION from '../../common/ActionTypes'

export default ( {history} ) => {

    return (
        <>
            <Map history={history}/>
        </>
    )
}

const Map = ( {history} ) => {

    const {dispatch,data} = useContext(SDLContext);

    const [storeInfo,setStoreInfo] = useState(null)
    const [activeBtn, setActiveBtn] = useState(true) // true : 현위치, false : 주소지
    const [mapCenterLocationData, setMapCenterLocationData] = useState(null);

    const geocoder = new kakao.maps.services.Geocoder();
    
    let map = useRef();

    // 가게 상세 컴포넌트 컨트롤 state
    const [showInfoArea, setShowInfoArea] = useState(false)

    const handleOnClick = (e) =>{
        e.preventDefault();
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    }

    const dispatchGetLocationCallback = (event) => {
        console.log('dispatchGetLocationCallback', event)
        const code = event.detail.code
        const lat = event.detail.latitude
        const lng = event.detail.longitude

        if(code){
            setLocationInfo(lat,lng)
        }else{
            setLocationInfo(37.5085848476582, 126.888897552736)
        }
        
    }

    useEffect(()=>{
        window.addEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
    
        return () =>{
        window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        }
    },[])

    useEffect(() => {

        setDaumMap()
        setShowInfoArea(false)

        

        if(activeBtn){
            console.log('map', getOS())
            if(getOS() === 'IOS'){

                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                    SDL_dispatchGetLocation()
                }else{
                    setLocationInfo(37.5085848476582, 126.888897552736)
                }           
            }else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
        
                        map.current.setCenter(new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude));
                        setLocationInfo(position.coords.latitude,position.coords.longitude)
        
                    }, function(error) {

                        console.error(error);
                        setLocationInfo(37.5085848476582, 126.888897552736)
            
                    }, {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 2000
                    });
                }else{

                    setLocationInfo(37.5085848476582, 126.888897552736)
                }
            }
            
        }else{
            
            const storedDefaultAddress = pullDefaultAddress()
            console.log('주소지!!!',storedDefaultAddress)
            setLocationInfo(storedDefaultAddress.y, storedDefaultAddress.x)
        }
        
    }, [activeBtn]);
    
    const setDaumMap = () => {
        
        if(map.current === undefined){

            const container = document.getElementById("myMap");

            const options = {
                center: new kakao.maps.LatLng(37.5085848476582, 126.888897552736),
                level: 3,
                minLevel: 2,
                maxLevel: 7,
            };

            map.current = new window.kakao.maps.Map(container, options)

            kakao.maps.event.addListener(map.current, 'click', function(mouseEvent) {
                // console.log('map clicked but not marker')
                setShowInfoArea(false)
            })
    
            // 지도 드래그 이동 or 중심 좌표 변경시 중심 좌표 변경
            kakao.maps.event.addListener(map.current, 'dragend', mapCenterLocationChangeListener)
            kakao.maps.event.addListener(map.current, 'zoom_changed', mapCenterLocationChangeListener)
        }
        
    }

    const mapCenterLocationChangeListener = function() {
        // 지도의 중심좌표
        const latlng = map.current.getCenter();
        setLocationInfo(latlng.getLat(),latlng.getLng(),'mapCenterLocationChangeListener')
        
    }

    const setLocationInfo = (lat,lng, from = '') => {
       
        geocoder.coord2RegionCode(lng, lat, function(result, status) {
            console.log('coord2RegionCode result', result)
            const data = {lat : lat, lng : lng, code : result[0].code, from : from}
            console.log('data', data)
            setMapCenterLocationData(data)
        });
    }

    useEffect(()=>{

        if(mapCenterLocationData === null){
            return
        }

        console.log('mapCenterLocationData', mapCenterLocationData)
        
        if(mapCenterLocationData.from === ''){
            map.current.panTo(new kakao.maps.LatLng(mapCenterLocationData.lat, mapCenterLocationData.lng));
        }
        
        API.getArround(mapCenterLocationData.lat, mapCenterLocationData.lng, mapCenterLocationData.code)
        .then((res)=>{
            console.log('getArround res',res)

            const markerArray = res.data.map((store) => {
                    
                return {
                    title: store.strNm,
                    latlng: new kakao.maps.LatLng(store.strLat, store.strLng),
                    data: store
                }
            })

            const icondir = "/common/images/icon/map/"
            
            markerArray.map((storeInfo) => {

                const data = storeInfo.data
                
                const imgUri = data.isOpen === "N" || data.isBreakTime === "Y" || data.isHld === "Y" ?
                     icondir+'d_'+data.bizCtgGrp+'.png'
                    : icondir+'a_'+data.bizCtgGrp+'.png'
                
                const img = new Image()
                img.src = imgUri
                const imageSize = new kakao.maps.Size(img.width*2/3, img.height*2/3);

                const markerImage = new kakao.maps.MarkerImage(imgUri, imageSize);
                
                const marker = new kakao.maps.Marker({
                    map: map.current,
                    position: storeInfo.latlng,
                    title : storeInfo.title,
                    image : markerImage // 마커 이미지
                });

                const content = `<div class="customoverlay" />
                                    <span>${storeInfo.title}</span>
                                </div>`

                new kakao.maps.CustomOverlay({
                    map: map.current,
                    position: storeInfo.latlng,
                    content: content,
                    yAnchor: 1
                })
            
                kakao.maps.event.addListener(marker, 'click', ()=>{setStoreInfo(data)})
            })
        })
    },[mapCenterLocationData])

    useEffect(()=>{
        if(storeInfo === null) return
        console.log('storeInfo',storeInfo)
        setShowInfoArea(true)
    },[storeInfo])

    return(
        <>
            <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={handleOnClick} className="icon pageBack">Back</a>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">내 주변지도 보기</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="mapSearch">
                            <ul className="mapTypes">
                                <li><button type="button" className={activeBtn ? "btnType": "btnType active"} onClick={()=>{setActiveBtn(false)}}>주소지</button></li>
                                <li><button type="button" className={activeBtn ? "btnType active": "btnType"} onClick={()=>{setActiveBtn(true)}}>현위치</button></li>
                            </ul>
                            <div className="mapArea" id="myMap"></div>
                            { showInfoArea && <InfoArea storeInfo={storeInfo} /> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
};

const InfoArea = ( {storeInfo} ) => {


    return (
        <div className="mapAddress">
            <ul className="listContent">
                <li>
                    <SingleMarketCmpnt market={storeInfo} restYN="N"/>
                </li>
                {/* <li>
                    <a href="#">
                        <div className="listImg">
                            <span className="newLabel"><strong>NEW</strong></span>
                            <img src="../common/images/tump/img_product_main.png" alt="썸네일 이미지" />
                        </div>
                        <div className="listInfo">
                            <div className="infoLabel">
                                {(data.dlvYn === 'Y') ? <span className="label deli">배달</span> : null}
                                {(data.pickYn === 'Y') ? <span className="label pick">픽업</span> : null}
                            </div>
                            <div className="infoTitle">
                                <p className="title">{data.strNm}</p>
                                <span className="direction">{fmt(data.distance)}m</span>
                            </div>
                            <div className="infoDesc">
                                <ul>
                                    <li>
                                        <span className="startPoint"><span className="star">4.8</span>(22)</span>
                                        <span className="infoDescMenu">아메리카노, 카페라떼</span>
                                    </li>
                                    <li>
                                        <span className="descLabel deliveryTime">10~20분</span>
                                        <span className="descLabel">배달팁 {data.dlvTip}원</span>
                                        <span className="descLabel">최소주문 {data.dlvMinPrice}원</span>
                                    </li>
                                    <li>
                                        <span className="infoLabel">배달팁할인</span>
                                        <span className="infoLabel">추가할인 10%</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </a>
                </li> */}
            </ul>
        </div>
    )
}
