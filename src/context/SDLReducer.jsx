import {initState} from './SDLStore'

const dialogReducer = (state,{type, payload}) => {
    
    switch (type) {
        case "MODAL":
            return {...state,modal : {...state.modal,...payload}}

        case REDUCER_ACTION.SHOW_MODAL:
            return {...state, modal : {...state.modal, show : true, ...payload}}
        case REDUCER_ACTION.HIDE_MODAL:
                return {...state, modal : {...initState.modal}}
            
        case REDUCER_ACTION.SHOW_CONFIRM:
            return {...state, modal : {show : true, data : {type : 'CONFIRM_POP' , ...payload.data},callback : payload.callback}}
        case REDUCER_ACTION.HIDE_CONFIRM:
            return {...state, modal : {...initState.modal}}

        case REDUCER_ACTION.SHOW_ALERT:
            return {...state, modal : {show : true, data : {type : 'ALERT_POP' , ...payload.data},callback : payload.callback}}
        case REDUCER_ACTION.HIDE_ALERT:
            return {...state, modal : {...initState.modal}}
        

        case "TOAST":
            return {...state,toast : {...state.toast,...payload}}

        case "TERMS":
            return {...state,terms : {...state.terms,...payload}}

        case 'HISTORY':
            return {...state,history : {...state.history,...payload}}
            
        case REDUCER_ACTION.UPDATE_ORDER_STATUS_DELIVERY:
            return {...state, orderStatus : {isDelivery : true}}
        case REDUCER_ACTION.UPDATE_ORDER_STATUS_PICK:
            return {...state, orderStatus : {isDelivery : false}}

        case REDUCER_ACTION.CLOSE_WIN_POP:
            if(state.winpop.this !== null){
                state.winpop.this.close()
            }
            return {...state, winpop : {...initState.winpop}}
        case REDUCER_ACTION.OPEN_AUTH_WIN_POP:
            const authwinPop = window.open(process.env.REACT_APP_SDL_API_DOMAIN +'/api/v1/members/check/join' , '_blank', 'height=' + Screen.height + ',width=' + Screen.width );
            return {...state, winpop : {this : authwinPop}}
        case REDUCER_ACTION.OPEN_FIND_ID_WIN_POP:
            const idWinPop = window.open(process.env.REACT_APP_SDL_API_DOMAIN +'/api/v1/members/find/id' , '_blank', 'height=' + Screen.height + ',width=' + Screen.width );
        return {...state, winpop : {this : idWinPop}}
        case REDUCER_ACTION.OPEN_FIND_PW_WIN_POP:
            const pwWinPop = window.open(process.env.REACT_APP_SDL_API_DOMAIN +'/api/v1/members/find/password?mbrId=' + payload.mbrId , '_blank', 'height=' + Screen.height + ',width=' + Screen.width );
        return {...state, winpop : {this : pwWinPop}}
        
        case REDUCER_ACTION.OPEN_FIND_ZERO_PAY_WIN_POP:
            const zeroWinPop = window.open(process.env.REACT_APP_SDL_ZEROPAY_STORE  , '_blank', 'height=' + Screen.height + ',width=' + Screen.width );
        return {...state, winpop : {this : zeroWinPop}}
        
        case REDUCER_ACTION.OPEN_ZERO_PAY_SUBSIDY:
            const zeroSWinPop = window.open(process.env.REACT_APP_SDL_ZEROPAY_SUBSIDY  , '_blank', 'height=' + Screen.height + ',width=' + Screen.width );
        return {...state, winpop : {this : zeroSWinPop}}


        case REDUCER_ACTION.OPEN_CHECK_PAY_MANAGE_POP:
            const checkWinPop = window.open(payload.checkPayUrl , '_blank', 'height=' + Screen.height + ',width=' + Screen.width );
            return {...state, winpop : {this : checkWinPop}}
        case REDUCER_ACTION.ORDER_HISTORY:
            return {...state, recentOrderHistory: {ordrId: payload.ordrId, bizCtgDtl: payload.bizCtgDtl}}
        default:
            break;
    }
}

export const REDUCER_ACTION = {
    SHOW_CONFIRM : "SHOW_CONFIRM",
    HIDE_CONFIRM : "HIDE_CONFIRM",
    SHOW_ALERT : "SHOW_ALERT",
    HIDE_ALERT : "HIDE_ALERT",
    SHOW_MODAL : "SHOW_MODAL",
    HIDE_MODAL : "HIDE_MODAL",
    SHOW_TOAST : "TOAST",
    SHOW_TERMS : "TERMS",
    HISTORY_BACK : "HISTORY_BACK",
    HISTORY_BACK_DISABLE : "HISTORY_BACK_DISABLE",
    HISTORY_BACK_ENABLE : "HISTORY_BACK_ENABLE",
    UPDATE_ORDER_STATUS_PICK : "UPDATE_ORDER_STATUS_PICK_UP",
    UPDATE_ORDER_STATUS_DELIVERY : "UPDATE_ORDER_STATUS_DELIVERY",
    STORE_CART_DATA: "STORE_CART_DATA",
    REMOVE_CART_DATA: "REMOVE_CART_DATA",
    UPDATE_CART_DATA: "UPDATE_CART_DATA",
    CLOSE_WIN_POP: "CLOSE_WIN_POP",
    OPEN_AUTH_WIN_POP : "OPEN_AUTH_WIN_POP",
    OPEN_FIND_PW_WIN_POP : "OPEN_FIND_PW_WIN_POP",
    OPEN_FIND_ID_WIN_POP : "OPEN_FIND_ID_WIN_POP",
    OPEN_FIND_ZERO_PAY_WIN_POP: "OPEN_FIND_ZERO_PAY_WIN_POP",
    OPEN_ZERO_PAY_SUBSIDY: "OPEN_ZERO_PAY_SUBSIDY",
    OPEN_CHECK_PAY_MANAGE_POP : "OPEN_CHECK_PAY_MANAGE_POP",
    ORDER_HISTORY: "ORDER_HISTORY"

}

export default dialogReducer

