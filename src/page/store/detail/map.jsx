/*global kakao*/
import React, { useEffect, useState } from 'react';

export default ({history, location}) => {

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.goBack();
    };

    // 중심 좌표
    const [cntrLat, setCntrLat] = useState(0.00);
    const [cntrLon, setCntrLon] = useState(0.00);
    
    useEffect(() => {
        console.log(location)
        if(location.address != null) {
            // 주소-좌표 변환 객체
            var geocoder = new kakao.maps.services.Geocoder();

            geocoder.addressSearch(location.address, function(result, status) {

                 if (status === kakao.maps.services.Status.OK) {
            
                    var latlng = new kakao.maps.LatLng(result[0].y, result[0].x);

                    setCntrLat(latlng.getLat());
                    setCntrLon(latlng.getLng());
                }
            });    
        }
    }, [])

    useEffect(() => {
        if(cntrLat != 0 && cntrLon != 0) {

            // map options
            let container = document.getElementById("myMap");
            let options = {
                center: new kakao.maps.LatLng(cntrLat, cntrLon),
                level: 3
            };
            let map = new window.kakao.maps.Map(container, options);

            var markerPosition = new kakao.maps.LatLng(cntrLat, cntrLon); 
            var marker = new kakao.maps.Marker({
                position: markerPosition
            });
            
            // var infowindow = new kakao.maps.InfoWindow({
            //     content: '<div class="customoverlay" style="width:150px;text-align:center;padding:6px 0;">'+location.storeNm+'</div>'
            // });
            var content = `<div class="customoverlay" />
                                    <span>${location.storeNm}</span>
                                </div>`
            var customOverlay = new kakao.maps.CustomOverlay({
                map: map,
                position: markerPosition,
                content: content,
                yAnchor: 1
            })

            map.setMaxLevel(7);
            marker.setMap(map);

            // infowindow.open(map, marker);

        }
    }, [cntrLon])

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={onClickBackBtn} className="icon pageBack">Back</a>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">위치확인</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="mapSearch">
                            <div className="mapArea" id="myMap"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}