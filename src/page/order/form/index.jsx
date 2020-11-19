
import React, { useEffect, useState, useCallback,useRef,forwardRef,useImperativeHandle,useContext } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import { removeCartDataAll, numberFormat, unescapehtmlcode } from '../../../util/Utils'
import {SDLContext} from '../../../context/SDLStore'
import {REDUCER_ACTION} from '../../../context/SDLReducer'

import * as API from '../../../Api'
import * as AppBridge from '../../../appBridge'
import {NumberInputBox,TextInputBox} from  '../../../components/InputComponent'
import { colors } from '@material-ui/core';

//pgCdInfo   //사용가능PG모듈(array[])   05:NonPG, P0:제로페이, NC:나이스PG, P8: 전자상거래

const OderFormContainer = ( {history,location} ) => {

    const {dispatch,data} = useContext(SDLContext);

    const callSuccess = (orderData)=>{

        removeCartDataAll(); // 장바구니 데이터를 삭제한다.
        dispatch({type:REDUCER_ACTION.INIT_USER_ORDER_MENU})

        history.push({
            pathname: ACTION.LINK_ORDER_SUCCESS,
            state : {orderData : orderData}
        })
    }

 
    // CallPayment callback
    const callbackForCallPayment = (event) => {

        console.log('SDL_dispatchCallPayment  callback')

        // storeCd;         //매장 구분(R:휴게소, S:일반매장)    
        // ordrId;             //주문ID   
        // strPayTyp;         //매장결제타입(P7:PG, P8:전자상거래, P9:NonPG)
        // payMthdCd;          //결제수단구분(CH:현금, PC:신용카드)  
        // payOtc;             //NonPG OTC
        // ordrKindCd;         //주문종류구분(2ICP:픽업선불, 9ICP:배달선불, 9ICA:배달후불-카드, 9ICM:배달후불-현금)
        // dlAddr;             //배달주소 
        // dlAddrDtl;          //배달주소상세 
        // ordrDesc;           //주문 요청사항 
        // dlMnDesc;         //배달기사 요청사항
        // disposableUseFg;   //일회용품 사용여부(0:비사용, 1:사용)
        // orderCnct;          //주문자연락처(비회원)

        console.log('callback event!!!!:' ,event)

        let oct = event.detail.otc === undefined ? '' : event.detail.otc
        let pgCd = event.detail.pgCd === undefined ? '05' : event.detail.pgCd
        let pgTrxCode = event.detail.pgTrxCode === undefined ? '' : event.detail.pgTrxCode
        let pgPayUrl = event.detail.pgPayUrl === undefined ? '' : event.detail.pgPayUrl

        const content = location.state.data;
        console.log('callbackForCallPayment content',content)
        const lng = content.addressData.x 
        const lat = content.addressData.y 

        const res = JSON.parse(localStorage.getItem('contentData'))
        // const res = data.userOrderVerify.validatedData
        // console.log('contentData',res)

        // 법정동 주소
        const bAddress = location.state.data.addressData.address.address_name

        // 행정동 주소
        const hAddress = location.state.data.addressData.address.region_1depth_name + ' ' + location.state.data.addressData.address.region_2depth_name
        + ' ' + location.state.data.addressData.address.region_3depth_h_name + ' ' + location.state.data.addressData.address.main_address_no
        + ' ' + (location.state.data.addressData.address.sub_address_no !== null && location.state.data.addressData.address.sub_address_no !== ''  ? '-' + location.state.data.addressData.address.sub_address_no : '')

        // 도로명 주소
        const rAddress = location.state.data.addressData.road_address !== null ? location.state.data.addressData.road_address.address_name : '' 

        // 빌딩명
        const buildingName = location.state.data.addressData.road_address !== null ? location.state.data.addressData.road_address.building_name : '' 

        const param = {

            storeCd : content.menuData.storeCd, // S: 상점, R : 휴게소
            ordrId : content.orderData.ordrId,
            pgCd : pgCd, //PG사 구분
            payOtc : oct,
            ordrKindCd : res.data.payMethod, // 2ICP:픽업선불, 9ICP:배달선불, 9ICA:배달후불-카드, 9ICM:배달후불-현금
            dlAddr : rAddress,
            dlLwAddr: bAddress,
            dlLnAddr: hAddress,
            buldNm: buildingName,
            dlAddrDtl : res.data.addressDetail,
            ordrDesc : res.data.memoForStore,
            dlMnDesc : res.data.memoForDelivery,
            disposableUseFg : res.data.wantDisposal ? 1 : 0,
            orderCnct : res.data.memberPhoneNumber,
            dlLng : lng,
            dlLat : lat,
            pgTrxCode: pgTrxCode,   //결제거래 고유번호
            pgPayUrl: pgPayUrl,   
            
        }


        if(pgCd === 'P0'){ // 제로페이
            API.completeOrder(param)
            .then((res)=>{
                if(res.code === 1){
                    console.log('completeOrder success', res)
                    callSuccess(res.data)
                }else{
                    dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: res.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
                }
            }).catch((err)=>{
                console.log('err',err)
                
            }).then(()=>{
                localStorage.removeItem('contentData')
            })
        }else if(pgCd === '05'){ // 앱투앱

            if(param.payOtc === ''){
                if(param.ordrKindCd === '9ICA' || param.ordrKindCd ==='9ICM'){

                }else{
                    dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: '결제되지 않았습니다. 다시 시도 바랍니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                    return
                }
            }

            API.completeOrder(param)
            .then((res)=>{
                if(res.code === 1){
                    console.log('completeOrder success', res)
                    callSuccess(res.data)
                }else{
                    dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: res.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
                }
            }).catch((err)=>{
                console.log('err',err)
                
            }).then(()=>{
                localStorage.removeItem('contentData')
            })
        }else if(pgCd === 'P8'){ // 전자상거래
            
        }else if(pgCd === 'NC'){ // 나이스 PG
            if(param.ordrKindCd === '9ICA' || param.ordrKindCd === '9ICM'){
                API.completeOrder(param)
                .then((res)=>{
                    if(res.code === 1){
                        console.log('completeOrder success', res)
                        callSuccess(res.data)
                    }else{
                        dispatch({type : REDUCER_ACTION.SHOW_TOAST, payload : {show : true , data : {msg: res.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
                    }
                }).catch((err)=>{
                    console.log('err',err)
                    
                }).then(()=>{
                    localStorage.removeItem('contentData')
                })
            }else{
                dispatch({type : REDUCER_ACTION.OPEN_NICE_PG_POP , payload : {param : param, dispath : dispatch}})
            }
            
        }

    }

    const callBackforPGPayment = (event) =>{
        if (event.origin.indexOf(process.env.REACT_APP_SDL_API_DOMAIN) !== -1) {
            const res = JSON.parse(event.data)
            console.log('callBackforPGPayment',res)
            console.log('callBackforPGPayment',res.data)

            dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})

            if(res.code === "9"){ // 제로페이 결제
                if(res.data.code === 1){
                    window.dispatchEvent(new CustomEvent('SDL_dispatchCallPayment',{detail : {otc : res.data.data.payOtc, pgCd : 'P0', pgTrxCode : res.data.data.pgTrxCode}}))
                }else if(res.data.code === 2){
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: '결제 취소하셨습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                }else{
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: res.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
                }
            }else if(res.code === "7"){ // 나이스 PG
                if(res.data.code === 1){
                    callSuccess(res.data.data)
                }else if(res.data.code === 2){
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: '결제 취소하셨습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                }else{
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: res.data.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
                }
            }else if (res.code === "10"){ // 전자상거래
                if(res.data.code === 1){
                    callSuccess(res.data.data)
                }else if(res.data.code === 2){
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: '결제 취소하셨습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
                }else{
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: res.data.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
                }
            }
        
                
            localStorage.removeItem('contentData')

        }
    }

    useEffect(()=>{

        dispatch({type:REDUCER_ACTION.INIT_DELIVERY_ADDRESS})

        console.log('addEventListener SDL_dispatchCallPayment message')
        window.addEventListener('SDL_dispatchCallPayment',callbackForCallPayment,false)
        window.addEventListener("message", callBackforPGPayment, false);

        try{
            if(!location.state.isFromCart){
                removeCartDataAll();
            }
        }catch(err){}
        
        window.scrollTo(0, 0)

        return()=>{
            
            // if(data.terms.show){
            //     dispatch({type : 'TERMS', payload : {show : false }})
            //     history.goForward();
            //     return
            // }else{
            //     console.log('removeEventListener SDL_dispatchStartPermission')
            //     window.removeEventListener('SDL_dispatchCallPayment',callbackForCallPayment,false)
            // }

            console.log('removeEventListener SDL_dispatchCallPayment message')
            window.removeEventListener('SDL_dispatchCallPayment',callbackForCallPayment,false)
            window.removeEventListener('message',callBackforPGPayment,false)
        }
    },[])

    const refOrdererInfoSection = useRef()
    const refMemoSection = useRef()
    const refPaySection = useRef()
    const refPayAgreeSection = useRef()

    const checkVailidation = () => {

        console.log('refAddressDetail', refOrdererInfoSection )
        console.log('refMemoSection', refMemoSection )
        console.log('refPaySection', refPaySection )
        console.log('refPayAgreeSection', refPayAgreeSection.current.checked)

        let address = null;
        let addressDetail = null;
        let memberPhoneNumber = null;
        let nonMemberPhoneNumber = null;
        let wantDisposal = null;
        let memoForStore = null;
        let memoForDelivery = null;
        let payMethod = null;
        let isAgree = null;
        let isCertComplete = null

        // 픽업일 때 주문자 주소 체크하지 않음
        if(!isPickup(location)) {
            address = refOrdererInfoSection.current.refAddressBox.current.refAddress.current.innerText
            addressDetail = refOrdererInfoSection.current.refAddressBox.current.refAddressDetail.current.value
        }
        
        if(isMember(location)){
            if(isRestAreaCategory(location)){
                memberPhoneNumber = ''
            }else{
                memberPhoneNumber = refOrdererInfoSection.current.refPhoneNumberChangeBox.current.refCurrentPhoneNumber.current.value
            }
        }else{
            if(!isPickup(location)){
                nonMemberPhoneNumber = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refPhoneNumer.current.value
                isCertComplete = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refCertComplete
            }else{
                if(isRestAreaCategory(location)){
                    nonMemberPhoneNumber = ''
                    isCertComplete = true
                }else{
                    nonMemberPhoneNumber = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refPhoneNumer.current.value
                    isCertComplete = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refCertComplete
                } 
            }
        }
         
        if(!isRestAreaCategory(location)){
            wantDisposal = refMemoSection.current.refCheckDisposal.current.checked
            memoForStore = refMemoSection.current.refMemoForStore.current.value
        }
         

         if(!isPickup(location)){
            memoForDelivery = refMemoSection.current.refMemoForDelivery.current.value
         }
         
        payMethod = refPaySection.current.pay
        isAgree = refPayAgreeSection.current.checked


        console.log('address',address)
        console.log('addressDetail',addressDetail)
        console.log('memberPhoneNumber',memberPhoneNumber)
        console.log('nonMemberPhoneNumber',nonMemberPhoneNumber)
        console.log('wantDisposal',wantDisposal)
        console.log('memoForStore',memoForStore)
        console.log('memoForDelivery',memoForDelivery)
        console.log('payMethod',payMethod)
        console.log('isAgree',isAgree)
        console.log('isCertComplete',isCertComplete)

        const result = {
            code : 1 , 
            data : {
                address : address , 
                addressDetail : addressDetail , 
                memberPhoneNumber : isMember(location) ? memberPhoneNumber : nonMemberPhoneNumber,
                wantDisposal : wantDisposal,
                memoForStore: memoForStore,
                memoForDelivery : memoForDelivery,
                payMethod : payMethod,
                isAgree : isAgree,
            }
        }

        if(!isPickup(location) && !addressDetail){
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '상세주소를 입력하세요', code : '', dispatch : dispatch} , callback : toastCallback}})
            // console.log('addressDetailaddressDetailaddressDetail')
            // refOrdererInfoSection.current.refAddressBox.current.refAddressDetail.current.focus()
            result.code = 0;
            result.data = {};
            return result;
        }

        if(isMember(location) && !memberPhoneNumber){
            if(!isRestAreaCategory(location)){
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: '휴대폰 번호를 입력하세요', code : '', dispatch : dispatch} , callback : toastCallback}})
            // console.log('memberPhoneNumbermemberPhoneNumbermemberPhoneNumber')
            // refOrdererInfoSection.current.refPhoneNumberChangeBox.current.refCurrentPhoneNumber.current.focus()
            result.code = 0;
            result.data = {};
            return result;
            }
        }

        if(!isMember(location) && !isCertComplete){
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '휴대폰 번호 인증을 해주세요', code : '', dispatch : dispatch} , callback : toastCallback}})
            // console.log('nonMemberPhoneNumbernonMemberPhoneNumbernonMemberPhoneNumber')
            // console.log('refOrdererInfoSection',refOrdererInfoSection.current.refMobilePhoneAuthentication.current)
            // refOrdererInfoSection.current.refMobilePhoneAuthentication.current.focus()
            result.code = 0;
            result.data = {};
            return result;
        }
        
        if(!payMethod){
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '결제방법을 선택해주세요.', code : '', dispatch : dispatch} , callback : toastCallback}})
            // console.log('payMethodpayMethodpayMethod')
            // refPaySection.current.focus()
            result.code = 0;
            result.data = {};
            return result;
        }

        if(!isAgree){
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '결제동의를 선택해주세요.', code : '', dispatch : dispatch} , callback : toastCallback}})
            // console.log('isAgreeisAgreeisAgree')
            // refPayAgreeSection.current.focus()
            result.code = 0;
            result.data = {};
            return result;
        };

        return result
    }

    return (
        <>
            {console.log('rendering!!!!')}
            <div id="wrap">
                <HeaderSection/>
                <div id="container">
                    <div id="content">
                        {isPickup(location) && 
                            <>
                                <StoreInfoSection dispatch={dispatch}/>
                                <div className="sectionBlock"></div>
                            </>
                        }
                        
                        {!isRestAreaCategory(location) && 
                            <>
                                <OrdererInfoSection ref = {refOrdererInfoSection}/>
                                <div className="sectionBlock"></div>
                            </>
                        }
                        {!isRestAreaCategory(location) && 
                            <>
                                <MemoSection ref={refMemoSection}/>
                                <div className="sectionBlock"></div>
                            </>
                        }
                        <OderMenuSection isPickup={isPickup(location)}/>
                        <div className="sectionBlock"></div>
                        {hasDiscount(location) && 
                        <>
                        <OrderDiscountSection />
                        <div className="sectionBlock"></div>
                        </>
                        }
                        
                        <OrderAmountSection isPickup={isPickup(location)}/>
                        <div className="sectionBlock"></div>
                        <PaySection ref = {refPaySection}/>
                        {isPickup(location) && <PickUpNoticeSection />}
                        <PayAgreeSection ref = {refPayAgreeSection}/>
                        <OrderButton checkVailidation={checkVailidation}/>
                    </div>
                </div>
            </div>
        </>
    );
};

