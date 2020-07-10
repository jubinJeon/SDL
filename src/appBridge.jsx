

export const DISPATH_CODE = {
    CLOSE_APP : 100,
    CALL_PAYMENT : 201,
    START_PERMISSION : 101,
    휴대폰본인인증_회원가입 : 150,
    QR_READER : 300,
    ZERO_PAY : 400,
    CALL_PHONE : 600
}

//1: 휴대폰본인인증(회원가입)
//2: 휴대폰본인인증(아이디찾기)
//3: 휴대폰본인인증(비밀번호찾기)
//4: 휴대폰본인인증(주류주문)
//5: 소셜로그인(회원가입)
//6: 소셜로그인(로그인)
//7: pg결제

export const BRIDGE_CODE = {
    CLOSE_APP : 200,
    휴대폰본인인증_회원가입 : 1,
    CALL_PAYMENT : 201,
    QR_READER : 300,
}

export const SDL_dispatchCloseApp = () => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.CLOSE_APP,'');    
    }
    
}

export const SDL_dispatchUserVerify = (data) => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.휴대폰본인인증_회원가입,'');    
    }
    
}

export const SDL_dispatchCallPayment = (data) => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.CALL_PAYMENT, JSON.stringify(data));
    }
    
}

export const SDL_dispatchStartPermission = () => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.START_PERMISSION,'');
    }
}

export const SDL_dispatchQrReader = () => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.QR_READER,'');
    }
}

export const SDL_dispatchZeropay = (param) => {
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.ZERO_PAY,param);
    }
}

export const SDL_dispatchCallPhone = (param) => {
    console.log('SDL_dispatchCallPhone', param)
    if(window.appBridge){
        window.appBridge.dispatch(DISPATH_CODE.CALL_PHONE,JSON.stringify(param));
    }
}


export const ACTION_CLOSE_APP = 200;
export const sdlAppbridgeCallback = (data) => {
    console.log('=========================================')
    console.log('sdlAppbridgeCallback type',data.type)
    console.log('sdlAppbridgeCallback data',data.data)
    console.log('=========================================')
    switch(data.type){
        case BRIDGE_CODE.CLOSE_APP:
            console.log('ACTION_CLOSE_APP')
            SDL_dispatchCloseApp();
        break;
        case BRIDGE_CODE.휴대폰본인인증_회원가입:
            console.log('휴대폰본인인증_회원가입')
            SDL_dispatchUserVerify(data.data)
        break;
        default:
    }
}