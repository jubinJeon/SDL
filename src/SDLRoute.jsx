import React , {useContext} from 'react'
import { useHistory } from 'react-router-dom';
import { SDLContext } from './context/SDLStore'
import * as AppBridge from './appBridge'
import { Route } from 'react-router-dom';
import { getCartCnt, removeCartDataAll } from './util/Utils'
import {REDUCER_ACTION} from './context/SDLReducer'
import { LINK_HOME } from './common/ActionTypes'

const SDLRoute = ({component : ComponentToRender, computedMatch,...rest})=>{

    const {dispatch,data} = useContext(SDLContext)
    const history = useHistory()
  
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
                dispatch({
                        type : 'MODAL', 
                        payload : {show : true , data : {type : 'CONFIRM_POP', title: '알림', desc : '앱을 종료하시겠습니끼?'} , 
                        callback : (res) => {
                            if(res){
                                AppBridge.SDL_dispatchCloseApp()
                            }else{
                                dispatch({type : 'MODAL', payload : {show : false}})
                            }
                        }
                    }})
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
                                history.goBack();
                            }else{
                                dispatch({type : REDUCER_ACTION.HIDE_CONFIRM})
                            }
                        }
                    }})
                }else{
                    data.history.action = ''
                    history.goBack()
                }
            }
            
            else if (history.location.pathname === '/order/form') {
                data.history.action = ''
                if(history.location.state.isFromCart) {
                    history.goBack();
                }
                else {
                    history.go(-2);
                }
            }
            
            else if (history.location.pathname === '/order/orderSuccess' 
            || history.location.pathname === '/mysdl'
            || history.location.pathname === '/order/orderHistory'
            || history.location.pathname === '/myJjim'
            ) {
                data.history.action = ''
                history.push({pathname:LINK_HOME})
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