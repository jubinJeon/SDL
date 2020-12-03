import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link , useLocation} from 'react-router-dom';
import SingleMarketCmpnt from '../../../components/SingleMarketCmpnt'

import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { pullDefaultAddress, pullShowScreen, pushDefaultAddress, pushShowScreen,getOS , addressSearchByCoords } from '../../../util/Utils'
import {SDL_dispatchGetLocation} from '../../../appBridge'

import {SDLContext} from '../../../context/SDLStore'
import {REDUCER_ACTION} from '../../../context/SDLReducer'


const Stores = ({ history }) => {
    
    const [locationData, setLocationData] = useState(null);
    const {dispatch,data} = useContext(SDLContext);
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
                addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                    setLocationData(address);
                    pushDefaultAddress(address,'DEFAULT');             
                });   
            }else{
                addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
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

            setLocationData(storedDefaultAddress);

        }else{
            if(getOS() === 'IOS'){

                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                    SDL_dispatchGetLocation();
                }else{
                    //모범생 채널일 경우 
                    if(data.channel.channelCode === 'CH00002046'){
                        addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                            setLocationData(address);
                            pushDefaultAddress(address,'DEFAULT');             
                        });   
                    }else{
                        addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                            setLocationData(address);
                            pushDefaultAddress(address,'DEFAULT');
                        });   
                    }
                }           
            }else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        addressSearchByCoords(position.coords.latitude,position.coords.longitude,(address)=>{
                            setLocationData(address);
                            pushDefaultAddress(address);
                        })
                    }, function(error) {
                        console.error(error);
                        //모범생 채널일 경우 
                        if(data.channel.channelCode === 'CH00002046'){
                            addressSearchByCoords(37.3406045599450, 127.939619279104,(address)=>{
                                setLocationData(address);
                                pushDefaultAddress(address,'DEFAULT');             
                            });   
                        }else{
                            addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                                setLocationData(address);
                                pushDefaultAddress(address,'DEFAULT');
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
                            setLocationData(address);
                            pushDefaultAddress(address,'DEFAULT');             
                        });   
                    }else{
                        addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                            setLocationData(address);
                            pushDefaultAddress(address,'DEFAULT');
                        });   
                    }
                }
            }
        }

        return () =>{
            window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback, false)
        }
    },[])


    const screenData = pullShowScreen()
    const setScreenData = {
        bizCtgGrp : screenData.bizCtgGrp,
        orderType : 0,
        searchKeyword : screenData.searchKeyword
    }

    pushShowScreen(setScreenData)

    // if (locationData === null) return <></>

    return (
        <>
            <Header defaultAddress = {locationData} history = {history} />
            <ContentSection defaultAddress = {locationData} bizCtgDtlData = {screenData.bizCtgGrp}/>
        </>
    );
};

const Header = ({defaultAddress, history})=>{

    const {dispatch} = useContext(SDLContext);
    const location = useLocation()

    const onClickBackBtn = (e) => {
        e.preventDefault();
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    };

    let address = '';

    if(defaultAddress !== null && Object.keys(defaultAddress).length !== 0){
        if(defaultAddress.road_address){
            address = defaultAddress.road_address.address_name
        }else{
            address = defaultAddress.address.address_name
        }
    }
    
    return (
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                        <button className="icon pageBack" onClick={onClickBackBtn}>Back</button>
                    </div>           
                <div className="middleArea">
                <Link to={{pathname: ACTION.LINK_ADDRESS_SETTING, state : {headerTitle : '주소검색', from : location}}} replace className="addressBox">{address}</Link>
                </div>
            </div>
        </div>
    );
}

