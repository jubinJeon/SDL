import {initState} from './SDLStore'

// Reducer 
const SDLReducer = (state,{type, payload}) => {
    
    switch (type) {
        case "MODAL":
            return {...state,modal : {...state.modal,...payload}}
        case "TOAST":
            return {...state,toast : {...state.toast,...payload}}
        case "TERMS":
            return {...state,terms : {...state.terms,...payload}}
        case 'HISTORY':
            return {...state,history : {...state.history,...payload}}
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
        case REDUCER_ACTION.SHOW_DELI_TIP_POP:
            return {...state, modal : {show : true, data : {type : 'DELI_TIP_POP' , ...payload.data},callback : payload.callback}}
        case REDUCER_ACTION.HIDE_DELI_TIP_POP:
            return {...state, modal : {...initState.modal}}
        case REDUCER_ACTION.SHOW_TOAST:
            return {...state, toast : {...state.toast,...payload}}
        case REDUCER_ACTION.HIDE_TOAST:
            return {...state, toast : {...initState.toast}}
        case REDUCER_ACTION.HISTORY_BACK:
            return {...state, history : {...state.history, action : 'BACK', ...payload}}
        case REDUCER_ACTION.HISTORY_BACK_ENABLE:
            return {...state, history : {...initState.history, enable : true}}
        case REDUCER_ACTION.HISTORY_BACK_DISABLE:
            return {...state, history : {...initState.history, enable : false}}
        case REDUCER_ACTION.UPDATE_ORDER_STATUS_DELIVERY:
            return {...state, orderStatus : {isDelivery : true}}
        case REDUCER_ACTION.UPDATE_ORDER_STATUS_PICK:
            return {...state, orderStatus : {isDelivery : false}}
        case REDUCER_ACTION.CLOSE_WIN_POP:

            console.log('CLOSE_WIN_POP',state)
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
            return {...state, recentOrderHistory: {ordrId: payload.ordrId, storeCd: payload.storeCd, bizCtgGrp: payload.bizCtgGrp}}
        case REDUCER_ACTION.OPEN_NICE_PG_POP:

            console.log('OPEN_NICE_PG_POP')
            const nicePGWinPop = window.open('','nicePgPop','height=' + Screen.height + ',width=' + Screen.width )
            console.log('nicePGWinPop',nicePGWinPop)
            if(nicePGWinPop === null || nicePGWinPop === undefined){
                const va = {show : true , data : {msg: '설정 > Safari 에서 팝업차단 해제해주시기 바랍니다.', dispath : payload.dispath} , callback : (data)=>{
                    data.dispath({type : REDUCER_ACTION.HIDE_TOAST})
                }}
                return {...state,toast : {...state.toast,...va}}
            }
            doNicePG(payload.param)
            return {...state, winpop : {this : nicePGWinPop}}

        case REDUCER_ACTION.SAVED_DELIVERY_ADDRESS:
            return {...state, channel : {...state.channel, hasDeliveryAddress : true}}
        case REDUCER_ACTION.INIT_DELIVERY_ADDRESS:
            return {...state, channel : {...state.channel, hasDeliveryAddress : false}}
        case REDUCER_ACTION.SAVE_USER_ORDER_MENU:
            return {...state, userOrderMenu : {...state.userOrderMenu, ...payload}}
        case REDUCER_ACTION.INIT_USER_ORDER_MENU:
            return {...state, userOrderMenu : {...initState.userOrderMenu}}
        case REDUCER_ACTION.CREATE_CHANNEL_DATA:
            return {...state, channel : {...state.channel, ...payload}}
        case REDUCER_ACTION.OPEN_ZERO_PAY_PURCHASE:

            const zeroPayPurchaseWinPop = window.open('' , 'zoroPayPurchasePop', 'height=' + Screen.height + ',width=' + Screen.width );
            doZeroPayPurchse(payload)
            return {...state, winpop : {this : zeroPayPurchaseWinPop}}
        
        case REDUCER_ACTION.SAVE_NOTIFICATION:
            return {...state, notification : {status : payload.status , data : payload.data}} 
        case REDUCER_ACTION.INIT_NOTIFICATION:
            return {...state, notification : {...initState.notification}}        
            //채널 정보 추가
        case REDUCER_ACTION.CHANNEL_INFO_DATA:
            return {...state, channel: {chnlId: payload.chnlId, chnlId: payload.storeCd, bizCtgGrp: payload.bizCtgGrp}}
        default:
        break;
    }
}

