import React , {useContext} from 'react'
import { useHistory , useLocation } from 'react-router-dom';
import { SDLContext } from './context/SDLStore'
import { Route } from 'react-router-dom';
import { getCartCnt, removeCartDataAll,pushCartData } from './util/Utils'
import {REDUCER_ACTION} from './context/SDLReducer'
import * as ACTION from './common/ActionTypes'
import {SDL_dispatchCloseApp, SDL_dispatchOrderComplete} from './appBridge'

const SDLRoute = ({component : ComponentToRender, computedMatch,...rest})=>{

    const {dispatch,data} = useContext(SDLContext)
    const history = useHistory()
    const location = useLocation()

    if(data.notification.status === 'NOTIFICATION_WHEN_IN_BACKGROUND'){
        console.log('SDLROUTE NOTIFICATION_WHEN_IN_BACKGROUND!!!')
        dispatch({type : REDUCER_ACTION.INIT_NOTIFICATION})
        history.replace({pathname : ACTION.LINK_ORDER_HISTORY})
    }

    if(data.notification.status === 'NOTIFICATION_WHEN_IN_FOREGROUND'){
        console.log('SDLROUTE NOTIFICATION_WHEN_IN_FOREGROUND!!!')
        const title = data.notification.data.title
        const desc = data.notification.data.body

        dispatch({type : REDUCER_ACTION.INIT_NOTIFICATION})

        dispatch({
            type: REDUCER_ACTION.SHOW_ALERT, 
            payload : {data : {title: title , desc : desc, code : 100},
            callback : () => {
              dispatch({type : REDUCER_ACTION.HIDE_ALERT})
            }
        }})
    }

    if(data.history.action === 'BACK'){

        if(data.modal.show){
            data.history.action = ''
            dispatch({type : 'MODAL', payload : {show : false }})
            return(
            <Route {...rest} render={props=>{
                return <ComponentToRender {...props}/>
            }}></Route>
            )
        }
        
        if(data.terms.show){
            data.history.action = ''
            dispatch({type : 'TERMS', payload : {show : false }})
            return(
            <Route {...rest} render={props=>{
                return <ComponentToRender {...props}/>
            }}></Route>
            )
        }
        
        if(data.history.enable){

            if(history.location.pathname === '/home'){
                data.history.action = ''
                if(window.appBridge){
                    // 안드로이드인 경우만 아래 로직 실행
                    dispatch({
                        type : 'MODAL', 
                        payload : {show : true , data : {type : 'CONFIRM_POP', title: '알림', desc : '앱을 종료하시겠습니까?'} , 
                        callback : (res) => {
                            if(res){
                                SDL_dispatchCloseApp()
                            }else{
                                dispatch({type : 'MODAL', payload : {show : false}})
                            }
                        }
                    }})
                }
            } 
            
            else if (computedMatch.path === '/markets/detail/:id') {
                
                if(getCartCnt() > 0) {
                    data.history.action = ''
                    dispatch({  
                        type:REDUCER_ACTION.SHOW_CONFIRM,
                        payload:{ data : {type : 'CONFIRM_POP', title: '', desc : '매장 이동을 원하십니까? 장바구니에 담긴 메뉴는 모두 삭제됩니다.'},
                        callback : (res) => {
                            if(res){
                                removeCartDataAll()
                                dispatch({type: REDUCER_ACTION.HIDE_CONFIRM})
                                if(data.channel.channelUIType === 'A'){
                                    if(data.toScreen === 'MAIN'){
                                        history.goBack()
                                    }else{
                                        history.replace({pathname:ACTION.LINK_HOME, state : {from : data.mainLocation}})
                                    }
                                }
                            }else{
                                dispatch({type : REDUCER_ACTION.HIDE_CONFIRM})
                            }
                        }
                    }})
                }else{
                    data.history.action = ''
                    if(data.channel.channelUIType === 'A'){
                        if(data.toScreen === 'MAIN'){
                            history.goBack()
                        }else{
                            history.replace({pathname:ACTION.LINK_HOME, state : {from : data.mainLocation}})
                        }
                    }else{
                        SDL_dispatchCloseApp()
                    }
                }
            }

            else if (history.location.pathname === ACTION.LINK_MARKET){
                data.history.action = ''
                if(data.channel.channelUIType === 'A'){
                    history.goBack()
                }else{
                    SDL_dispatchCloseApp()
                }
            }
            else if (history.location.pathname === ACTION.LINK_REVIEW){
                data.history.action = ''
                if(data.channel.channelUIType === 'A'){
                    history.goBack()
                }else{
                    SDL_dispatchCloseApp()
                }
            }
            else if (history.location.pathname === ACTION.LINK_SEARCH){
                data.history.action = ''
                if(data.channel.channelUIType === 'A'){
                    history.goBack()
                }else{
                    SDL_dispatchCloseApp()
                }
            }
            else if (history.location.pathname === ACTION.LINK_ORDER_FORM) {
                data.history.action = ''
                history.replace(location.state.from);      

            }
            
            else if (history.location.pathname === ACTION.LINK_ORDER_SUCCESS) {
                data.history.action = ''
                if(data.channel.channelUIType === 'A'){
                    history.replace({pathname:ACTION.LINK_HOME, state : {from : data.mainLocation}})
                }else{
                    SDL_dispatchOrderComplete()
                }                
            }
            else if (history.location.pathname === ACTION.LINK_MY_SDL
            || history.location.pathname === ACTION.LINK_ORDER_HISTORY
            || history.location.pathname === ACTION.LINK_MY_JJIM
            || history.location.pathname === ACTION.LINK_ZERO_PAY
            || history.location.pathname === ACTION.LINK_AROUND_MAP
            ) {
                data.history.action = ''
                if(data.channel.channelUIType === 'A'){
                    history.replace({pathname:ACTION.LINK_HOME, state : {from : data.mainLocation}})
                }else{
                    SDL_dispatchCloseApp()
                }
            }

            else if (history.location.pathname === ACTION.LINK_ORDER_MENU) {
                data.history.action = ''
                dispatch({type:REDUCER_ACTION.INIT_USER_ORDER_MENU})
                history.goBack();
            }
            
            else if (history.location.pathname === ACTION.LINK_CART) {
                data.history.action = ''
                dispatch({type:REDUCER_ACTION.INIT_USER_ORDER_MENU})
                history.goBack();
            }

            else if (history.location.pathname === ACTION.LINK_ADDRESS_SETTING || history.location.pathname === ACTION.LINK_ADDRESS_SETTING_MAP) {
                data.history.action = ''
                history.replace(location.state.from);
            }

            else {
                data.history.action = ''
                history.goBack()
            }
            
        }
    }
  
    return(
      <Route {...rest} render={props=>{
        return <ComponentToRender {...props}/>
      }}></Route>
    )
  }

export default SDLRoute