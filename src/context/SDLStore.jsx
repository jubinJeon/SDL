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