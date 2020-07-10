/*global kakao*/
import React, { useEffect, useState, useRef } from 'react';

import useAsync from '../../hook/useAcync'
import * as API from '../../Api'

import { decimalToMeterFormat, pullDefaultAddress } from '../../util/Utils';
import SingleMarketCmpnt from '../../components/SingleMarketCmpnt'

const fmt = decimalToMeterFormat

export default ( {history} ) => {

    return (
        <>
            <Map history={history}/>
        </>
    )
}

const Map = ( {history} ) => {

    const [activeBtn, setActiveBtn] = useState(true)

    // 초기 중심 좌표(최초 생성시에만 사용)
    const [cntrLat, setCntrLat] = useState(0.00);
    const [cntrLon, setCntrLon] = useState(0.00);

    // API 호출에 사용하는 중심 좌표
    const [latitude, setLatitude]= useState(0.00);
    const [longitude, setLongitude] = useState(0.00);
    const [regionCode, setRegionCode] = useState(0);

    const [mapCreated, setMapCreated] = useState(false);

    var geocoder = new kakao.maps.services.Geocoder();
    
    var container
    var map = useRef();

    // var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    
    // 가게 상세 정보 데이터
    const [states, setStates] = useState({
        isOpen: "",
        isBreakTime: "",
        isHld: "",
        
        isNewStr: "N",  /* 신규 매장 여부 */
        strId: 0,  /* 매장 코드 */
        strNm: '',  /* 매장명 */
        strStusCd: '',  /* 매장 상태 구분 */
        distance: 0,    /* 거리 */
        pickYn: 0,    /* 픽업 여부 */
        dlvYn: 'n',      /* 픽업 여부 */
        rvwCnt: 0,    /* 리뷰 개수 */
        avrgStarPnt: 0.0,  /* 별점 평균 */
        imgModNm: '',        /* 이미지 경로 */
        bizCtgGrp: '',      /* 업종 카테고리 */
        bizCtgGrpNmMi: '',  /* 업종 카테고리이미지 */
        bizCtgDtl: '',

        /* 대표 메뉴 */
        prpPrdNm1: '',
        prpPrdNm2: '',
        prpPrdNm3: '',

        /* 최소 금액 */
        dlMinOrdrPrc9icp: 0,
        dlMinOrdrPrc9ica: 0,
        dlMinOrdrPrc9icm: 0,
      
        /* 배달팁 */
        dlPrc1: 0,
        dlPrc2: 0,
        dlPrc3: 0,
        
        dlMinOrdrPrc: 0, /* 배달최소금액 */
        puMinOrdrPrc: 0, /* 픽업최소금액 */
       
        discRateUseFg: 0, /* 할인율사용여부    */
        discRate: 0,    /* 할인율           */

        expDlvTm: 0     /* 예상 소요 시간 */
    });

    // 가게 상세 컴포넌트 컨트롤 state
    const [showInfoArea, setShowInfoArea] = useState(false)

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    // 현재 위치로 지도 중심 설정
    const setPosByCurrent = () => {
        setActiveBtn(true)
        navigator.geolocation.getCurrentPosition(function(position) {
            setCntrLat(position.coords.latitude);
            setCntrLon(position.coords.longitude);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);

            map.current.setCenter(new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }, function(error) {
          console.error(error);
        }, {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity
        });
    }
    
    useEffect(() => {

        // 초기 중심 좌표 설정
        if (navigator.geolocation) {
            setPosByCurrent()
        } else {
            setCntrLat(33.450701);
            setCntrLon(126.570667);
            alert('GPS를 지원하지 않습니다');
        }

        // 최초 지도 생성 & 이벤트 등록
        if( !mapCreated && cntrLat != 0 && cntrLon != 0) {

            // map options
            container = document.getElementById("myMap");
            var options = {
                center: new kakao.maps.LatLng(cntrLat, cntrLon),
                level: 3
            };
            
            map.current = new window.kakao.maps.Map(container, options)

            setMapCreated(true);
            map.current.setMaxLevel(7);
            
            kakao.maps.event.addListener(map.current, 'click', function(mouseEvent) {
                // console.log('map clicked but not marker')
                setShowInfoArea(false)
            })

            const setLatLng = function() {
                // 지도의 중심좌표
                var latlng = map.current.getCenter();
                
                setLatitude(latlng.getLat())
                setLongitude(latlng.getLng())
            }
            
            // 지도 드래그 이동 or 중심 좌표 변경시 중심 좌표 변경
            kakao.maps.event.addListener(map.current, 'dragend', setLatLng)
            kakao.maps.event.addListener(map.current, 'zoom_changed', setLatLng)
        }

    }, [cntrLon]);

    // 주소지 클릭
    const setPosByMyAddress = () => {
        const storedDefaultAddress = pullDefaultAddress()
        
        map.current.setCenter(new kakao.maps.LatLng(storedDefaultAddress.y, storedDefaultAddress.x));
        
        setLatitude(storedDefaultAddress.y)
        setLongitude(storedDefaultAddress.x)

        setActiveBtn(false)
    }

    // 변경된 좌표로 법정 코드 가져오기
    useEffect(() => {
        
        geocoder.coord2RegionCode(longitude, latitude, function(result, status) {
            setRegionCode(result[0].code)
        });
    }, [longitude])
    
    // 중심 좌표, 행정 코드 변경시 API 호출
    const [state, refetch] = useAsync(() => {
        
        if( mapCreated && latitude != 0 && longitude != 0  && regionCode && regionCode != 0) {
            // console.log('API Called with '+ latitude, longitude, regionCode)
            
            return API.getArround(latitude, longitude, regionCode)
        }
    }, [regionCode]);

    const { loading, error, data } = state;

    // 조회 데이터 변동 시 마커들 표시
    useEffect(() => {
        // console.log(state)

        const mapRef = map.current

        if( !loading && data ) {

            var positions = [
                data.data.map((store) => {
                    
                    return {
                        title: store.strNm,
                        latlng: new kakao.maps.LatLng(store.strLat, store.strLng),
                        data: store
                    }
                })
            ]

            const markerArray = positions[0]

            const icondir = "/common/images/icon/map/"
            
            markerArray.map((storeInfo) => {
                const data = storeInfo.data
                
                var imgUri = data.isOpen === "N" || data.isBreakTime === "Y" || data.isHld === "Y" ?
                    imgUri = icondir+'d_'+data.bizCtgDtl+'.png'
                    : icondir+'a_'+data.bizCtgDtl+'.png'

                // if(data.strStusCd === "AC") imgUri = icondir+'a_'+data.bizCtgDtl+'.png'
                // else imgUri = icondir+'d_'+data.bizCtgDtl+'.png'
                
                var img = new Image()
                img.src = imgUri
                var imageSize = new kakao.maps.Size(img.width*2/3, img.height*2/3);

                var markerImage = new kakao.maps.MarkerImage(imgUri, imageSize);
                
                var marker = new kakao.maps.Marker({
                    map: mapRef,
                    position: storeInfo.latlng,
                    title : storeInfo.title,
                    image : markerImage // 마커 이미지
                });

                var content = `<div class="customoverlay" />
                                    <span>${storeInfo.title}</span>
                                </div>`
                var customOverlay = new kakao.maps.CustomOverlay({
                    map: mapRef,
                    position: storeInfo.latlng,
                    content: content,
                    yAnchor: 1
                })
                

                // 가게 정보 저장을 위한 클로저
                function addStoreInfo(marker, data) {
                    return function() {
                        
                        // console.log(data)
                        setStates({
                            isOpen: data.isOpen,
                            isBreakTime: data.isBreakTime,
                            isHld: data.isHld,

                            isNewStr: data.isNewStr, /* 신규 매장 여부 */
                            strId: data.strId,  /* 매장 코드 */
                            strNm: data.strNm,  /* 매장명 */
                            strStusCd: data.strStusCd,  /* 매장 상태 구분 */
                            distance: data.distance,    /* 거리 */
                            pickYn: data.pickYn,    /* 픽업 여부 */
                            dlvYn: data.dlvYn,      /* 픽업 여부 */
                            rvwCnt: data.rvwCnt,    /* 리뷰 개수 */
                            avrgStarPnt: data.avrgStarPnt,  /* 별점 평균 */
                            imgModNm: data.imgModNm,        /* 이미지 경로 */
                            bizCtgGrp: data.bizCtgGrp,      /* 업종 그룹 */
                            bizCtgGrpNmMi: data.bizCtgGrpNmMi,
                            bizCtgDtl: data.bizCtgDtl,

                            /* 대표 메뉴 */
                            prpPrdNm1: data.prpPrdNm1,
                            prpPrdNm2: data.prpPrdNm2,
                            prpPrdNm3: data.prpPrdNm3,

                            /* 최소 금액 */
                            dlMinOrdrPrc9icp: data.dlMinOrdrPrc9icp,
                            dlMinOrdrPrc9ica: data.dlMinOrdrPrc9ica,
                            dlMinOrdrPrc9icm: data.dlMinOrdrPrc9icm,
                          
                            /* 배달 가격 */
                            dlPrc1: data.dlPrc1,
                            dlPrc2: data.dlPrc2,
                            dlPrc3: data.dlPrc3,

                            /* 배달 최소주문금액        */
                            dlMinOrdrPrc: data.dlMinOrdrPrc,
                            /* 픽업 최소주문금액        */
                            puMinOrdrPrc: data.puMinOrdrPrc,

                            /* 할인율사용여부  */
                            discRateUseFg: data.discRateUseFg,
                            /* 할인율      */
                            discRate: data.discRate,

                            /* 소요 시간 */
                            expDlvTm: data.expDlvTm

                            /* 배달팁 할인여부 */
                        })
                        setShowInfoArea(true)
                    }
                }

                kakao.maps.event.addListener(marker, 'click', addStoreInfo(marker, data))
            })
        }
    }, [state])

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
                                <li><button type="button" className={activeBtn ? "btnType": "btnType active"} onClick={setPosByMyAddress}>주소지</button></li>
                                <li><button type="button" className={activeBtn ? "btnType active": "btnType"} onClick={setPosByCurrent}>현위치</button></li>
                            </ul>
                            <div className="mapArea" id="myMap"></div>
                            { showInfoArea && <InfoArea data={states} /> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
};

const InfoArea = ( states ) => {
    const data = states.data

    useEffect(() => {
        console.log(data)
    })

    return (
        <div className="mapAddress">
            <ul className="listContent">
                <li>
                    {data && <SingleMarketCmpnt market={data} /> }
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
