import React, { useState, useEffect, useContext } from 'react';
import * as API from '../../../Api'
import * as ACTION from '../../../common/ActionTypes'
import { numberFormat, pushCartData, changeShowToast, pullDefaultAddress, makeParamForCreateOrder, unescapehtmlcode, pullShowScreen } from '../../../util/Utils'
import {SDLContext} from '../../../context/SDLStore'
import { func } from 'prop-types';

const MenuComponent = ({history, location}) => {

    const {dispatch} = useContext(SDLContext);
    const [resultData, setResultData] = useState(null)
    const [valueOption, setValueOption] = useState([])
    let   keyValueOption = {key : "", value : []}
    const [TotalPrice, setTotalPrice] = useState(0);
    const [TotalCount, setTotalCount] = useState(1);
    const thumImgUrl = 'http://images.kisvan.co.kr/smartorder/' + location.state.imgModNm;
    const pullShowScreenData = pullShowScreen()

    useEffect (() => {
        API.getStoresMenusListOptions(location.state.strId, location.state.prdId)
            .then((data)=>{
                data.data.map((sub) => {
                    keyValueOption = {key : "", value : []}
                    keyValueOption.key = sub.prdOptGrpId
                    if(sub.prdOptTypeCd === "SS") keyValueOption.value.push(sub.detail[0].optPrdId)
                    valueOption.push(keyValueOption)
                })
                setResultData(data);
            })
            .catch((error) => {
                setResultData([]);
            })
    }, []);

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    if(resultData === null) return null

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={handleOnClick} className="icon pageBack">Back</a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">{unescapehtmlcode(location.state.strNm)}</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        {
                            location.state.mainMenu ?
                            <div className="pageToplView">
                                <div className="imgView">
                                    <img src={thumImgUrl} />
                                </div>
                                <h2 className="title">{unescapehtmlcode(location.state.prdNm)}</h2>
                                <p className="desc">{location.state.prdTagLst}</p>
                            </div>
                            :
                            <div className="pageToplView">
                                <h2 className="title">{unescapehtmlcode(location.state.prdNm)}</h2>
                            </div>
                        }

                        <div className="sectionBlock"></div>
                        <div className="menuOrder">
                            <p className="orderPrice flowList">
                                <span className="infoItem">가격</span>
                                <span className="infoDetail">{numberFormat(location.state.normalPrice)}</span>
                            </p>

                            <div>
                                <ul className="payList">
                                    {
                                        resultData.data.map((mainClass) => {
                                            return (
                                                <li>
                                                    <p className="title">{mainClass.mainPrdNm}{mainClass.cpsrFg === "1" ? " (필수)" : null}</p>
                                                    <ul className="flowList">
                                                        {
                                                            mainClass.detail.map((subClass, index) => {
                                                                return (
                                                                    mainClass.prdOptTypeCd === "SS" ?
                                                                    <li key={subClass.prdOptGrpId}>
                                                                        <span className="infoItem">
                                                                            <label className="checkSelect">
                                                                                <input type="radio" name={mainClass.prdOptGrpId} 
                                                                                    onChange={() => {radioOption(valueOption, mainClass.prdOptGrpId, subClass.optPrdId,
                                                                                        location.state.normalPrice, resultData.data, TotalCount, setTotalPrice)}}
                                                                                    defaultChecked={index === 0}
                                                                                />
                                                                                <span className="dCheckBox">{unescapehtmlcode(subClass.optPrdNm)}</span> 
                                                                            </label>
                                                                        </span>
                                                                        <span className="infoDetail">{numberFormat(subClass.optPrc)}원</span>
                                                                    </li>
                                                                    :
                                                                    <li key={subClass.optPrdId}>
                                                                        <span className="infoItem">
                                                                            <label className="checkSelect">
                                                                                <input type="checkbox"
                                                                                    onChange={(e) => {checkOption(valueOption, mainClass.prdOptGrpId, subClass.optPrdId, e.currentTarget.checked,
                                                                                        location.state.normalPrice, resultData.data, TotalCount, setTotalPrice)}}
                                                                                />
                                                                                <span className="dCheckBox">{unescapehtmlcode(subClass.optPrdNm)}</span>
                                                                            </label>
                                                                        </span>
                                                                        <span className="infoDetail">{numberFormat(subClass.optPrc)}원</span>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>

                            <div className="orderAmount flowList">
                                <p className="infoItem">수량</p>
                                <span className="infoDetail">
                                    <span className="quantity">
                                        <button type="button" className={TotalCount <= 1 ? "btn btnMinus": "btn btnMinus active"} 
                                            onClick={() => {btnMinus(TotalCount, setTotalCount, location.state.normalPrice, valueOption, resultData.data, setTotalPrice)}}>빼기</button>
                                        <span className="number">{TotalCount}</span>
                                        <button type="button" className="btn btnPlus"
                                        onClick={() => {btnPlus(TotalCount, setTotalCount, location.state.normalPrice, valueOption, resultData.data, setTotalPrice)}}>더하기</button>
                                    </span>
                                </span>
                            </div>
                            <div className="flowList totalAmount">
                                <p className="infoItem">총 주문금액</p>
                                <p className="infoDetail ">
                                    <span className="total">
                                        {TotalPrice === 0 ? calcTotalPrice(location.state.normalPrice, valueOption, resultData.data, TotalCount, setTotalPrice) : numberFormat(TotalPrice)}원
                                    </span>
                                    {pullShowScreenData.orderType ? null : <span  className="amoutInfo">(최소주문금액 {numberFormat(calcMinOderPrice(location))}원)</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="fixedBtn">
                        <button onClick={()=>{linkCart(history, location, valueOption, TotalCount, TotalPrice, dispatch, resultData.data, pullShowScreenData.orderType)}}
                            className="btn addCart">장바구니</button>
                        <button onClick={()=>{doOrder(history, location, valueOption, TotalCount, TotalPrice, dispatch, resultData.data, pullShowScreenData.orderType)}}
                            className="btn addOrder">바로주문</button>
                    </div>
                </div>
            </div>
        </div>
    )
};


const linkCart = (history, location, valueOption, TotalCount, TotalPrice, dispatch, resultData, orderType) => {

    if(checkMenu(resultData, valueOption, dispatch, history)) {
        const data = compositeData(location, valueOption, TotalCount, TotalPrice, resultData, orderType)
        pushCartData(data)
        changeShowToast(true)
        history.goBack()
    }
}

const doOrder = (history, location, valueOption, TotalCount, TotalPrice, dispatch, resultData, orderType) => {

    if(checkMenu(resultData, valueOption, dispatch, history)) {
        const data =  compositeData(location, valueOption, TotalCount, TotalPrice, resultData, orderType)
        const addressData = pullDefaultAddress()
        const param = makeParamForCreateOrder(data,addressData)
    
        API.createOrder(param)
        .then((res)=>{
            if(res.code === 1){
    
                const orderFormData = {
                    addressData : addressData,
                    menuData : data,
                    orderData : res.data
                }
    
                history.push({
                    pathname: ACTION.LINK_ORDER_FORM,
                    state: { data: orderFormData , isFromCart : false }
                })
            }
            
        }).catch((err)=>{
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch} , callback : toastCallback}})
        })
    }
}

const toastCallback = (data) => {
    data.dispatch({type : 'TOAST', payload : {show : false }})
}

const compositeData = (location, valueOption, TotalCount, TotalPrice, resultData, orderType) => {

    const data = {
        bizCtgDtl : location.state.bizCtgDtl,
        strId : location.state.strId,
        strNm : location.state.strNm,
        strAddr : location.state.strAddr,
        strAddr_Detail : location.state.strAddr_Detail,
        orderType : orderType, // 0 : 배달 1: 픽업
        dlMinOrdrPrc : location.state.dlMinOrdrPrc ? location.state.dlMinOrdrPrc : 0, 
        dlMinOrdrPrc9icp : location.state.dlMinOrdrPrc9icp,
        dlMinOrdrPrc9ica : location.state.dlMinOrdrPrc9ica,
        dlMinOrdrPrc9icm : location.state.dlMinOrdrPrc9icm,
        menus : [
            {
                key: new Date().getTime(),
                prdId: location.state.prdId,
                prdNm: location.state.prdNm,
                totalPrice: TotalPrice / TotalCount,
                normalPrice: location.state.normalPrice,
                count: TotalCount,
                option: []
            }
        ],
        showToast : true
    }

    let result = []
    let setResult = {keyId : "", keyNm : "", value : []}
    
    valueOption.map((mainClass) => {
        if(mainClass.value.length > 0) {
            let filter = resultData.filter(it => new RegExp(mainClass.key, "i").test(it.prdOptGrpId))
            if(filter[0].prdOptGrpId === mainClass.key) {

                setResult.keyId = filter[0].prdOptGrpId
                setResult.keyNm = filter[0].mainPrdNm

                mainClass.value.map((subClass) => {
                    filter[0].detail.map((lastClass) => {
                        if(subClass === lastClass.optPrdId) {
                            setResult.value.push ({
                                optPrdId : lastClass.optPrdId,
                                optPrdNm : lastClass.optPrdNm
                            })
                        }
                    })
                })

                result.push(setResult)
                setResult = {keyId : "", keyNm : "", value : []}
            }
        }
    })

    data.menus[0].option = [...result]

    return data;

}

function btnMinus(TotalCount, setTotalCount, normalPrice, valueOption, data, setTotalPrice) {
    if(TotalCount - 1 < 1) {
        setTotalCount(TotalCount => 1)
        calcTotalPrice(normalPrice, valueOption, data, 1, setTotalPrice)
    } else {
        setTotalCount(TotalCount - 1)
        calcTotalPrice(normalPrice, valueOption, data, TotalCount - 1, setTotalPrice)
    }
}

function btnPlus(TotalCount, setTotalCount, normalPrice, valueOption, data, setTotalPrice) {
    setTotalCount(TotalCount + 1)
    calcTotalPrice(normalPrice, valueOption, data, TotalCount + 1, setTotalPrice)
}
    
function radioOption(valueOption, prdOptGrpId, optPrdId, normalPrice, data, TotalCount, setTotalPrice) {
    valueOption.map((op) => {
        if(op.key === prdOptGrpId) {
            op.value = []
            op.value.push(optPrdId)
        }
    })
    calcTotalPrice(normalPrice, valueOption, data, TotalCount, setTotalPrice)
}

function checkOption(valueOption, prdOptGrpId, optPrdId, checked, normalPrice, data, TotalCount, setTotalPrice) {
    valueOption.map((op, index) => {
        if(op.key === prdOptGrpId && checked) {
            valueOption[index].value.push(optPrdId)
            valueOption[index].value.sort()
        }
        else if(op.key === prdOptGrpId && !checked) {
            valueOption[index].value.splice(valueOption[index].value.indexOf(optPrdId), 1)
        }
    })
    calcTotalPrice(normalPrice, valueOption, data, TotalCount, setTotalPrice)
}

function calcTotalPrice(normalPrice, valueOption, data, TotalCount, setTotalPrice) {

    let sumPrice = 0;

    valueOption.map((mainClass) => {
        if(mainClass.value.length > 0) {
            let filter = data.filter(it => new RegExp(mainClass.key, "i").test(it.prdOptGrpId))
            if(filter[0].prdOptGrpId === mainClass.key) {
                mainClass.value.map((subClass) => {
                    filter[0].detail.map((lastClass) => {
                        if(subClass === lastClass.optPrdId)
                            sumPrice += Number(lastClass.optPrc)
                    })
                })
            }
        }
    })

    setTotalPrice((Number(normalPrice) + sumPrice) * TotalCount)
    return numberFormat((Number(normalPrice) + sumPrice) * TotalCount)
}

function calcMinOderPrice(location) {

    const dlMinOrdrPrc9icp = location.state.dlMinOrdrPrc9icp
    const dlMinOrdrPrc9ica = location.state.dlMinOrdrPrc9ica
    const dlMinOrdrPrc9icm = location.state.dlMinOrdrPrc9icm

    const arr = [Number(dlMinOrdrPrc9icp),Number(dlMinOrdrPrc9ica),Number(dlMinOrdrPrc9icm)]

    return Math.max.apply(null, arr);
}

function checkMenu(resultData, valueOption, dispatch, history) {
    for(let indexA = 0; indexA < resultData.length; indexA++) {
        if(resultData[indexA].cpsrFg === "1") {
            for(let indexB = 0; indexB < valueOption.length; indexB++) {
                if(resultData[indexA].prdOptGrpId === valueOption[indexB].key) {
                    if(valueOption[indexB].value.length <= 0) {
                        dispatch({type : 'TOAST', payload : {show : true , data : {msg: ' 필수 옵션을 (' + resultData[indexA].mainPrdNm +  ') 선택해주세요', code : 'linkCart', dispatch : dispatch, history : history} , callback : toastCallback}})
                        return false
                    }
                }
            }
        }
    }

    return true
}

export default MenuComponent;