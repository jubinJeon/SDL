/*global kakao*/
import React, { useEffect, useState, useRef,useContext } from 'react';

import { pushDefaultAddress, pushSearchAddress,getOS,addressSearchByCoords,addressSearchByName } from '../../util/Utils';
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import {SDL_dispatchGetLocation} from '../../appBridge'

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

    /** 
     * hook
     */
    useEffect(()=>{

        window.addEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)

        const type = location.type

        if(type === 1){ // 현재위치로 검색
            if(getOS() === 'IOS'){
                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                    SDL_dispatchGetLocation()
                }else{
                    addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                        setLocationData(address);
                    });   
                }           
            }else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {     
                        addressSearchByCoords(position.coords.latitude,position.coords.longitude,(address)=>{
                            setLocationData(address)
                        })
        
                    }, function(error) {
                   
                        console.error(error);
                        addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                            setLocationData(address);
                        });
            
                    }, {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 2000
                    });
                }else{             
                    addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                        setLocationData(address);
                    });
                }
            }
        }else if (type === 2){ // 주소로 검색
            const data = location.data
            console.log('data',data)
            addressSearchByName(data.address,(address) => {
                setLocationData(address)
            })
            
        }

        return () =>{
        window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        }
    },[])

    // 이벤트 헨들러
    const onClickBackBtn = (e) => {
        e.preventDefault();

        dispatch({type: REDUCER_ACTION.HISTORY_BACK})
    };

    // 이벤트 핸들러
    const onChangeCenterListener = (data) => {
        addressSearchByCoords(data.getLat(), data.getLng(),(address)=>{
            setLocationData(address)
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
                setLocationData(address)
            })
        }else{
            addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                setLocationData(address);
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
                    <AddressSettingSection history={history} defaultAddress={locationData} onChangeCenterListener={onChangeCenterListener} from = {location.state.from}/>
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
const AddressSettingSection = ({history, defaultAddress, onChangeCenterListener,from})=>{

    // console.log('AddressSettingSection defaultAddress: ', defaultAddress)

    const {dispatch,data} = useContext(SDLContext);

    const inputRef = useRef()

    /** 
     * hook
     */
    const [coords, setCoords] = useState({lat : defaultAddress.y, lng : defaultAddress.x})
    const address_name = defaultAddress.address.address_name;
    const road_address_name = defaultAddress.road_address !== null ? defaultAddress.road_address.address_name : '';

    /** 
     * hook
     */
    useEffect(()=>{

        let latlng = new kakao.maps.LatLng();
        let container = document.getElementById("myMap");

        let options = {
            center: new kakao.maps.LatLng(coords.lat, coords.lng),
            level: 3
        };
        let map = new window.kakao.maps.Map(container, options);
        let markerPosition;
        let marker;

        markerPosition = new kakao.maps.LatLng(coords.lat, coords.lng); 

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

    }, [])

    
    // 이벤트 핸들러
    const handleBtnClick = () => {
        const detailAddress = inputRef.current.value
        const addressData = {...defaultAddress, address_detail : detailAddress}

        pushDefaultAddress(addressData,'KAKAO_API')
        pushSearchAddress(addressData)

        if(data.channel.channelUIType === 'C'){
            dispatch({type:REDUCER_ACTION.SAVED_DELIVERY_ADDRESS})
        }
        history.replace(from)
    }

    return (
        <>
            <div className="">
                <div className="mapSearch">
                    <div className="mapArea" id="myMap" >지도 영역</div>
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



