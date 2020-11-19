import React, { useState, useEffect, useContext } from 'react';
import {useLocation,useHistory} from 'react-router-dom'
import * as API from '../../../Api'
import * as ACTION from '../../../common/ActionTypes'
import { numberFormat, pushCartData, changeShowToast, pullDefaultAddress, makeParamForCreateOrder, unescapehtmlcode, pullShowScreen } from '../../../util/Utils'
import {SDLContext} from '../../../context/SDLStore'
import {REDUCER_ACTION} from '../../../context/SDLReducer'

/////////////////////////////////MAIN///////////////////////////////////

const MenuComponent = ({history, location}) => {

    const {dispatch,data} = useContext(SDLContext);

    const handleOnClick = (e) =>{
        e.preventDefault();
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    }

    return (
        <>
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <button className="icon pageBack" onClick={handleOnClick}>Back</button>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">{unescapehtmlcode(location.state.strNm)}</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <ContentSection/>
            </div>
        </>
    )
};

/////////////////////////////////MAIN///////////////////////////////////

/**
 * 1. 컴포넌트 (중간 부분)
 */

const ContentSection = () => {

    const location = useLocation()
    const history = useHistory()

    const {dispatch,data} = useContext(SDLContext);
    const [resultData, setResultData] = useState(null)
    const [valueOption, setValueOption] = useState(null)
    const [totalCount, setTotalCount] = useState(1);
    const thumImgUrl = location.state.imgModNm;
    const pullShowScreenData = pullShowScreen()

    useEffect (() => {
        if(data.userOrderMenu.resultData !== null){
            
            setValueOption(data.userOrderMenu.valueOption)
            setTotalCount(data.userOrderMenu.totalCount)
            setResultData(data.userOrderMenu.resultData)

        }else{
            API.getStoresMenusListOptions(location.state.strId, location.state.prdId)
            .then((data)=>{

                let valueArray = []

                data.data.map((sub) => {
                    
                    const keyValueOption = {key : "", value : []}
                    keyValueOption.key = sub.prdOptGrpId
                    if(sub.prdOptTypeCd === "SS") keyValueOption.value.push(sub.detail[0].optPrdId)
                    valueArray.push(keyValueOption)
                })
                console.log('valueArray',valueArray)
                setValueOption(valueArray)
                setResultData(data);
            })
            .catch((error) => {
                setResultData([]);
            })
        }
        
    }, []);

    // 채널로 들어올경우 배달 주소 입력 완료 후 바로 오더 생성 프로세스로 진입한다.
    useEffect(()=>{

        if(resultData !== null){
            if(data.channel.channelUIType === 'C' && data.channel.hasDeliveryAddress === true){
                doOrder(history, location, valueOption, totalCount, dispatch, resultData.data, pullShowScreenData.orderType, data)
            }
        }

    },[resultData])


    const checked = (key, optPrdId) => {

        const a = valueOption.find(obj => obj.key === key)
        const b = a !== undefined ? a.value.find(value => value === optPrdId) : undefined

        return b !== undefined
    }
    
    if(resultData === null) return null

    return (
        <>
            <div id="content">
                <div className="fullHeight">
                    {
                        location.state.mainMenu ?
                        <div className="pageToplView">
                            <div className="imgView">
                                <img src={thumImgUrl} onError={(e)=>{e.target.onerror = null; e.target.src="/common/images/no_image.png"}}/>
                            </div>
                            <h2 className="title">{unescapehtmlcode(location.state.prdNm)}</h2>
                            {
                                location.state.prdDesc != null ?
                                <p className="desc">{(unescapehtmlcode(location.state.prdDesc))}</p>
                                :
                                null
                            }
                        </div>
                        :
                        <div className="pageToplView">
                            <h2 className="title">{unescapehtmlcode(location.state.prdNm)}</h2>
                            {
                                location.state.prdDesc != null ?
                                <p className="desc">{(unescapehtmlcode(location.state.prdDesc))}</p>
                                :
                                null
                            }
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
                                    resultData.data.map((mainClass) => 
                                            <li key={mainClass.prdOptGrpId}>
                                                <p className="title">{unescapehtmlcode(mainClass.mainPrdNm)}{mainClass.cpsrFg === "1" ? " (필수)" : null}</p>
                                                <ul className="flowList">
                                                    {
                                                        mainClass.detail.map((subClass, index) => {
                                                            return (
                                                                mainClass.prdOptTypeCd === "SS" ?
                                                                <li key={subClass.optPrdId}>
                                                                    <span className="infoItem">
                                                                        <label className="checkSelect">
                                                                            <input type="radio" name={mainClass.prdOptGrpId} 
                                                                                onChange={() => {radioOption(valueOption, mainClass.prdOptGrpId, subClass.optPrdId,setValueOption)}}
                                                                                defaultChecked={index === 0} checked = {checked(mainClass.prdOptGrpId, subClass.optPrdId)}
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
                                                                                onChange={(e) => {checkOption(valueOption, mainClass.prdOptGrpId, subClass.optPrdId, e.currentTarget.checked, mainClass.chicCvrEa, history, dispatch, setValueOption)}}
                                                                                checked={checked(mainClass.prdOptGrpId, subClass.optPrdId)}
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
                                }
                            </ul>
                        </div>

                        <div className="orderAmount flowList">
                            <p className="infoItem">수량</p>
                            <span className="infoDetail">
                                <span className="quantity">
                                    <button type="button" className={totalCount <= 1 ? "btn btnMinus": "btn btnMinus active"} 
                                        onClick={() => {btnMinus(totalCount, setTotalCount, location.state.normalPrice, valueOption, resultData.data)}}>빼기</button>
                                    <span className="number">{totalCount}</span>
                                    <button type="button" className="btn btnPlus"
                                    onClick={() => {btnPlus(totalCount, setTotalCount, location.state.normalPrice, valueOption, resultData.data, location.state.maxSaleCnt, history, dispatch, data)}}>더하기</button>
                                </span>
                            </span>
                        </div>
                        <div className="flowList totalAmount">
                            <p className="infoItem">총 주문금액</p>
                            <p className="infoDetail ">
                                <span className="total">
                                    {numberFormat(calcTotalPrice(location.state.normalPrice, valueOption, resultData.data, totalCount))}원
                                </span>
                                {pullShowScreenData.orderType ? null : <span  className="amoutInfo">(최소주문금액 {numberFormat(calcMinOderPrice(location))}원)</span>}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="fixedBtn">
                    <button onClick={()=>{linkCart(history, location, valueOption, totalCount, dispatch, resultData.data, pullShowScreenData.orderType)}}
                        className="btn addCart">장바구니</button>
                    <button onClick={()=>{doOrder(history, location, valueOption, totalCount, dispatch, resultData.data, pullShowScreenData.orderType, data)}}
                        className="btn addOrder">바로주문</button>
                </div>
            </div>
        </>
    )
}

//장바구니 이벤트 헨들러
const linkCart = (history, location, valueOption, totalCount, dispatch, resultData, orderType) => {

    if(checkMenu(resultData, valueOption, dispatch, history)) {
        const data = compositeData(location, valueOption, totalCount, calcTotalPrice(location.state.normalPrice,valueOption,resultData,totalCount), resultData, orderType)
        pushCartData(data)
        changeShowToast(true)
        dispatch({type:REDUCER_ACTION.INIT_USER_ORDER_MENU})
        history.goBack()
    }
}

//주문 이벤트 헨들러
const doOrder = (history, location, valueOption, totalCount, dispatch, resultData, orderType,sdlContextData) => {

    if(location.state.adultPrdFg === "1") {
        dispatch({type : 'TOAST', payload : {show : true , data : {msg: '주류만 주문이 불가합니다. 다른 메뉴를 추가해주세요.', code : 'linkCart', dispatch : dispatch, history : history} , callback : toastCallback}})
        return true
    }

    if(checkMenu(resultData, valueOption, dispatch, history)) {
        const data = compositeData(location, valueOption, totalCount, calcTotalPrice(location.state.normalPrice,valueOption,resultData,totalCount), resultData, orderType)
        const addressData = pullDefaultAddress()
        
    
        const deliverySettingToastCallback = (data) => {
            data.dispatch({type: REDUCER_ACTION.HIDE_TOAST})
            dispatch({
                type:REDUCER_ACTION.SAVE_USER_ORDER_MENU, 
                payload :   { 
                                resultData : {data : resultData},
                                valueOption : valueOption,
                                totalCount : totalCount
                            }
            })

            history.replace({pathname: ACTION.LINK_ADDRESS_SETTING, state : {headerTitle : '배달주소설정', from : location}})
        }
    
        if(sdlContextData.channel.channelUIType === 'C' && sdlContextData.channel.hasDeliveryAddress === false){
    
            dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '배달주소를 설정하여주세요.', code : 'linkCart', dispatch : dispatch, history : history} , callback : deliverySettingToastCallback}})
    
        }else{

            // 주문자 정보 생성
            const param = makeParamForCreateOrder(data, addressData)
            
            API.createOrder(param)
            .then((res)=>{
                if(res.code === 1){
        

                    dispatch({
                        type:REDUCER_ACTION.SAVE_USER_ORDER_MENU, 
                        payload :   { 
                                        resultData : {data : resultData},
                                        valueOption : valueOption,
                                        totalCount : totalCount
                                    }
                    })

                    const orderFormData = {
                        addressData : addressData,
                        menuData : data,
                        orderData : res.data
                    }
        
                    history.replace({
                        pathname: ACTION.LINK_ORDER_FORM,
                        state: { data: orderFormData , isFromCart : false, from : location }
                    })
                }
                
            }).catch((err)=>{
                if(err.response.data.code === -7) {
                    dispatch({
                        type : REDUCER_ACTION.SHOW_MODAL, 
                        payload : {data : {type : 'LOGIN'} ,
                        callback : (res) => {
                        if(res){
                            dispatch({type : REDUCER_ACTION.HIDE_MODAL})
                        }else{
                            dispatch({type : REDUCER_ACTION.HIDE_MODAL})
                        }
                        }
                    }})
                    } else if(err.response.data.code === -4){
                        dispatch({type:REDUCER_ACTION.INIT_DELIVERY_ADDRESS})
                        dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch, history : history, location : location , sdlContextData : sdlContextData} , callback : toastCallback}})
                    } else {
                    dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: err.response.data.msg, code : err.response.data.code, dispatch : dispatch} , callback : toastCallback}})
                    }
                })
            }
        
    }
}