/////////////////////////// function

const toastCallback = (data) => {
    data.dispatch({type : REDUCER_ACTION.HIDE_TOAST})
}

const isRestAreaCategory = (location) => {
    let isRestAreaCategory
    try{
        isRestAreaCategory = location.state.data.menuData.storeCd === "R" ? true : false
    }catch(err){
        isRestAreaCategory = false
    }
    return isRestAreaCategory
}

const isPickup = (location) =>{
    let isPickUp
    try{
        isPickUp = Number(location.state.data.menuData.orderType) ? true : false
    }catch(err){
        isPickUp = true
    }
    return isPickUp
}

const isMember = (location) =>{
    let isMember
    try{
        isMember = Number(location.state.data.orderData.isMember) ? true : false
    }catch(err){
        isMember = false
    }
    console.log('isMember',isMember);
    return isMember
}

const hasDiscount = (location) => {
    let hasDiscount
    try{
        hasDiscount = location.state.data.orderData.discInfo.length > 0 ? true : false
    }catch(err){
        hasDiscount = false
    }
    console.log('hasDiscount',hasDiscount);
    return hasDiscount
}

/////////////////////////// function

const HeaderSection = () => {

    let history = useHistory();
    let location = useLocation();

    const {data,dispatch} = useContext(SDLContext)
    
    const onClickBackBtn = useCallback(() => {

        dispatch({type: REDUCER_ACTION.HISTORY_BACK})
        
    },[history]);

    return (
        <>
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <button  className="icon pageBack" onClick={onClickBackBtn}>Back</button>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">{isPickup(location) ? '픽업' : '배달'} 주문하기</h1>
                    </div>
                </div>
            </div>
        </>
    )
}


