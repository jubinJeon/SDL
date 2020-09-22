/*global kakao*/
import {useEffect, useState} from 'react';
import { pullDefaultAddress,getOS } from '../util/Utils'
import {SDL_dispatchGetLocation} from '../appBridge'

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

    const dispatchGetLocationCallback = (event) => {
        console.log('useAddress dispatchGetLocationCallback', event)
        const code = event.detail.code
        const lat = event.detail.latitude
        const lng = event.detail.longitude

        if(code){
            const coords = {latitude:lat,longitude:lng}
            addressSearchByCoords(coords,setDefaultAddress)
        }else{
            const coords = {latitude:37.5085848476582,longitude:126.888897552736}
            addressSearchByCoords(coords,setDefaultAddress)
        }
        
    }

    useEffect(()=>{
        window.addEventListener('useAddress SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
    
        return () =>{
        window.removeEventListener('useAddress SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        }
    },[])

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


    if(getOS() === 'IOS'){

        if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
            SDL_dispatchGetLocation()
        }else{
            const coords = {latitude:37.5085848476582,longitude:126.888897552736}
            addressSearchByCoords(coords,callback)
        }           
    }else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {

                addressSearchByCoords(position.coords,callback)

            }, function(error) {
                const coords = {latitude:37.5085848476582,longitude:126.888897552736}
                addressSearchByCoords(coords,callback)
    
            }, {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 2000
            });
        }else{
            const coords = {latitude:37.5085848476582,longitude:126.888897552736}
            addressSearchByCoords(coords,callback)
        }
    }

}


export default useAddress;