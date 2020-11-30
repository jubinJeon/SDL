

export const DISPATH_CODE = {
    CLOSE_APP : 100,
    CALL_PAYMENT : 201,
    ORDER_COMPLETE : 202,
    START_PERMISSION : 101,
    QR_READER : 300,
    ZERO_PAY : 400,
    CALL_PHONE : 600,
    GEOFENCING : 700,
    SAVE_COOKIE : 800,
    CLEAR_COOKIE : 900,
    GET_LOCATION : 1000,
    SHARED : 150
}

//1: 휴대폰본인인증(회원가입)
//2: 휴대폰본인인증(아이디찾기)
//3: 휴대폰본인인증(비밀번호찾기)
//4: 휴대폰본인인증(주류주문)
//5: 소셜로그인(회원가입)
//6: 소셜로그인(로그인)
//7: pg결제

export const SDL_dispatchCloseApp = (data) => {
    let JsonData = data;
    if (JsonData === undefined) JsonData = '';
    if(window.appBridge){
        console.log('SDL_dispatchCloseApp')
        window.appBridge.dispatch(DISPATH_CODE.CLOSE_APP,'');  
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchCloseApp')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.CLOSE_APP , data : JsonData }))
    }
}

export const SDL_dispatchCallPayment = (data) => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.CALL_PAYMENT, JSON.stringify(data));
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchStartPermission')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.CALL_PAYMENT , data : data }))
    }
    
}

export const SDL_dispatchOrderComplete = () => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.ORDER_COMPLETE,'');
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchOrderComplete')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.ORDER_COMPLETE , data : '' }))
    }
    
}

export const SDL_dispatchStartPermission = () => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.START_PERMISSION,'');
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchStartPermission')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.START_PERMISSION , data : '' }))
    }
}

export const SDL_dispatchQrReader = () => {
    console.log(JSON.stringify({code: DISPATH_CODE.QR_READER , data : '' }))
    if(window.appBridge){
        console.log('android SDL_dispatchQrReader')
        window.appBridge.dispatch(DISPATH_CODE.QR_READER,'');
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('ios SDL_dispatchQrReader')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.QR_READER , data : '' }))
    }
}

export const SDL_dispatchZeropay = (param) => {

    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.ZERO_PAY,param);
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchZeropay')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.ZERO_PAY , data : param }))
    }

    
}

export const SDL_dispatchCallPhone = (param) => {
    console.log('SDL_dispatchCallPhone', param)

    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.CALL_PHONE,JSON.stringify(param));
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchCallPhone')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.CALL_PHONE , data : param }))
    }

    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.CALL_PHONE,JSON.stringify(param));
    }
}

export const SDL_dispatchGeofencing = (data) => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.GEOFENCING,JSON.stringify(data));
    }
}

export const SDL_dispatchSaveCookie = () => {
    console.log('SDL_dispatchSaveCookie')
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.SAVE_COOKIE,'');
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchSaveCookie')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.SAVE_COOKIE , data : '' }))
    }
}

export const SDL_dispatchClearCookie = () => {
    console.log('SDL_dispatchClearCookie')
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.CLEAR_COOKIE,'');
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchClearCookie')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.CLEAR_COOKIE , data : '' }))
    }
}

/**
 * 위티 정보 요청
 */
export const SDL_dispatchGetLocation = () => {
    console.log('SDL_dispatchGetLocation')

    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.GET_LOCATION,'');
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchGetLocation')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.GET_LOCATION , data : '' }))
    }
}

export const SDL_dispatchShared = (appLinkUrl) => {
    console.log('SDL_dispatchShared')

    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.SHARED,JSON.stringify({appLinkUrl : appLinkUrl}));
    }else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        console.log('SDL_dispatchGetLocation')
        window.webkit.messageHandlers.dispatch.postMessage(JSON.stringify({code: DISPATH_CODE.SHARED , data : {appLinkUrl : appLinkUrl} }))
    }
}