const OrdererInfoSection = forwardRef(({},ref) => {

    const location = useLocation()
    const refAddressBox = useRef()
    const refPhoneNumberChangeBox = useRef()
    const refMobilePhoneAuthentication = useRef()

    useImperativeHandle(ref,() =>({
        refAddressBox: refAddressBox,
        refPhoneNumberChangeBox : refPhoneNumberChangeBox,
        refMobilePhoneAuthentication : refMobilePhoneAuthentication.current ? refMobilePhoneAuthentication : null
    }))

    return (
        <>
            <div className="rowSection">
                <div className="infoCard">
                    <h2 className="title">주문자 정보</h2>
                    {!isPickup(location) && <AddressBox ref = {refAddressBox}/> }
                    {isMember(location) ? <PhoneNumberChangeBox ref = {refPhoneNumberChangeBox}/>
                    : <MobilePhoneAuthentication ref = {refMobilePhoneAuthentication}/>}
                    {/* {!isMember(location) && <MobilePhoneAuthentication ref = {refMobilePhoneAuthentication}/>} */}
                </div>
            </div>
        </>
    )
})

const AddressBox = forwardRef(({},ref)=> {
    
    let location = useLocation()

    const refAddress = useRef()
    const refAddressDetail = useRef()

    useImperativeHandle(ref, () => ({
        refAddress : refAddress,
        refAddressDetail :refAddressDetail
    }));

    const ordererAddressValue = () => {
        let address = ''
        try{
            address = location.state.data.addressData.address_name
        }catch(err){
            address = ''
        }
        return address;
    }

    const ordererAddressDetailValue = () => {
        let addressDetail = ''
        try{
            addressDetail = location.state.data.addressData.address_detail
        }catch(err){
            addressDetail = ''
        }
        return addressDetail;
    }

    return (
        <>
            <div className="descBox">
                <p className="descInfo" ref = {refAddress} data-address ={ordererAddressValue()}>
                    {ordererAddressValue()}
                </p>
                <div className="descInput">
                    <TextInputBox  
                        className = 'textInput'
                        placeholder="상세주소를 입력하세요" 
                        value = {ordererAddressDetailValue()}
                        ref = {refAddressDetail}
                        maxLength = '50'
                    />
                </div>
            </div>
        </>
    )
})