// function 제로패이 (html)
const doZeroPayPurchse = (pgPayUrl) => {
    let form = null
    form = document.createElement("form");
    form.setAttribute("charset", "UTF-8");
    form.setAttribute("method", "Post");  //Post 방식
    form.setAttribute("target","zoroPayPurchasePop")
    form.setAttribute("action", process.env.REACT_APP_SDL_API_DOMAIN+'/api/v1/payment/pg/zeropay/call'); //요청 보낼 주소

    form.appendChild(createInputHiddenField('url',pgPayUrl.pgPayUrl));
    document.body.appendChild(form);

    form.submit();
}

// function PG (html)
const doNicePG = (param) => {

    let form = null
    form = document.createElement("form");
    form.setAttribute("charset", "UTF-8");
    form.setAttribute("method", "Post");  //Post 방식
    form.setAttribute("target","nicePgPop")
    form.setAttribute("action", param.pgPayUrl); //요청 보낼 주소

    form.appendChild(createInputHiddenField('storeCd',param.storeCd));
    form.appendChild(createInputHiddenField('ordrId',param.ordrId));
    form.appendChild(createInputHiddenField('pgCd',param.pgCd));
    form.appendChild(createInputHiddenField('payOtc',param.payOtc));
    form.appendChild(createInputHiddenField('ordrKindCd',param.ordrKindCd));
    form.appendChild(createInputHiddenField('dlAddr',param.dlAddr));
    form.appendChild(createInputHiddenField('dlLwAddr',param.dlLwAddr));
    form.appendChild(createInputHiddenField('dlLnAddr',param.dlLnAddr));
    form.appendChild(createInputHiddenField('buldNm',param.buldNm));
    form.appendChild(createInputHiddenField('dlAddrDtl',param.dlAddrDtl));
    form.appendChild(createInputHiddenField('ordrDesc',param.ordrDesc));
    form.appendChild(createInputHiddenField('dlMnDesc',param.dlMnDesc));
    form.appendChild(createInputHiddenField('disposableUseFg',param.disposableUseFg));
    form.appendChild(createInputHiddenField('orderCnct',param.orderCnct));
    form.appendChild(createInputHiddenField('dlLng',param.dlLng));
    form.appendChild(createInputHiddenField('dlLat',param.dlLat));
    form.appendChild(createInputHiddenField('pgTrxCode',param.pgTrxCode));

    document.body.appendChild(form);

    form.submit();
}

// function (html input hidden)
const createInputHiddenField = (name,value) => {
    let hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", name);
    hiddenField.setAttribute("value", value);
    return hiddenField
}

// reducer action
export const REDUCER_ACTION = {
    SHOW_CONFIRM : "SHOW_CONFIRM",
    HIDE_CONFIRM : "HIDE_CONFIRM",
    SHOW_ALERT : "SHOW_ALERT",
    HIDE_ALERT : "HIDE_ALERT",
    SHOW_DELI_TIP_POP : "SHOW_DELI_TIP_POP",
    HIDE_DELI_TIP_POP : "HIDE_DELI_TIP_POP",
    SHOW_MODAL : "SHOW_MODAL",
    HIDE_MODAL : "HIDE_MODAL",
    SHOW_TOAST : "SHOW_TOAST",
    HIDE_TOAST : "HIDE_TOAST",
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
    OPEN_NICE_PG_POP : "OPEN_NICE_PG_POP",
    ORDER_HISTORY: "ORDER_HISTORY",
    CREATE_CHANNEL_DATA: "CREATE_CHANNEL_DATA",
    SAVED_DELIVERY_ADDRESS : "SAVED_DELIVERY_ADDRESS",
    INIT_DELIVERY_ADDRESS : "INIT_DELIVERY_ADDRESS",
    SAVE_USER_ORDER_MENU : 'SAVE_USER_ORDER_MENU',
    INIT_USER_ORDER_MENU : 'INIT_USER_ORDER_MENU',
    OPEN_ZERO_PAY_PURCHASE : 'OPEN_ZERO_PAY_PURCHASE',
    SAVE_NOTIFICATION : 'SAVE_NOTIFICATION',
    INIT_NOTIFICATION : 'INIT_NOTIFICATION',

    //채널 정보 추가
    CHANNEL_INFO_DATA : 'CHANNEL_INFO_DATA'
}

export default SDLReducer

