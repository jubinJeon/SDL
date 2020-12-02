/*global kakao*/
import React, { useEffect, useState, useRef,useContext } from 'react';

import { pushDefaultAddress, pushSearchAddress,getOS,addressSearchByCoords,addressSearchByName } from '../../util/Utils';
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import {SDL_dispatchGetLocation, SDL_dispatchCompleteAddress} from '../../appBridge'
import gpsImage from './image/gpsImg.jpg';
import gpsHeaderImage from './image/headerGps.jpg';

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
    const [locationData, setLocationData] = useState(null);
    const [converseGpsButtonFg, setConverseGpsButtonFg] = useState(false);

    /** 
     * hook
     */
    useEffect(()=>{
        window.addEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)

        const type = location.type;
        gpsNavigator(type);

        return () =>{
        window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        }
    },[])

    //gps 현재 위치 
    const gpsNavigator = (type) => {
        if(type === 1){ // 현재위치로 검색
            //애플만
            if(getOS() === 'IOS'){
                //앱 브리지 연결
                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                    SDL_dispatchGetLocation();
                }else{
                    //모범생 채널일 경우 
                    if(data.channel.channelCode === 'CH00002046'){
                        addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                            setConverseGpsButtonFg(!converseGpsButtonFg);
                            setLocationData(address);                     
                        });   
                    }else{
                        addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                            setConverseGpsButtonFg(!converseGpsButtonFg);
                            setLocationData(address);                     
                        });   
                    }
                }           
            }else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {   
                        //web에서 위치 정보찾기    
                        addressSearchByCoords(position.coords.latitude,position.coords.longitude,(address)=>{
                            setConverseGpsButtonFg(!converseGpsButtonFg);
                            setLocationData(address);     
                        });
                    }, function(error) {
                        console.error(error);     
                        //모범생 채널일 경우                  
                        if(data.channel.channelCode === 'CH00002046'){
                            addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                                setConverseGpsButtonFg(!converseGpsButtonFg);
                                setLocationData(address);                     
                            });   
                        }else{
                            addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                                setConverseGpsButtonFg(!converseGpsButtonFg);
                                setLocationData(address);    
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
                            setConverseGpsButtonFg(!converseGpsButtonFg);
                            setLocationData(address);                     
                        });   
                    }else {      
                        addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                            setConverseGpsButtonFg(!converseGpsButtonFg);
                            setLocationData(address);    
                        });       
                    }
                }
            }
        }else if (type === 2){ // 주소로 검색
            const data = location.data
            console.log('data',data)
            addressSearchByName(data.address,(address) => {
                setConverseGpsButtonFg(!converseGpsButtonFg);
                setLocationData(address);    
            }) 
        }
    };

    // 이벤트 헨들러 (뒤로 버튼)
    const onClickBackBtn = (e) => {
        e.preventDefault();
        dispatch({type: REDUCER_ACTION.HISTORY_BACK})
    };

    // 이벤트 핸들러 ( 카카오 확대, 움직일때 등 이벤트)
    const onChangeCenterListener = (data) => {
        addressSearchByCoords(data.getLat(), data.getLng(),(address)=>{
            setLocationData(address);
        })
    }

    // 이벤트 핸들러
    const dispatchGetLocationCallback = (event) => {
        console.log('dispatchGetLocationCallback', event)
        const code = event.detail.code
        const lat = event.detail.latitude
        const lng = event.detail.longitude

        if(code){
            addressSearchByCoords(lat, lng,(address)=> {
                // TODO: iOS인 경우 임시조치함. 향후 수정 필요 
                setConverseGpsButtonFg(false);
                setConverseGpsButtonFg(true);
                setLocationData(address);                  
            })
        }else{
            if(data.channel.channelCode === 'CH00002046'){
                addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{                 
                    // TODO: iOS인 경우 임시조치함. 향후 수정 필요 
                    setConverseGpsButtonFg(false);
                    setConverseGpsButtonFg(true);
                    setLocationData(address);    
                });

            }else{
                addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                    // TODO: iOS인 경우 임시조치함. 향후 수정 필요 
                    setConverseGpsButtonFg(false);
                    setConverseGpsButtonFg(true);
                    setLocationData(address);    
                });
            }
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
                    <AddressSettingSection history={history} converseGpsButtonFg={converseGpsButtonFg} defaultAddress={locationData} callback={gpsNavigator} onChangeCenterListener={onChangeCenterListener} from = {location.state.from}/>
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
const AddressSettingSection = ({history, converseGpsButtonFg, defaultAddress, callback, onChangeCenterListener,from})=>{

    // console.log('AddressSettingSection defaultAddress: ', defaultAddress)

    const {dispatch,data} = useContext(SDLContext);
    const inputRef = useRef();

    /** 
     * hook
     */
    let lat = defaultAddress.y;
    let lng = defaultAddress.x;
    
    const address_name = defaultAddress.address.address_name;
    const road_address_name = defaultAddress.road_address !== null ? defaultAddress.road_address.address_name : '';

    /** 
     * hook
     */
    useEffect(()=>{
        // 카카오 맵 그리기
        let latlng = new kakao.maps.LatLng();
        let container = document.getElementById("myMap");
        let options = {
            center: new kakao.maps.LatLng(lat, lng),
            level: 3
        };
        let map = new window.kakao.maps.Map(container, options);
        let markerPosition;
        let marker;

        markerPosition = new kakao.maps.LatLng(lat, lng); 
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
        });

        return () => {
            //카카오 맵 계속 쌓이기 때문에 삭제
            document.querySelector("#myMap > div:nth-child(3)").remove();
            document.querySelector("#myMap > div:nth-child(2)").remove();
            document.querySelector("#myMap > div:nth-child(1)").remove();
        }
    }, [converseGpsButtonFg]);

    // 이벤트 핸들러 (완료버튼)
    const handleBtnClick = () => {
        const detailAddress = inputRef.current.value;
        const addressData = {...defaultAddress, address_detail : detailAddress};

        pushDefaultAddress(addressData,'KAKAO_API');
        pushSearchAddress(addressData);

        // 주소 
        let jsonAddressData = {
            defaultAddress : addressData,
            searchAddress : addressData
        };
        // 추가 앱 보내기
        SDL_dispatchCompleteAddress(jsonAddressData);
        if(data.channel.channelUIType === 'C'){
            dispatch({type:REDUCER_ACTION.SAVED_DELIVERY_ADDRESS})
        }
     
        history.replace(from);
    }

    // 이벤트 핸들러 (내 위치 GPS) 
    const handlechangeMarkerClinck = (e) => {
         e.stopPropagation();
        setTimeout(()=>{
            callback(1);   
        }, 50);   
    };

    // Component GPS IMAGE
    const gpsButton =  
        <div id = "gpsButton" className={styles.category}>
            <img src={gpsImage} onClick={handlechangeMarkerClinck}></img>
        </div>;

    // Component image 
    const gpsHeaderImageComponent = 
        <div id = "gpsHeaderImage" className={styles.headerGpsImage}>
            <img src = {gpsHeaderImage}></img>
        </div>;

    return (
        <>
            <div className="">
                <div className="mapSearch">
                    {/**gps KAKAO map */}
                    <div className="mapArea" id="myMap" ></div>
                    {gpsHeaderImageComponent}
                    {gpsButton}         
                    {/**하단 컴포넌트*/}
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