const MobilePhoneAuthentication = forwardRef(({},ref) => {

    const [isReceivedCert, setIsReceivedCert] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    const refCertNumer = useRef();
    const refPhoneNumer = useRef();
    const refSendBtn = useRef();
    const refMsg1 = useRef();
    const refMsg2 = useRef();

    useImperativeHandle(ref,() => ({
        refPhoneNumer : refPhoneNumer,
        refCertComplete : isComplete
    }))

    const init = ()=>{
        if(refCertNumer.current) refCertNumer.current.value = ''
        refSendBtn.current.innerText = '인증번호 받기'
        refMsg1.current.innerText = ''
        if(refMsg2.current) refMsg2.current.innerText = ''
        if(isReceivedCert) setIsReceivedCert(false)
        if(isComplete) setIsComplete(false)
    }

    const success = () => {
        if(refCertNumer.current) refCertNumer.current.value = ''
        refSendBtn.current.innerText = '인증번호 받기'
        refMsg1.current.innerText = ''
        if(refMsg2.current) refMsg2.current.innerText = ''
        refSendBtn.current.disabled = true
        refPhoneNumer.current.disabled = true
        
        setIsReceivedCert(false)
        setIsComplete(true)
    }

    const handleCertBtn = ()=>{

        if(refPhoneNumer.current.value == '') {
            refMsg1.current.innerText = '휴대폰 번호를 입력해주세요.'
            return ;
        }

        init()

        refSendBtn.current.innerText = '인증번호 재전송'

        API.certPhoneNumber(refPhoneNumer.current.value)
        .then((data) => {
            console.log('order form certPhoneNumber res',data)
            if(data.code) {
                setIsReceivedCert(true)
            }
            refMsg1.current.innerText = ''
        }).catch((err)=>{
            if(err.response.status == 400) {
                refMsg1.current.innerText = '휴대폰 번호 형식이 아닙니다.'
            }
            else {
                refMsg1.current.innerText = err.response.data.msg
                console.log('order form certPhoneNumber err',err)
            }
        })
    }

    const handleCompleteBtn = ()=>{
        API.verifyCertNumber(refPhoneNumer.current.value,refCertNumer.current.value)
        .then((data) => {
            console.log('order form verifyCertNumber res',data)
            if(data.code) {
                success()
            }
        }).catch((err)=>{
            if(err.response.status === 400) {
                refMsg2.current.innerText = '인증번호가 일치하지 않습니다.'
            }
            else {
                console.log('order form certPhoneNumber err',err)
                refMsg2.current.innerText = err.response.data.msg
            }
        })
    }

    

    return (
        <>
            <div className="descInput">
                <div className="certifiArea">
                    <div className="certifiRow">
                        <NumberInputBox
                            className="textInput"
                            placeholder="휴대폰 번호를 입력하세요."
                            ref = {refPhoneNumer}
                            maxLength = '15'
                        />
                        <button className="btn completeBtn" onClick={handleCertBtn} ref = {refSendBtn}>인증번호 받기</button>
                        <p className="errMsg" ref = {refMsg1}></p>
                    </div>
                
                    {isReceivedCert &&
                        <div className="certifiRow">
                            <NumberInputBox   
                                className="textInput"
                                placeholder="인증 번호를 입력하세요."
                                ref = {refCertNumer} 
                                maxLength = '10'
                            />
                            <button className="btn completeBtn" onClick = {handleCompleteBtn}>완료</button>
                            <p className="errMsg" ref = {refMsg2}></p>
                        </div>
                    }

                    {isComplete &&
                        <div className="completeDone" ref = {refMsg2}>휴대폰 인증 완료</div>
                    }
                </div>
            </div>
        </>
    )
})