const toastCallback = (data) => {
    data.dispatch({type : REDUCER_ACTION.HIDE_TOAST})
    if(data.code === -4){
        if(data.sdlContextData.channel.channelUIType === 'C'){
            data.dispatch({type: REDUCER_ACTION.INIT_DELIVERY_ADDRESS})
        }
    }
}

const compositeData = (location, valueOption, totalCount, totalPrice, resultData, orderType) => {

    const data = {
        storeCd : location.state.storeCd,
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
                prdDesc: location.state.prdDesc,
                totalPrice: totalPrice / totalCount,
                normalPrice: location.state.normalPrice,
                count: totalCount,
                maxSaleCnt: location.state.maxSaleCnt,
                option: [],
                adultPrdFg: location.state.adultPrdFg
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
                setResult.keyNm = unescapehtmlcode(filter[0].mainPrdNm)

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

function btnMinus(totalCount, setTotalCount, normalPrice, valueOption, data, setTotalPrice) {
    if(totalCount - 1 < 1) {
        setTotalCount(TotalCount => 1)
    } else {
        setTotalCount(totalCount - 1)
    }
}

function btnPlus(totalCount, setTotalCount, normalPrice, valueOption, data, setTotalPrice, maxSaleCnt, history, dispatch) {

    if(totalCount + 1 > maxSaleCnt) {
        dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '1회 최대주문수량을 초과하였습니다.', code : 'linkCart', dispatch : dispatch, history : history} , callback : toastCallback}})
        return false
    }
    setTotalCount(totalCount + 1)
}
    
