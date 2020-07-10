import React, {useState, useEffect, useContext} from 'react';

import * as ACTION from '../../common/ActionTypes'
import { removeCartDataAll, pushCartData, pullCartData, numberFormat, pullDefaultAddress, 
    makeParamForCreateOrder, unescapehtmlcode } from '../../util/Utils'
import * as API from '../../Api'

import {SDLContext} from '../../context/SDLStore'

const Cart = ({ history, location }) => {
    
    const {dispatch} = useContext(SDLContext);

    const [cartData, setCartData] = useState({});
    const [state, setState] = useState(0)
    
    const onClickBackBtn = (e) => {
        e.preventDefault();
        removeCartDataAll()
        pushCartData(cartData)
        history.goBack();
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        history.goBack()
    };

    useEffect(() => {
        setCartData(pullCartData())
    }, []);
    
    useEffect(() => {
    }, [state]);

    if(Object.keys(cartData).length === 0) return null

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <button onClick={onClickBackBtn} className="icon pageBack">Back</button>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">장바구니</h1>
                    </div>
                    <div className="rightArea">
                        <button href="#" className="icon delCart" onClick={() => {btnRemoveAll(dispatch,history)}}>
                            전체삭제
                        </button>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="titleView">
                            <div className="infoLabel">
                                {cartData.orderType === 0 ? <span className="deli">배달</span> : <span className="pick">픽업</span>}
                            </div>
                            <h2 className="title">{unescapehtmlcode(cartData.strNm)}</h2>
                        </div>
                        <div className="sectionBlock"></div>
                        <div className="rowSection">
                            <ul className="orderViewList">
                                {
                                    cartData.menus.map((menuList) => (
                                        <li key={menuList.key}>
                                            <p className="title">{unescapehtmlcode(menuList.prdNm)}</p>
                                            <p className="options">
                                                {
                                                    menuList.option.map((option) => {
                                                        return (
                                                            <p>
                                                                {option.keyNm}
                                                                {option.value.map((detail, index) =>
                                                                    index === 0 ?
                                                                    unescapehtmlcode(" : " + detail.optPrdNm) :
                                                                    unescapehtmlcode(", " + detail.optPrdNm)
                                                                )}
                                                            </p>
                                                        )
                                                    })
                                                }
                                            </p>
                                            <p className="amount">{numberFormat(menuList.totalPrice)}원</p>
                                            <span className="quantity">
                                                <button type="button" className={menuList.count > 1 ? "btn btnMinus active" : "btn btnMinus"} onClick={()=>{btnMinus(menuList.key, cartData, setState, state)}}>빼기</button>
                                                <span className="number">{menuList.count}</span>
                                                <button type="button" className="btn btnPlus" onClick={()=>{btnPlus(menuList.key, cartData, setState, state)}}>더하기</button>
                                            </span>
                                            <button type="button" className="icon listDel" onClick={()=>{btnRemove(menuList.key, cartData, setState, state, dispatch, history)}}>DEL</button>
                                        </li>
                                    ))
                                }
                            </ul>
                            <TotalAmountComponent cartData={cartData} state={state}/>
                        </div>
                    </div>
                    <OrderComponent history={history} cartData={cartData} orderType={cartData.orderType} dispatch = {dispatch} />
                </div>
            </div>
        </div>
    );
}

function btnPlus (key, cartData, callback, state) {
    cartData.menus.map((list) => {
        if(list.key === key) {
            
            // list.totalPrice = list.totalPrice + (list.totalPrice/list.count)
            list.count =  list.count + 1
            callback(state + 1)
        }
    })
}

function btnMinus (key, cartData, callback, state) {
    cartData.menus.map((list) => {
        if(list.count === 1) return
        
        if(list.key === key) {
            // list.totalPrice = list.totalPrice - (list.totalPrice/list.count)
            list.count -= 1 
            
            callback(state - 1)
        }
    })
}

function btnRemove (key, cartData, callback, state, dispatch, history) {
    if(Object.keys(cartData).length !== 0){
        const index = cartData.menus.findIndex((item)=>{
          return item.key === key
        })
        if (index > -1) cartData.menus.splice(index, 1)

        if(cartData.menus.length === 0) {return btnRemoveAll(dispatch,history)}
    }
    callback(state - 1)
}

function btnRemoveAll (dispatch, history) {
    history.goBack()
    dispatch({type : 'TOAST', payload : {show : true , data : {msg: '장바구니가 모두 삭제되었습니다.', code : 'removeAll', dispatch : dispatch, history : history} , callback : toastCallback}})
    removeCartDataAll()
}

const TotalAmountComponent = ({cartData}) => {

    if(Object.keys(cartData).length === 0) return null

    let totalPrice = 0;
    cartData.menus.map((menuList) => {
        return totalPrice += menuList.totalPrice * menuList.count
    })

    return (
        <div className="flowList totalAmount">
            <p className="infoItem">총 주문금액</p>
            <p className="infoDetail ">
                <span className="total">{numberFormat(totalPrice)}원</span>
                {cartData.orderType === 0 &&
                    <span className="amoutInfo">(최소주문금액 {numberFormat(calcMinOderPrice(cartData))}원)</span>
                }
            </p> 
        </div>
    )
}

const calcMinOderPrice = (cartData) => {

    const dlMinOrdrPrc9icp = cartData.dlMinOrdrPrc9icp
    const dlMinOrdrPrc9ica = cartData.dlMinOrdrPrc9ica
    const dlMinOrdrPrc9icm = cartData.dlMinOrdrPrc9icm

    const arr = [Number(dlMinOrdrPrc9icp),Number(dlMinOrdrPrc9ica),Number(dlMinOrdrPrc9icm)]

    return Math.max.apply(null, arr);
}

const OrderComponent = ({history, cartData, orderType, dispatch}) => {
    
    if(Object.keys(cartData).length === 0) return null

    let totalPrice = 0;

    cartData.menus.map((menuList) => {
        return totalPrice += menuList.totalPrice * menuList.count
    })
 
    return (
        <div className="fixedBtn flex3half1">
            <a className="btn addMenu" onClick={() => {addMenu(history, cartData)}}>메뉴 추가</a>
            <a className="btn infoMsg btn addOrder" onClick={() => {doOrder(history, cartData, orderType, dispatch)}}>
                <span>
                    {numberFormat(totalPrice)}원 주문하기
                    <span className="numberMsg">{cartData.menus.length}</span>
                </span>
            </a>
        </div>
    )
}

function addMenu(history, cartData) {
    removeCartDataAll()
    pushCartData(cartData)
    history.goBack()
}

const doOrder = (history, menuData, orderType, dispatch) => {

    removeCartDataAll()
    pushCartData(menuData)

    const addressData = pullDefaultAddress()
    const param = makeParamForCreateOrder(menuData,addressData)

    API.createOrder(param)
    .then((res)=>{
        if(res.code === 1){

            const orderFormData = {
                addressData : addressData,
                menuData : menuData,
                orderData : res.data
            }

            history.push({
                pathname: ACTION.LINK_ORDER_FORM,
                state: { data: orderFormData , isFromCart : true }
            })
        }
        
    }).catch((err)=>{
        dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch} , callback : toastCallback}})
    })

}

const toastCallback = (data) => {
    data.dispatch({type : 'TOAST', payload : {show : false }})
}

export default Cart