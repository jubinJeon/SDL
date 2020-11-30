/*global kakao*/
import React, { useEffect, useState, useRef,useContext } from 'react';

import { pushDefaultAddress, pushSearchAddress,getOS,addressSearchByCoords,addressSearchByName } from '../../util/Utils';
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import {SDL_dispatchCloseApp, SDL_dispatchGetLocation} from '../../appBridge'
import gpsImage from './image/gpsImg.jpg';
import * as ACTION from '../../common/ActionTypes'

const styles = require('./AddressSetting_map.module.scss');

/**
 ****** MAIN ***** 
 *     주소세팅 
 */
export default ( {history, location} ) => {

    /** 
     * hook
     */
    const {dispatch,data} = useContext(SDLContext);
    const [locationData, setLocationData] = useState({
        address: null,
        converseGpsButtonFG: false
    });

    /** 
     * hook
     */
    useEffect(()=>{
        window.addEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)

        const type = location.type;
        gpsNavigator(type, false);
        
        return () =>{
        window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        }
    },[])

    //gps 현재 위치 
    const gpsNavigator = (type, gpsButtonFg) => {
        if(type === 1){ // 현재위치로 검색
            if(getOS() === 'IOS'){
                //앱 브리지 연결
                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                    SDL_dispatchGetLocation();
                    return;
                }else{
                    //모범생 채널일 경우 
                    if(data.channel.channelCode === 'CH00002046'){
                        addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                            setLocationData({
                                address: address,
                                converseGpsButtonFG:!locationData.converseGpsButtonFG
                            });
                        });   
                    }
                }           
            }else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {   
                        //web에서 위치 정보찾기    
                        addressSearchByCoords(position.coords.latitude,position.coords.longitude,(address)=>{
                            setLocationData({
                                address: address,
                                converseGpsButtonFG: !locationData.converseGpsButtonFG
                            });
                        });
                        return;
                    }, function(error) {
                        console.error(error);
                        //모범생 채널일 경우 
                        if(data.channel.channelCode === 'CH00002046'){
                            addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                                setLocationData({
                                    address: address,
                                    converseGpsButtonFG:!locationData.converseGpsButtonFG
                                });
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
                        addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                            setLocationData({
                                address: address,
                                converseGpsButtonFG:!locationData.converseGpsButtonFG
                            });
                        });   
                    }
                }
            }
        }else if (type === 2){ // 주소로 검색
            const data = location.data
            console.log('data',data)
            addressSearchByName(data.address,(address) => {
                setLocationData({
                    address: address,
                    converseGpsButtonFG:!locationData.converseGpsButtonFG
                })
            }) 
        }

        
    };

    // 이벤트 헨들러
    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.replace( ACTION.LINK_CH00002046_ADDRESS);
    };

    // 이벤트 핸들러 (맵 움직일때마다 태우는 이벤트..... 중요)
    const onChangeCenterListener = (data) => {
        addressSearchByCoords(data.getLat(), data.getLng(),(address)=>{
            setLocationData({
                ...locationData,
                address: address
            });
        })
    }

    // 이벤트 핸들러
    const dispatchGetLocationCallback = (event) => {
        console.log('dispatchGetLocationCallback', event)
        const code = event.detail.code
        const lat = event.detail.latitude
        const lng = event.detail.longitude

        if(code){
            addressSearchByCoords(lat, lng,(address)=>{
                setLocationData({
                    address: address,
                    converseGpsButtonFG: !locationData.converseGpsButtonFG
                })
            })
        }else{
            addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                setLocationData({
                    address: address,
                    converseGpsButtonFG: !locationData.converseGpsButtonFG
                });
            });   
        }
        
    }

    if(locationData === null) return <></>

    return (
        <>
            <div id="wrap">
                <div id="header">
                    <div className="headerTop">
                        <div className="leftArea">
                            <button onClick={onClickBackBtn} className="icon pageBack">Back</button>
                        </div>            
                        <div className="middleArea">
                            <h1 className="headerTitle">배달 주소 설정</h1>
                        </div>
                    </div>
                </div>
                <div id="container">
                    <AddressSettingSection history={history} defaultAddress={locationData} callback={gpsNavigator} onChangeCenterListener={onChangeCenterListener}/>
                </div>
            </div>
        </>
    )
}

/**
 * 주소 부분 컴포넌트
 *  -> 상세주소
 * @param {*} param0 
 */
