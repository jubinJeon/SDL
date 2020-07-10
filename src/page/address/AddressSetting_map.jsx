/*global kakao*/
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { pushDefaultAddress, pushSearchAddress } from '../../util/Utils';
import useAddress from '../../hook/useAddress'

import * as ACTION from '../../common/ActionTypes'

export default ( {history, location} ) => {

    const [param, setParam] = useState(location.type === 1 ? {type : location.type} : 
        location.type === 5 ? {type : location.type} : {type: location.type, addressName : location.data.address})

    // const addressParam = location.type === 1 ? {type : location.type} : {type: location.type, addressName : location.data.address_name}
    const defaultAddress = useAddress(param,[param])

    // console.log('defaultAddress',defaultAddress);

    // const defaultAddress = useAddress(param, [param])

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack();
    };

    const onChangeCenterListener = (data) => {
        setParam({type: 3, latitude : data.Ha, longitude : data.Ga, })
    }

    if(Object.keys(defaultAddress).length === 0) {
        return null;
    }

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
                    <AddressSettingSection history={history} defaultAddress={defaultAddress} onChangeCenterListener={onChangeCenterListener}/>
                </div>
            </div>
        </>
    )
}



const AddressSettingSection = ({history, defaultAddress, onChangeCenterListener})=>{

    // console.log('AddressSettingSection defaultAddress: ', defaultAddress)

    const inputRef = useRef()

    const [coords, setCoords] = useState({lat : defaultAddress.y, lng : defaultAddress.x})
    const address_name = defaultAddress.address.address_name;
    const road_address_name = defaultAddress.road_address !== null ? defaultAddress.road_address.address_name : '';

    const handleBtnClick = () => {
        const detailAddress = inputRef.current.value
        const addressData = {...defaultAddress, address_detail : detailAddress}

        pushDefaultAddress(addressData)
        pushSearchAddress(addressData)

        history.replace(ACTION.LINK_HOME)
    }

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

