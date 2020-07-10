
import React, { useEffect, useState, useCallback,useRef,forwardRef,useImperativeHandle,useContext } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import { removeCartDataAll, numberFormat, unescapehtmlcode } from '../../../util/Utils'
import {SDLContext} from '../../../context/SDLStore'

import * as API from '../../../Api'
import * as AppBridge from '../../../appBridge'
import {NumberInputBox,TextInputBox} from  '../../../components/InputComponent'


const OderFormContainer = ( {history,location} ) => {

    const {dispatch,data} = useContext(SDLContext);

    const callSuccess = (orderData)=>{

        removeCartDataAll(); // 장바구니 데이터를 삭제한다.

        history.push({
            pathname: ACTION.LINK_ORDER_SUCCESS,
            state : {orderData : orderData}
        })
    }

    // CallPayment callback
    const callbackForCallPayment = useCallback((event) => {

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
        console.log('callback event!!!! otc :' ,event.detail.otc)

        const content = location.state.data;
        console.log('callbackForCallPayment content',content)
        const lng = content.addressData.x 
        const lat = content.addressData.y 

        const oct = event.detail.otc

        const res = JSON.parse(localStorage.getItem('contentData'))

        console.log('contentData',res)

        const param = {

            storeCd : content.menuData.bizCtgDtl === Number(19) ? 'R' : 'S', // S: 상점, R : 휴게소
            ordrId : content.orderData.ordrId,
            strPayTyp : content.orderData.strPayTyp, //P7:PG, P8:전자상거래, P9:NonPG
            payMthdCd : res.data.payMethod === '9ICM' ? 'CH' : 'PC', // CH:현금, PC:신용카드
            payOtc : oct,
            ordrKindCd : res.data.payMethod, // 2ICP:픽업선불, 9ICP:배달선불, 9ICA:배달후불-카드, 9ICM:배달후불-현금
            dlAddr : res.data.address,
            dlAddrDtl : res.data.addressDetail,
            ordrDesc : res.data.memoForStore,
            dlMnDesc : res.data.memoForDelivery,
            disposableUseFg : res.data.wantDisposal ? 1 : 0,
            orderCnct : res.data.memberPhoneNumber,
            dlLng : lng,
            dlLat : lat
        }

        API.completeOrder(param).then((res)=>{
            if(res.code === 1){
                console.log('completeOrder success', res)
                callSuccess(res.data)
            }else{
                dispatch({type : 'TOAST', payload : {show : true , data : {msg: res.msg, code : '', dispatch : dispatch} , callback : toastCallback}})
            }
        }).catch((err)=>{
            console.log('err',err)
            
        }).then(()=>{
            localStorage.removeItem('contentData')
        })

    },[])

    useEffect(()=>{

        console.log('addEventListener SDL_dispatchStartPermission')
        window.addEventListener('SDL_dispatchCallPayment',callbackForCallPayment,false)

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

            console.log('removeEventListener SDL_dispatchStartPermission')
            window.removeEventListener('SDL_dispatchCallPayment',callbackForCallPayment,false)
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
            memberPhoneNumber = refOrdererInfoSection.current.refPhoneNumberChangeBox.current.refCurrentPhoneNumber.current.value   
        }else{
            if(!isPickup(location)){
                nonMemberPhoneNumber = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refPhoneNumer.current.value
                isCertComplete = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refCertComplete
            }else{
                nonMemberPhoneNumber = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refPhoneNumer.current.value
                isCertComplete = refOrdererInfoSection.current.refMobilePhoneAuthentication.current.refCertComplete
            }
        }
         
         wantDisposal = refMemoSection.current.refCheckDisposal.current.checked
         memoForStore = refMemoSection.current.refMemoForStore.current.value

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
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '휴대폰 번호를 입력하세요', code : '', dispatch : dispatch} , callback : toastCallback}})
            // console.log('memberPhoneNumbermemberPhoneNumbermemberPhoneNumber')
            // refOrdererInfoSection.current.refPhoneNumberChangeBox.current.refCurrentPhoneNumber.current.focus()
            result.code = 0;
            result.data = {};
            return result;
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
                        {isPickup(location) && <StoreInfoSection dispatch={dispatch}/>}
                        <div className="sectionBlock"></div>
                        <OrdererInfoSection ref = {refOrdererInfoSection}/>
                        <div className="sectionBlock"></div>
                        <MemoSection ref={refMemoSection}/>
                        <div className="sectionBlock"></div>
                        <OderMenuSection isPickup={isPickup(location)}/>
                        <div className="sectionBlock"></div>
                        <OrderDiscountSection />
                        <div className="sectionBlock"></div>
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
    data.dispatch({type : 'TOAST', payload : {show : false }})
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

/////////////////////////// function

