/*global kakao*/
import {useEffect} from 'react';
import { pullDefaultAddress } from '../util/Utils'
import { useState } from 'react';

const geocoder =  new kakao.maps.services.Geocoder();

/**
 * 1: 현재위치
 * 2: 주소명으로 검색
 * 3: 위경도로 검색
 * 4: 로컬에 저장되어 있는 주소정보 반환 
 * @param {*} param0 
 * @param {*} deps 
 */
const useAddress = ({latitude,longitude,addressName,type}, deps = []) => {

    const [defaultAddress, setDefaultAddress ] = useState({})
    // console.log('useAddress latitude',latitude)
    // console.log('useAddress longitude',longitude)
    // console.log('useAddress addressName',addressName)
    // console.log('useAddress type',type)

    useEffect(() => {

            switch(type){
                case 1:
                    addressSearch(setDefaultAddress)
                break;
                case 2:
                    addressSearchByName(addressName,setDefaultAddress)
                break;
                case 3:
                    const coords = {latitude:latitude,longitude:longitude}
                    addressSearchByCoords(coords, setDefaultAddress)
                break;
                case 4:
                    setDefaultAddress(pullDefaultAddress())
                break;
                default:
            }
        
    }, deps)

    return defaultAddress;
}

const addressSearchByName = (addressText,callback) => {

    geocoder.addressSearch(addressText, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            callback(result[0]);
       }
   });
}

const addressSearchByCoords = (coords, callback) => {
    
    geocoder.coord2Address(coords.longitude, coords.latitude, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            // console.log('addressSearchByCoords coord2Address', result[0].address.address_name)
            addressSearchByName(result[0].address.address_name,callback)
        }   
    });
}


const addressSearch = (callback) => {

    // Geolocation API에 액세스할 수 있는지 확인
    if (navigator.geolocation) {
        //위치 정보를 얻기
        
            navigator.geolocation.getCurrentPosition (function(pos) {
                console.log('useAddress navigator.geolocation.getCurrentPosition',pos)
                addressSearchByCoords(pos.coords,callback)
            }, function (){
                addressSearchByCoords({longitude : 126.888897552736 , latitude : 37.5085848476582},callback)
            });
       
        
    } else {
        alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.")
    }
}


export default useAddress;