const ContentSection = ({defaultAddress, bizCtgDtlData}) => {

    const {data} = useContext(SDLContext);
    const [bizCtgGrp, setBizCtgDtl] = useState(bizCtgDtlData)

    return(
        <>
            <div id="container">
                <div id="content">
                    <div>
                        {
                            // 채널링 타입 카테고리 표현여부
                            (data.channel.channelUIType === 'A' || data.channel.channelUIType === 'B') && <CategorySection callback = {setBizCtgDtl} bizCtgDtlData={bizCtgGrp}/>
                        }
                        {
                            bizCtgGrp === process.env.REACT_APP_REST_AREA_CATEGORY_CODE ?
                            <RestAreaSection bizCtgGrp={bizCtgGrp} defaultAddress = {defaultAddress} />
                            :
                            <StoresSection bizCtgGrp={bizCtgGrp} defaultAddress = {defaultAddress} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

const CategorySection = ({callback, bizCtgDtlData}) => {

    const [result, setResult] = useState(null);

    useEffect (() => {
        API.getCatogories()
            .then((data)=>{
                setResult(data.data);
            })
            .catch((error) => {
                setResult([]);
            })
    }, []);

    const handleTabChange1 = (event, newValue) => {

        callback(result[newValue].bizCtgGrp)
        
        const screenData = pullShowScreen()
        const data = {
            bizCtgGrp : result[newValue].bizCtgGrp,
            orderType : 0,
            searchKeyword : screenData.searchKeyword
        }
        pushShowScreen(data)
    };

    let tabIndex = -1;

    if(result === null) return <></>

    result.some((obj) => {
        tabIndex = tabIndex + 1
        if(obj.bizCtgGrp === bizCtgDtlData)
        return (obj.bizCtgGrp === bizCtgDtlData)
    })    

    return(
        <>
            <div className="listMenu fixed withMaterial">
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange1}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label=""
                    indicatorColor="primary"
                >
                { 
                    result !== null &&
                    result.map((label) => {
                        return (
                            <Tab key={label.bizCtgGrp} label={label.bizCtgGrpNm}/>
                        )
                    })
                }
                </Tabs>
            </div>
        </>
    )
}

const StoresSection = ({ bizCtgGrp, defaultAddress}) => {

    const [componentData, setComponentData] = useState(null);
    // const [sortFlag , setSortFlag] = useState('all')

    useEffect(()=>{
        if(defaultAddress !== null){
            setComponentData(null)
            API.getStores(defaultAddress.y, defaultAddress.x, bizCtgGrp, "", "", "")
                .then((data)=>{
                    // setResult(data);
                    setComponentData({sortFlag : 'all', allResultData : data.data, dlvResultData : data.data.filter(store => store.dlvYn === 'Y'), pickResultData : data.data.filter(store => store.pickYn === 'Y')})
                })
                .catch((error) => {
                    setComponentData({resultData : null})
                })
                .finally(() =>{
                    if(getOS() === 'IOS')
                        window.scrollTo(0,1);
                })
            }
    },[bizCtgGrp,defaultAddress])

    const setSortFlag = (flag) => {
        setComponentData({...componentData, sortFlag : flag})
    }

    const getData = (flag) => {
        if(flag === 'all'){
            return componentData.allResultData
        }else if(flag === 'dlv'){
            return componentData.dlvResultData
        }else if(flag === 'pic'){
            return componentData.pickResultData
        }
    }

    if (componentData === null) return <>
                                            <div className="pageLoding">
                                                <div className="stateWrap">
                                                    <div className="loading">로딩중...</div>
                                                </div>
                                            </div> 
                                        </>
    
    if (componentData.allResultData === null || componentData.allResultData.length === 0){
        return <>
                    <div className="emptyWrap noneData">
                        <div className="empty">
                            <p className="emptyMsg_1">매장목록 정보가 없습니다.</p>
                        </div>
                    </div>
                </>
    }
    
    return (

        <>
            <div className="listSort">
                {
                    componentData !== null &&
                    <div className="btnWrap leftCol">
                        <button type="button" onClick={(e) => {setSortFlag(e.currentTarget.value)}} value="all"
                            className={componentData.sortFlag === "all" ? "btn active" : "btn"}>전체</button>
                        <button type="button" onClick={(e) => {setSortFlag(e.currentTarget.value)}} value="dlv"
                            className={componentData.sortFlag === "dlv" ? "btn active" : "btn"}>배달</button>
                        <button type="button" onClick={(e) => {setSortFlag(e.currentTarget.value)}} value="pic"
                            className={componentData.sortFlag === "pic" ? "btn active" : "btn"}>픽업</button>
                    </div>
                }
            </div>
            <div className="listWrap">
                <ul className="listContent">
                    {
                        componentData !== null && getData(componentData.sortFlag).map((market)=>
                        <li key = {market.strId}>
                            <SingleMarketCmpnt  market={market} restYN ='N'/>
                        </li>
                        )
                    }
                </ul>
            </div>
        </>
    )
}

const RestAreaSection = ()=>{

    const [restAreas, setRestAreas] = useState(null)
    const [highways, setHignways] = useState(null)
    const [selectedHighwayCd, setSelectedHighwayCd] = useState('')
    const [locationData, setLocationData] = useState(null);

    const dispatchGetLocationCallback1 = (event) => {
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
                setLocationData(address)
            })
        }
    }

    useEffect (() => {
        const all = {hiwayNm : '전국고속도로',hiwayDescNm : '전국고속도로', cdDtl : 'EXWAY000', cdGrp:'EX_WAY_NAME_CD',hiwayPriority:'0'}

        API.getHighways()
        .then((data)=>{
            setHignways([all,...data.data])
        })
        
        .catch((error) => {
            setHignways([]);
        })
        .finally(() =>{
            if(getOS() === 'IOS')
                window.scrollTo(0,1);
        })
    }, []);

    useEffect(()=>{

        setRestAreas(null)

        window.addEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback1, false)

        if(getOS() === 'IOS'){

            if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
                SDL_dispatchGetLocation()
            }else{

                addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                    setLocationData(address)
                })
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
                        setLocationData(address)
                    })
        
                }, {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 2000
                });
            }else{
                
                addressSearchByCoords(37.5085848476582, 126.888897552736,(address)=>{
                    setLocationData(address)
                })
            }
        }

    
        return () =>{
            window.removeEventListener('SDL_dispatchGetLocation',dispatchGetLocationCallback1, false)
        }

    },[selectedHighwayCd])

    useEffect(()=>{
        setRestAreas(null)
        if(locationData !== null){
            API.getRestAreas(locationData.address.y,locationData.address.x,selectedHighwayCd === 'EXWAY000' ? '' : selectedHighwayCd)
            .then((data)=>{
                setRestAreas(data);
            })
            .catch((error) => {
                setRestAreas(null);
            })
         }
    },[locationData])


    if (restAreas === null) return <>
                                        <div className="pageLoding">
                                            <div className="stateWrap">
                                                <div className="loading">로딩중...</div>
                                            </div>
                                        </div> 
                                    </>

    return(
            <>
                <div className="listSort withSelect">
                    <div className="selectWrap leftCol">
                        <select className="designSelect" onChange={(e) => {setSelectedHighwayCd(e.target.value)}}>
                            {/* <option key="all" value="">전국 고속도로</option> */}
                            {
                                highways !== null && highways.map((hiway) => 
                                    <option key={hiway.cdDtl} value={hiway.cdDtl} selected= {hiway.cdDtl === selectedHighwayCd ? 'selected' : ''}>{hiway.hiwayNm}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
                {
                    restAreas !== null && restAreas.data.length === 0 ?
                    (
                        <div className="emptyWrap noneData">
                            <div className="empty">
                                <p className="emptyMsg_1">매장 정보가 없습니다.</p>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="listWrap">
                            <ul className="listContent">
                                {
                                    restAreas !== null && restAreas.data.map((market)=>
                                    <li key = {market.strId}>
                                        <SingleMarketCmpnt  market={market}  restYN ='Y'/>
                                    </li>
                                    )
                                }
                            </ul>
                        </div>
                    )
                }
                
            </>
    )
}

export default Stores;