function radioOption(valueOption, prdOptGrpId, optPrdId, setValueOption) {
    valueOption.map((op) => {
        if(op.key === prdOptGrpId) {
            op.value = []
            op.value.push(optPrdId)
        }
    })
    setValueOption([...valueOption])
}

function checkOption(valueOption, prdOptGrpId, optPrdId, checked, chicCvrEa, history, dispatch, setValueOption) {
    valueOption.map((op) => {
        
        if(op.key === prdOptGrpId && checked) {
            if(op.value.length >= chicCvrEa)
            {
                dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '최대 옵션수량을 초과하였습니다.', code : 'linkCart', dispatch : dispatch, history : history} , callback : toastCallback}})
            }
            else
            {
                op.value.push(optPrdId)
            }
        }
        else if(op.key === prdOptGrpId && !checked) {
            const index = op.value.indexOf(optPrdId)
            if(index !== -1) {
                op.value.splice(op.value.indexOf(optPrdId), 1)
            }
        }
    })

    setValueOption([...valueOption])
}

function calcTotalPrice(normalPrice, valueOption, data, totalCount) {

    let sumPrice = 0;

    if(valueOption != null){
        valueOption.forEach((mainClass) => {
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
    }

    return (Number(normalPrice) + sumPrice) * totalCount
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
                        dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: ' 필수 옵션을 (' + unescapehtmlcode(resultData[indexA].mainPrdNm) +  ') 선택해주세요', code : 'linkCart', dispatch : dispatch, history : history} , callback : toastCallback}})
                        return false
                    }
                }
            }
        }
    }

    return true
}

export default MenuComponent;