const PhoneNumberChangeBox = forwardRef(({},ref) => {

    let location = useLocation();

    const refCurrentPhoneNumber = useRef()

    useImperativeHandle(ref,()=>({
        refCurrentPhoneNumber : refCurrentPhoneNumber
    }))

    return (
        <>
            <div className="descBox">
                <div className="descInput">
                    <NumberInputBox   
                        className="textInput"
                        value = {location.state.data.orderData.mbrCnctNo}
                        disabled = {true}
                        ref = {refCurrentPhoneNumber}
                    />
                </div>
            </div>
        </>
    )
})

const MemoSection = forwardRef(({},ref) => {

    const location = useLocation()
    const refMemoForStore = useRef()
    const refMemoForDelivery = useRef()

    useImperativeHandle(ref, () => ({
        refMemoForStore :refMemoForStore.current.refTextInputBox,
        refCheckDisposal : refMemoForStore.current.refCheckBox,
        refMemoForDelivery :refMemoForDelivery,
    }));

    // useImperativeHandle(ref,()=>{
    //     value : refMemoForStore.current.value
    // })

    return (
        <>
            <div className="rowSection">
                <div className="infoCard">
                    <h2 className="title">요청사항</h2>
                    <MemoForStore ref = {refMemoForStore} />
                    {!isPickup(location) && <MemoForDelivery ref = {refMemoForDelivery}/>}
                </div>
            </div>
        </>
    )
})

const MemoForStore = forwardRef(({},ref) => {

    const refTextInputBox = useRef()
    const refCheckBox = useRef()

    useImperativeHandle(ref,()=>({
        refTextInputBox : refTextInputBox ,
        refCheckBox : refCheckBox
    }))

    return (
        <>
            <div className="descBox">
                <p className="descInfo">매장에 요청해요.</p>
                <div className="descInput">
                    <TextInputBox  
                        className = 'textInput'
                        placeholder="예) 얼음 조금만 넣어주세요." 
                        ref = {refTextInputBox}
                        maxLength = '50'
                    />

                </div>
                <div className="descInput">
                    <label className="checkSelect">
                        <input type="checkbox" ref = {refCheckBox}/> <span className="dCheckBox">일회용품은 안 주셔도 됩니다.</span>
                        {/* <span className="checkInfo">일회용품은 안 주셔도 됩니다.</span> */}
                    </label>
                </div>
                
            </div>
        </>
    )

})

const MemoForDelivery = forwardRef(({},ref) => {

    return (
        <>
            <div className="descBox">
                <p className="descInfo">라이더에게 요청해요.</p>
                <div className="descInput">
                    <TextInputBox  
                        className = 'textInput'
                        placeholder="예) 집 앞에 두고 가세요." 
                        ref = {ref}
                        maxLength = '50'
                    />
                </div>
            </div>
        </>
    )
})