const HeaderSection = () => {

    let history = useHistory();
    let location = useLocation();

    const {data,dispatch} = useContext(SDLContext)
    const onClickBackBtn = useCallback(() => {
        if(data.terms.show){
            dispatch({type : 'TERMS', payload : {show : false }})
        }else{
            if(location.state.isFromCart) {
                history.goBack();
            }
            else {
                history.go(-2);
            }
        }
        
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
                <p className="descInfo">매장에 요청해요~</p>
                <div className="descInput">
                    <TextInputBox  
                        className = 'textInput'
                        placeholder="예) 얼음 조금만 넣어주세요." 
                        ref = {refTextInputBox}
                    />

                </div>
                <div className="descInput">
                    <label className="checkSelect">
                        <input type="checkbox" ref = {refCheckBox}/> <span className="dCheckBox">일회용품은 안 주셔도 됩니다~</span>
                        {/* <span className="checkInfo">일회용품은 안 주셔도 됩니다~</span> */}
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
                <p className="descInfo">라이더에게 요청해요~</p>
                <div className="descInput">
                    <TextInputBox  
                        className = 'textInput'
                        placeholder="예) 집 앞에 두고 가세요~" 
                        ref = {ref}
                    />
                </div>
            </div>
        </>
    )
})

const OderMenuSection = ( {isPickup} ) => {

    let location = useLocation();

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
        let dlPrc
        try{
            dlPrc = location.state.data.orderData.dlPrc
        }catch(err){
            dlPrc = '0'
        }
        return numberFormat(dlPrc)
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
                                <span className="amount">{numberFormat(menu.totalPrice)} 원</span>
                            </li>
                        )}

                        { !isPickup && 
                        <li>
                            <span className="name">
                                배달팁
                                {/* <button type="button" onClick={()=>{
                                    handleClickOpen({
                                        type : "DELIVERY",
                                    })
                                }}>
                                    <span className="icon questionMark">?</span>
                                </button> */}
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
                        {/* {orderInfo.discounts.map((discount)=>

                            <li key={discount.discountName}>
                                <span className="name">{discount.discountName}</span>
                                <span className="amount">{discount.discountAmount}원</span>
                            </li>
                        )} */}
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
                        <li>
                            <span className="name">
                                할인금액
                            </span>
                            <span className="amount">
                                {discountPrice()} 원
                            </span>
                        </li>
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

            // let orderType = 0
            // let use2icpFg = 1
            // let use9icpFg = 1
            // let use9icaFg = 1
            // let use9icmFg = 1

    
            if(!isPickup(location)){
                if(Number(use9icpFg) === 1){
                    payStatus.prePay.enable = true
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
            }else if(code === '9ICA'){
                console.log(code)
                payStatus.prePay.className = ''
                payStatus.card.className = 'active'
                payStatus.cash.className = ''
            }else if(code === '9ICM'){
                console.log(code)
                payStatus.prePay.className = ''
                payStatus.card.className = ''
                payStatus.cash.className = 'active'
            }else if(code === '2ICP'){
                console.log(code)
                payStatus.prePay.className = ''
                payStatus.card.className = ''
                payStatus.cash.className = ''
                payStatus.pickPay.className = 'active' // setPayStatus({...payStatus,pickPay:{...payStatus.pickPay, className : 'active'}})
            }

            setPayStatus({...payStatus})
            refUl.current.dataset.pay = code

        }catch(err){}
    }

    return (
        <>
            <div className="rowSection">
                <div className="infoCard">
                    <h2 className="title">결제방법</h2>
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
                    매장으로 직접 방문해주세요~
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

    let location = useLocation();

    const payAmount = () => {
        let amount
        try{
            amount = location.state.data.orderData.payPrc
        }catch(err){
            amount = 0
        }
        return numberFormat(amount)
    }

    const btnClick = (e)=>{
        e.preventDefault()
        const res = checkVailidation()
        console.log('order form validate data', res)
        
        if(res.code === 1){

            localStorage.setItem('contentData', JSON.stringify(res))
            console.log('checkVailidation res',res)
            // 배달 후불(카드,결제)일 경우 결제 단계는 패쓰한다.

            if(res.data.payMethod === '9ICA' || res.data.payMethod === '9ICM'){
                window.dispatchEvent(new CustomEvent('SDL_dispatchCallPayment',{detail : {otc : ''}}))
            }else{
                localStorage.setItem('contentData', JSON.stringify(res))
                try{
                    const json = {
                        ordrId : location.state.data.orderData.ordrId,
                        partnerId : location.state.data.orderData.partnerId,
                        merchantCd : location.state.data.orderData.nonPgMerchantCd,
                        vanId : '000002',
                        partnerCd : location.state.data.orderData.nonPgPartnerCd,
                        payPrice : location.state.data.orderData.payPrc
                    }
                    AppBridge.SDL_dispatchCallPayment(json)
        
                }catch(err){
        
                }
            }
            
        }
    }

    return (
        
        <div className="fixedBtn flex3half1" >
            {/* <Link to = {{pathname:ACTION.LINK_ORDER_SUCCESS}} className="btn addOrder">{totalPayment}원 주문하기</Link> */}
            <a className="btn addOrder" onClick={btnClick}>{payAmount()} 원 결제하기</a>
        </div>
    )
        
};

export default OderFormContainer