const AddressSettingSection = ({history, defaultAddress, callback, onChangeCenterListener})=>{

    /** 
     * hook
     */
    let defaultLat = defaultAddress.address == null ? 0 : defaultAddress.address.y;
    let defaultLng = defaultAddress.address === null ? 0 : defaultAddress.address.x;
    const {dispatch,data} = useContext(SDLContext);
    const inputRef = useRef();
    const address_name = defaultAddress.address === null ? "" : defaultAddress.address.address_name;
    const road_address_name = defaultAddress.address === null ? "" :
    defaultAddress.address.road_address !== null ? defaultAddress.address.road_address.address_name : '';
    /** 
     * hook
     */
    useEffect(()=>{
        //다 그리고 해야함
        if (defaultLat !== 0 && defaultLng !== 0){

            let latlng = new kakao.maps.LatLng();
            let container = document.getElementById("myMap");

            let options = {
                center: new kakao.maps.LatLng(defaultLat, defaultLng),
                level: 3
            };
            let map = new window.kakao.maps.Map(container, options);
            let markerPosition;
            let marker;

            markerPosition = new kakao.maps.LatLng(defaultLat, defaultLng); 

            marker = new kakao.maps.Marker({
                position: markerPosition
            });
                
            let infowindow = new kakao.maps.InfoWindow({
                content: '<div class="customHere">현재 위치</div>'
            });

            marker.setMap(map);
            infowindow.open(map, marker);

            // center changed시 마커 위치 함께 조정
            kakao.maps.event.addListener(map, 'center_changed', function(mouseEvent) {

                infowindow.close()

                marker.setPosition(map.getCenter())

                infowindow.open(map, marker);
            })
            
            // map 확대 수준이 변경되면 좌표로 현재 주소 표시
            kakao.maps.event.addListener(map, 'zoom_changed', function() {

                infowindow.open(map, marker);

                // 마커의 위치 가져오기
                latlng = map.getCenter();
            
                inputRef.current.value = ''
                onChangeCenterListener(latlng);
                
                // latlng2Addr( latlng.getLng(), latlng.getLat() )
            })

            // map drag end시 좌표로 현재 주소 표시
            kakao.maps.event.addListener(map, 'dragend', function() {

                infowindow.open(map, marker);

                // 마커의 위치 가져오기
                latlng = map.getCenter();
            
                inputRef.current.value = ''
                onChangeCenterListener(latlng);
                
                // latlng2Addr( latlng.getLng(), latlng.getLat() )
            })

            return() => {
                let container = document.getElementById("myMap");
                let options = {
                    center: new kakao.maps.LatLng(0, 0),
                    level: 3
                };
                let map = new window.kakao.maps.Map(container, options);    
            }
        }

    }, [defaultAddress.converseGpsButtonFG]);
  
    // 이벤트 핸들러
    const handleBtnClick = () => {
        const detailAddress = inputRef.current.value
        const addressData = {...defaultAddress, address_detail : detailAddress}

        pushDefaultAddress(addressData,'KAKAO_API')
        pushSearchAddress(addressData)

        if(data.channel.channelUIType === 'C'){
            dispatch({type:REDUCER_ACTION.SAVED_DELIVERY_ADDRESS})
        }
       let jsonAddressData = {
        defaultAddress : addressData,
        searchAddress : addressData
       };
       //앱종료
       SDL_dispatchCloseApp(jsonAddressData);
    }

    // 이벤트 핸들러 (내 위치)
    const handlechangeMarkerClinck = (e) => {
        //주소 바뀔때 들어왔을때만
        setTimeout(()=>{
            callback(1, true);   
        }, 1000)     
    };

    return (
        <>
            <div className="">
                <div className="mapSearch">
                    <div className="mapArea" id="myMap" >지도 영역</div> 
                    <div className={styles.category}>
                        <ul>
                            <li id="coffeeMenu" onClick={handlechangeMarkerClinck}>
                                <img src = {gpsImage}></img>
                                <p>내위치</p> 
                            </li>
                        </ul>
                    </div>
                    <div className="mapAddress">
                        <p className="addressMain">{address_name}</p>
                        <p className="addressDetail">[도로명] {road_address_name}</p>
                        <div className="addressInput">
                            <span className="textInput">
                                <input type="text" title="검색" placeholder="상세주소를 입력하세요(건물명, 동/호수 등)" ref={inputRef}/>
                            </span>
                        </div>
                        <div className="btnWrap fullWidth topBlock">
                            <button onClick={handleBtnClick} className="btn login default"><strong>완료</strong></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