const OderMenuSection = ( {isPickup} ) => {

    let location = useLocation();

    const {data,dispatch} = useContext(SDLContext)
    const {totalDeliAmount, setTotalDeliAmount} = useState(0);

    const showDeliveryTipPop = ()=>{

        let arr = [];
        let totalDeliAmount = 0;

        if(location.state.data.orderData.dlBsPrc !== 0){// 배달팁 할인
            arr = [...arr, {reason: '배달팁', prc: numberFormat(location.state.data.orderData.dlBsPrc)}]
            totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlBsPrc
        }

        if(location.state.data.orderData.dlDtcPrc !== 0){// 배달 거리별 추가 할인
            arr = [...arr, {reason: '거리 할증', prc: numberFormat(location.state.data.orderData.dlDtcPrc)}]
            totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlDtcPrc
        }

        if(location.state.data.orderData.dlRgnPrc !== 0){// 배달 지역별 추가 할인
            arr = [...arr, {reason: '지역 할증', prc: numberFormat(location.state.data.orderData.dlRgnPrc)}]
            totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlRgnPrc
        }

        if(location.state.data.orderData.dlDtPrc !== 0){// 배달 일자별 추가 할인
            arr = [...arr, {reason: '요일 할증', prc: numberFormat(location.state.data.orderData.dlDtPrc)}]
            totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlDtPrc
        }

        if(location.state.data.orderData.dlDtmPrc !== 0){// 배달 시간별 추가 할인
            arr = [...arr, {reason: '시간 할증', prc: numberFormat(location.state.data.orderData.dlDtmPrc)}]
            totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlDtmPrc
        }
        
        dispatch({type:REDUCER_ACTION.SHOW_DELI_TIP_POP, payload:{data : { tips : arr, totalTip : numberFormat(totalDeliAmount)}, callback : ()=>{
            dispatch({type : REDUCER_ACTION.HIDE_DELI_TIP_POP})
        }}})
    }

    const menus = () => {
        let menus
        try{
            menus = [...location.state.data.menuData.menus]
        }catch(err){
            menus = []
        }
        return menus
    }

    const deliverylPrice = () => {

        let totalDeliAmount = 0;
        totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlBsPrc
        totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlDtcPrc
        totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlRgnPrc
        totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlDtPrc
        totalDeliAmount = totalDeliAmount + location.state.data.orderData.dlDtmPrc
    
        return numberFormat(totalDeliAmount)
    }

    

    return (
        <>
            <div className="rowSection">
                <div className="historyCard">
                    <h2 className="title">주문내역</h2>
                    <ul className="historyList">

                        {menus().map((menu) =>
                            <li key={menu.key}>
                                <span className="name">
                                    {unescapehtmlcode(menu.prdNm)} x {menu.count}
                                    <span className="options">
                                        {
                                            menu.option.map((option, index) => {
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
                                    </span>
                                </span>
                                <span className="amount">{numberFormat(menu.totalPrice * menu.count)} 원</span>
                            </li>
                        )}

                        { !isPickup && 
                        <li>
                            <span className="name">
                                배달팁
                                <button type="button" onClick={()=>{showDeliveryTipPop()}}>
                                    <span className="icon questionMark">?</span>
                                </button>
                            </span>

                            <span className="amount">{deliverylPrice()} 원</span>
                        </li>
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

const OrderDiscountSection = () => {

    let location = useLocation()

    const discountPrice = () => {
        let discPrc
        try{
            discPrc = location.state.data.orderData.discPrc
        }catch(err){
            discPrc = '0'
        }
        return numberFormat(discPrc)
    }

    return (
        <>
            <div className="rowSection">
                <div className="historyCard">
                    <h2 className="title">할인혜택</h2>
                    <ul className="historyList">
                        {location.state.data.orderData.discInfo.map((discInfo)=>
                            <li key={discInfo.reason}>
                                <span className="name">{discInfo.reason}</span>
                                <span className="amount">{numberFormat(discInfo.price)}원</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}

const OrderAmountSection = ({isPickup}) => {

    useEffect(() => {
        console.log(isPickup)
    }, [isPickup])

    let location = useLocation();

    const deliverylPrice = () => {
        let dlPrc
        try{
            dlPrc = location.state.data.orderData.dlPrc
        }catch(err){
            dlPrc = '0'
        }
        return numberFormat(dlPrc)
    }

    const orderPrice = () => {
        let ordrPrc
        try{
            ordrPrc = location.state.data.orderData.ordrPrc
        }catch(err){
            ordrPrc = '0'
        }
        return numberFormat(ordrPrc)
    }

    const discountPrice = () => {
        let discPrc
        try{
            discPrc = location.state.data.orderData.discPrc
        }catch(err){
            discPrc = '0'
        }
        return numberFormat(discPrc)
    }

    const payPrice = () => {
        let payPrc
        try{
            payPrc = location.state.data.orderData.payPrc
        }catch(err){
            payPrc = '0'
        }
        return numberFormat(payPrc)
    }

    return (
        <>
            <div className="rowSection">
                <div className="historyCard">
                    <h2 className="title">결제금액</h2>
                    <ul className="historyList">
                        <li>
                            <span className="name">
                                주문금액
                            </span>
                            <span className="amount">
                                {orderPrice()} 원
                            </span>
                        </li>
                        { !isPickup && 
                        <li>
                            <span className="name">
                                배달팁
                            </span>
                            <span className="amount">
                                {deliverylPrice()} 원
                            </span>
                        </li>
                        }
                        {discountPrice() !== '0' &&
                            <li>
                                <span className="name">
                                    할인금액
                                </span>
                                <span className="amount">
                                    {'-'+discountPrice()} 원
                                </span>
                            </li>
                        }
                        
                    </ul>
                    <div className="historyTotal">
                        <span className="name">총 결제금액</span>
                        <span className="amount">{payPrice()} 원</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const PaySection = forwardRef(({},ref)=>{

    const location = useLocation()

    const refUl = useRef()

    useImperativeHandle(ref,()=>({
        pay : refUl.current.dataset.pay,
        focus : () => {refUl.current.focus()}
    }))

    const [payStatus, setPayStatus] = useState({
        zeropay : {enable : false , className : ''},
        card : {enable : false , className : ''},
        cash : {enable : false , className : ''},
        prePay : {enable : false , className : ''},
        pickPay : {enable : false , className : ''}
    })

    useEffect(()=>{
        try{

            const use2icpFg = location.state.data.orderData.use2icpFg //픽업선불 사용여부
            const use9icpFg = location.state.data.orderData.use9icpFg //배달선불 사용여부
            const use9icaFg = location.state.data.orderData.use9icaFg //배달후불(카드) 사용여부
            const use9icmFg = location.state.data.orderData.use9icmFg //배달후불(현금) 사용여부
            const useZeropayFg = location.state.data.orderData.zeropayPgFg //제로페이 사용여부
            // let orderType = 0
            // let use2icpFg = 1
            // let use9icpFg = 1
            // let use9icaFg = 1
            // let use9icmFg = 1

    
            if(!isPickup(location)){
                if(Number(use9icpFg) === 1){
                    payStatus.prePay.enable = true
                    if(location.state.data.orderData.zeropayPgFg === 1){
                        payStatus.zeropay.enable = true
                    }
                }
    
                if(Number(use9icaFg) === 1){
                    payStatus.card.enable = true
                }
    
                if(Number(use9icmFg) === 1){
                    payStatus.cash.enable = true
                }
    
            }else{
                if(Number(use2icpFg) === 1){
                    payStatus.pickPay.enable = true
                    if(location.state.data.orderData.zeropayPgFg === 1){
                        payStatus.zeropay.enable = true
                    }
                }
            }

            setPayStatus({...payStatus})
            
        }catch(err){}
    },[])
    
    const handleClick = (code) => {
        try{
            
            if(code === '9ICP'){
                console.log(code)
                payStatus.prePay.className = 'active'
                payStatus.card.className = ''
                payStatus.cash.className = ''
                payStatus.zeropay.className = ''
            }else if(code === '9ICA'){
                console.log(code)
                payStatus.prePay.className = ''
                payStatus.card.className = 'active'
                payStatus.cash.className = ''
                payStatus.zeropay.className = ''
            }else if(code === '9ICM'){
                console.log(code)
                payStatus.prePay.className = ''
                payStatus.card.className = ''
                payStatus.cash.className = 'active'
                payStatus.zeropay.className = ''
            }else if(code === '2ICP'){
                console.log(code)
                payStatus.prePay.className = ''
                payStatus.card.className = ''
                payStatus.cash.className = ''
                payStatus.pickPay.className = 'active' // setPayStatus({...payStatus,pickPay:{...payStatus.pickPay, className : 'active'}})
                payStatus.zeropay.className = ''
            }else if(code === 'zeropay'){
                console.log(code)
                payStatus.prePay.className = ''
                payStatus.card.className = ''
                payStatus.cash.className = ''
                payStatus.pickPay.className = ''
                payStatus.zeropay.className = 'active'
            }

            setPayStatus({...payStatus})

            if(code === 'zeropay' && isPickup(location)){
                code = '2ICPZ'
            }else if(code === 'zeropay' && !isPickup(location)){
                code = '9ICPZ'
            }

            refUl.current.dataset.pay = code

        }catch(err){}
    }

    return (
        <>
            <div className="rowSection">
                <div className="infoCard">
                    <h2 className="title">결제방법</h2>
                    <div className="payWayList">
                        <ul className="payWay">
                            {
                                (payStatus.zeropay.enable === true) && <li className={payStatus.zeropay.className} onClick = {() => {handleClick('zeropay')}} ><a>제로페이 결제</a></li>
                            }
                        </ul>
                    </div>
                    <div className="payWayList">
                        <ul className="payWay" ref={refUl} data-pay='' >
                            {
                                (payStatus.pickPay.enable === true) && <li className={payStatus.pickPay.className} onClick = {() => {handleClick('2ICP')}} ><a>바로결제</a></li>
                            }
                            {
                                (payStatus.prePay.enable === true) && <li className={payStatus.prePay.className} onClick = {() => {handleClick('9ICP')}} ><a>바로결제</a></li>
                            }
                            {   
                                (payStatus.card.enable === true) && <li className={payStatus.card.className} onClick = {() => {handleClick('9ICA')}} ><a>만나서 카드결제</a></li>
                            }
                            {
                                (payStatus.cash.enable === true) && <li className={payStatus.cash.className} onClick = {() => {handleClick('9ICM')}} ><a>만나서 현금결제</a></li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
})

const PickUpNoticeSection = () => {

    return (
        <>
            <div className="sectionBlock"></div>
            <div className="rowSection">
                <p className="pickInfoMsg">
                    고객님께서는 픽업 주문을 하고 계십니다.<br />
                    매장으로 직접 방문해주세요.
                </p>
            </div>
        </>
    )
}

const StoreInfoSection = ({dispatch}) => {

    const location = useLocation()

    const copyMsg = (e) =>{
        var copyAddress = e.currentTarget.parentNode.querySelector(".copyAddress_store").innerText;
        var tempElem = document.createElement("textarea")
        document.body.appendChild(tempElem)
        tempElem.value = copyAddress;
        tempElem.select();
        document.execCommand("copy")
        document.body.removeChild(tempElem)
    }

    const handleClick = (e) => {
        dispatch({type : 'TOAST', payload : {show : true , data : {msg: '주소가 복사되었습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
        copyMsg(e)
    };


    return ( 
        <>
            <div className="sectionBlock"></div>
            <div className="rowSection">
                <div className="infoCard">
                    <h2 className="title">매장 정보</h2>
                    <div className="descBox">
                        <p className="descInfo">
                            {unescapehtmlcode(location.state.data.menuData.strNm)}
                        </p>
                        <p className="descInfoSmall">
                            <span className="copyAddress_store">{unescapehtmlcode(location.state.data.menuData.strAddr)}</span>
                            <button type="button" onClick={(e) => {handleClick(e)}} className="btn borderBtn btnSmall">주소복사</button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}


const PayAgreeSection = forwardRef(({},ref) => {

    const {dispatch} = useContext(SDLContext)

    const handleShowTerms = (e) => {
        dispatch({type : 'TERMS', payload : {show : true , data : {index: e.target.dataset.id , code : '', dispatch : dispatch} , callback : termsCallback}})
    }

    const termsCallback = () => {
        dispatch({type : 'TERMS', payload : {show : false }})
    }

    return (
        <>
            <div className="rowSection">
                <div className="agreeBox">
                    <ul className="agreelist">
                        <li>
                            <span>
                                이용약관 및 동의
                            </span>
                            <button type="button" data-id = '0' className='viewList' onClick={handleShowTerms}>내용보기</button>
                        </li>
                        <li>
                            <span>
                                개인정보 수집 및 이용동의
                            </span>
                            <button type="button" data-id = '1' className='viewList' onClick={handleShowTerms}>내용보기</button>
                        </li>
                        <li>
                            <span>
                                개인정보 제3자 제공동의
                            </span>
                            <button type="button" data-id = '1' className='viewList' onClick={handleShowTerms}>내용보기</button>
                        </li>
                        <li>
                            <span>
                                위치기반서비스약관
                            </span>
                            <button type="button" data-id = '3' className='viewList' onClick={handleShowTerms}>내용보기</button>
                        </li>
                        <li>
                            <span>
                                전자금융거래 이용약관
                            </span>
                            <button type="button" data-id = '2' className='viewList' onClick={handleShowTerms}>내용보기</button>
                        </li>
                    </ul>
                    <label className="checkSelect">
                        <input type="checkbox" ref = {ref} /> <span className="dCheckBox">위의 내용을 확인하였으며 결제에 동의합니다.</span>
                    </label>
                    <ul className="dottedList">
                        <li>재고소진,  전산장애 등 매장 사정에 의해 주문이 취소될 수 있습니다.</li>
                        <li>결제 완료 후, 주문 접수 후 취소를 원할 시, 주문하신 매장으로 직접 전화를 주시기 바랍니다. </li>
                    </ul>
                </div>
            </div>
        </>
    )
})

const OrderButton = ({checkVailidation, }) => {

    const {dispatch,data} = useContext(SDLContext);
    const location = useLocation();
    const history = useHistory();

    const payAmount = () => {
        let amount
        try{
            amount = location.state.data.orderData.payPrc
        }catch(err){
            amount = 0
        }
        return numberFormat(amount)
    }

    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
        history.goBack();
    }

    const btnClick = (e)=>{
        e.preventDefault()
        const validate = checkVailidation()
        console.log('order form validate data', validate)
        
        if(validate.code === 1){

            const storeCd = location.state.data.menuData.storeCd
            const userLng = location.state.data.addressData.x
            const userLat = location.state.data.addressData.y
            const userHjd = location.state.data.addressData.address.h_code
            const ordrId = location.state.data.orderData.ordrId

            let ordrKindCd = validate.data.payMethod
            let pgCd  = location.state.data.orderData.pgCd
            
            if(ordrKindCd.indexOf('Z') !== -1){
                validate.data.payMethod = ordrKindCd.substr(0,4)
                pgCd = 'P0'
            }

            localStorage.setItem('contentData', JSON.stringify(validate))

            console.log('checkVailidation res',validate)

            API.getOrdersVerify(storeCd,userLng,userLat,userHjd,validate.data.payMethod,ordrId,pgCd)
            .then((res)=>{
                if(res.code){

                    // 데이터 저장
                    // data.userOrderVerify.pgCd = pgCd
                    // data.userOrderVerify.pgTrxCode = res.data.pgTrxCode
                    // data.userOrderVerify.validatedData = {...validate}

                    if(pgCd === 'P0'){ // 제로페이

                        dispatch({type:REDUCER_ACTION.OPEN_ZERO_PAY_PURCHASE, payload:{pgPayUrl : res.data.pgPayUrl}})

                    }else if(pgCd === '05'){ // 앱투앱
                        if(validate.data.payMethod === '9ICA' || validate.data.payMethod === '9ICM'){ // 배달 후불(카드,결제)일 경우 결제 단계는 패쓰한다.
                            window.dispatchEvent(new CustomEvent('SDL_dispatchCallPayment',{detail : {otc : '',  pgCd : pgCd}}))
                        }else{
    
                            try{
                                const json = {
                                    ordrId : location.state.data.orderData.ordrId,
                                    partnerId : res.data.nonPgPartnerId,
                                    merchantCd : res.data.nonPgMerchantCd,
                                    vanId : '000002',
                                    partnerCd : res.data.nonPgPartnerCd,
                                    payPrice : location.state.data.orderData.payPrc
                                }

                                AppBridge.SDL_dispatchCallPayment(json)
                    
                            }catch(err){
                                dispatch({type : 'TOAST', payload : {show : true , data : {msg: '내부오류입니다. 잠시 후 다시 진행해 주세요.', code : '', dispatch : dispatch} , callback : toastCallback}})
                            }
                        }
                    }else if(pgCd === 'P8'){ // 전자상거래
                        
                    }else if(pgCd === 'NC'){ // 나이스 PG
                        
                        if(validate.data.payMethod === '9ICA' || validate.data.payMethod === '9ICM'){ // 배달 후불(카드,결제)일 경우 결제 단계는 패쓰한다.
                            window.dispatchEvent(new CustomEvent('SDL_dispatchCallPayment',{detail : {otc : '',  pgCd : pgCd}}))
                        }else{
                            window.dispatchEvent(new CustomEvent('SDL_dispatchCallPayment',{detail : {otc : '', pgCd : pgCd, pgTrxCode : res.data.pgTrxCode, pgPayUrl : res.data.pgPayUrl}}))
                        }
                    }
                    
                
                }else{
                    dispatch({type : 'TOAST', payload : {show : true , data : {msg: res.msg + ' 다시 주문을 진행해 주세요.', code : '', dispatch : dispatch} , callback : toastCallback}})
                }
            })
            .catch((err)=>{
                console.log('getOrdersVerify err',err.response.data.msg)
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: err.response.data.msg +  ' 다시 주문을 진행해 주세요.', code : '', dispatch : dispatch} , callback : toastCallback}})
            })
            
        }else{

        }
    }

    

    return (
        <>
            <div className="fixedBtn flex3half1" >
                <a className="btn addOrder" onClick={btnClick}>{payAmount()} 원 결제하기</a>
            </div>
        </>
    )
        
};


export default OderFormContainer