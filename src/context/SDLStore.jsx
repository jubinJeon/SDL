import React,{ createContext, useReducer } from "react";
import SDLReducer from './SDLReducer'

export const SDLContext = createContext();

// Reducer 초기 데이터 
export const initState = {
  modal : {
    show : false,
    data : { type: '' , title : '' , desc : '', code : '', dispatch : ()=>{}},
    callback : ()=>{}
  },
  toast : {
    show : false,
    data : {msg : '' , code : '', dispatch : ()=>{}},
    callback : ()=>{}
  },
  terms : {
    show : false,
    data : {index : 0 , code : '', dispatch : ()=>{}},
    callback : ()=>{}
  },
  history : {
    action : '', // BACK , FORWAD
    enable : true
  },
  userJoinStatus : {
    isSdlMember : 0,
    isCheckPayMember : 0,
    isZeroPayMember : 0,
  },
  orderStatus : {isDelivery : true},
  winpop : {
    this : null,
  },
  recentOrderHistory : {
    ordrId: '', 
    bizCtgGrp: ''
  },
  channel : {
    channelCode : '',
    agent : '',
    hasDeliveryAddress : false,
    channelUIType : 'A'
  },
  userOrderMenu : {
    resultData : null,
    valueOption : [],
    totalPrice : 0,
    totalCount : 1
  },
  notification : {
    status : null,
    data : null,
  },
  toScreen : null,
  mainLocation : null,
  /**
   * NEW 2020.12.04
   * 위도, 경도 
   */
  location : {
    //모범생 (위도,경도)
    ch00002046 : {
      longitude : 37.3406045599450,
      Latitude : 127.939619279104
    },
    //슬배생 (위도,경도)
    sdl : {
      longitude : 37.5085848476582,
      Latitude : 126.888897552736   
    }
  },
}

// SDL 데이터 저장소
const SDLStore = ({children}) => {

  const [data, dispatch] = useReducer(SDLReducer,initState);
  
  return (
    <>
      <SDLContext.Provider value={{data,dispatch}}>
        {children}
      </SDLContext.Provider>
    </>
  )
}

export default SDLStore;