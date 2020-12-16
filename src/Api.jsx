
import axios from 'axios'
import {objectToQueryString, getAccessId} from './util/Utils'
import { objectOf, any, arrayOf } from 'prop-types';

// 130: 개발기
// 116: 김부장님
// 91: 이사님

//URL
axios.defaults.baseURL = process.env.REACT_APP_SDL_API_DOMAIN + '/api/v1'
axios.defaults.headers['Pragma'] = 'no-cache';

let config = {
    withCredentials : true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept' : '*/*'
    }
}

//REAUEST
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('accessId');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});


//RESPONSE
axios.interceptors.response.use(function (res) {
    // console.log(res)
    return res
})


export async function getNewStores() {
    
    const response = await axios.get(
        'boards/new-stores', config
    );
    return response.data;
}

// 카테고리 조회
export async function getCatogories() {
    const url = 'stores-category'
    const response = await axios.get(
        url, config
    );
    return response.data;
}

// 카테고리 클릭시 혹은 음식, 가게이름 검색시 혹은 한개의 매장 정보 매장리스트 조회
export async function getStores(lat, lng, bizCtgGrp, value, ordrOpt, strId) {
    const params = {userLat : lat, userLng : lng, bizCtgGrp : bizCtgGrp, searchValue: value, ordrOpt : ordrOpt, strId: strId};
    const url = "search/stores?" + objectToQueryString(params) ;
    const response = await axios.get(
         url, config
    );
    return response.data;
}

// 고속도로 목록 조회
export async function getHighways() {
    const url = "highways?"

    const response = await axios.get(
        url, config
    )
    return response.data
}

// 휴게소 상점 목록 조회
export async function getRestAreas(lat, lng, exWayCd) {
    const params = {userLat : lat, userLng : lng, exWayCd : exWayCd};
    const url = 'rest-areas?' + objectToQueryString(params)
    const response = await axios.get(
        url, config
    )
    return response.data
}

// 휴게소 한개의 정보 조회
export async function getRestInfo(lat, lng, strId) {
    const params = {userLat : lat, userLng : lng, strId: strId};
    const url = 'rest-areas?' + objectToQueryString(params)
    
    const response = await axios.get(
        url, config
    )

    return response.data
}

// 휴게소 한개의 정보 조회
export async function getRestDetails(strId) {
    const url = 'rest-areas/' + strId + '/details'
    
    const response = await axios.get(
        url, config
    )

    return response.data
}

// 휴게소 메뉴 리스트 조회
export async function getRestMenus(strId, brdId) {
    const params = {brdId : brdId};
    const url = 'rest-areas/'+ strId + '/menus?' + objectToQueryString(params);

    const response = await axios.get(
        url, config
    )
    return response.data
}

// 휴게소 메뉴 옵션 리스트 조회
export async function getRestMenuOptions(strId, prdId) {
    
    const url = 'rest-areas?' + objectToQueryString({strId: strId})
                + '/menus/' + objectToQueryString({prdId: prdId}) + '/options'
    const response = await axios.get(
        url, config
    )
    return response.data
}

// ====================================================================================================
// 주변 매장 정보 조회
export async function getArround(lat, lng, code) {
    const params = {userLat: lat, userLng: lng, userHcd: code};
    const url = "search/stores?" + objectToQueryString(params);
    
    const response = await axios.get(
        url, config
    );
    return response.data;
}

// ====================================================================================================
// 로그인 관련

/* 
* 로그인
*/
export async function signIn(id, pass, keep, pushToken) {
    const url = 'members/login';
    let os = 'AN'
    if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dispatch){
        os = 'IO'
    }
    const response = await axios.post(
        url,
        {
            mbrId: id,
            mbrPwd: pass,
            isKeepLogin: keep,
            pshTkn : pushToken,
            dvcOsCd : os
        },
        config
    );
    return response.data
}

/**
 * 로그아웃
 */
export async function logOut() {
    const url = 'members/logout';
    const response = await axios.get(
        url,
        config
    );
    return response.data
}

/* 
* 비회원 등록
*/
export async function anonymous(appVersion,os,pushToken,adPushFlag){
    const url = 'users/anonymous';
    const response = await axios.post(
        url,
        {
            'fnlAppVer': appVersion,
            'dvcOsCd': os,
            'pshTkn' : pushToken,
            'adPushFg' : adPushFlag,
        },
        config
    );
    return response.data;
}

// my슬배생 =================================================================
// 회원 정보
export async function getMemberInfo() {

    const url = "members/details"

    const response = await axios.get(
        url, config
    )
    return response.data
}

/* 
* 로그인 유지 변경
*/
export async function keepLogin(isKeepLogin) {
    const url = 'members/keep-login'
    const response = await axios.patch(
        url,
        {
            isKeepLogin: isKeepLogin
        },
        config
    )
    return response.data
}

/* 푸시 알림 동의 변경 */
export async function agreePush(isAgree) {
    const url = 'users/push-alram'
    const response = await axios.patch(
        url,
        {
            adPushFg: isAgree
        },
        config
    )
    return response.data
}

/* 닉네임 변경 */
export async function changeNickname(mbrNick) {
    const url = 'members/nickname'
    const response = await axios.patch(
        url,
        {
            mbrNick: mbrNick
        },
        config
    )
    return response.data
}

/* 비밀번호 변경 */
export async function resetPwd(pwd, rePwd) {
    const url = 'members/password?'
    const response = await axios.patch(
        url,
        {
            mbrPwd: pwd,
            reMbrPwd: rePwd
        },
        config
    )

    return response.data
}

/* 비밀번호 변경 */
export async function nonMemResetPwd(mbrId, mbrCi, pwd, rePwd) {
    const url = 'members/nologin/password?'
    const response = await axios.patch(
        url,
        {
            mbrId: mbrId,
            mbrCi: mbrCi,
            mbrPwd: pwd,
            reMbrPwd: rePwd,
        },
        config
    )

    return response.data
}

/* 휴대폰 번호 인증 번호 요청 */
export async function getAuthCodebyPhone(phoneNm) {
    const url = 'members/cellphone/cert-num?'
    const response = await axios.post(
        url,
        {
            smsCertPhone: phoneNm
        },
        config
    )
    return response.data
}

/* 휴대폰 번호 변경 */
export async function resetPhNum(phoneNm, authCode) {
    const url = 'members/cellphone?'
    const response = await axios.patch(
        url,
        {
            smsCertPhone: phoneNm,
            certMsg: authCode
        },
        config
    )
    return response.data
}

/* FAQ */
export async function faqcategory() {
    const url = 'boards/faqs-category'
    const response = await axios.get(
        url, config
    )
    return response.data;
}
 
export async function faqs(offset, limit) {
    const params = {offset: offset, limit: limit}
    const url = 'boards/faqs?' + objectToQueryString(params)
    
    const response = await axios.get(
        url, config
    );
    return response.data;
}

// 공지사항 조회
export async function getNoticeList(offset, limit) {
    const params = {offset: offset, limit: limit};
    const url = "boards/notices?" + objectToQueryString(params)

    const response = await axios.get(
        url, config
    )
    return response.data
}

/* 로그인 유지/푸시 알림 동의 상태 */
export async function userSettings() {
    const url = 'users/setting'

    const response = await axios.get(
        url, config
    )
    return response.data
}

/* 회원 가입 */
// 아이디 중복 체크
export async function checkId(mbrId) {

    const url = 'members/check/id'
    const response = await axios.post(
        url,
        {
            mbrId: mbrId
        },
        config
    )
    return response.data
}

// 회원 가입
export async function register(mbrId, mbrPwd, reMbrPwd, mbrNick, 
    mbrNm, cnctNo, mbrCi, mbrBrth, gendCd, isKeepLogin) {
    
    const url = 'members'
    const response = await axios.post(
        url,
        {
            mbrId: mbrId,
            mbrPwd: mbrPwd,
            reMbrPwd: reMbrPwd,
            mbrNick: mbrNick,
            mbrNm: mbrNm,
            cnctNo: cnctNo,
            mbrCi: mbrCi,
            mbrBrth: mbrBrth,
            gendCd: gendCd,
            isKeepLogin: isKeepLogin
        },
        config
    )
    return response.data
}
///////// 회원 탈퇴
export async function unregister(mbrId) {
    // const params = {}
    // const url = 'members?' + objectToQueryString(params)
    const url = 'members'
    
    const response = await axios.patch(
        url,
        {
            mbrId: mbrId
        },
        config
    )
    return response.data
}

// ====================================================================================================
// 주문내역
export async function orderHistory(pastHistoryFg) {
    const url = 'users/orders/history?'
    var response

    if (pastHistoryFg == undefined)
        response = await axios.get(
            url, 
            config
        )
    // 과거 내역
    else response = await axios.get(
        url + objectToQueryString({pastHistoryFg: pastHistoryFg}),
        config
    )
    
    return response.data
}

// 과거 주문 내역 존재 여부
export async function pastOrderYN() {
    const url = 'users/orders/past-history'

    const response = await axios.get(
        url, config
    )
    return response.data
}

// 주문내역상세
export async function orderHistoryDetail(ordrId, storeCd) {
    
    const url = 'users/orders/history/details'
    
    const response = await axios.post(
        url,
        {
            ordrId: ordrId,
            storeCd: storeCd
        },
        config
    )
    return response.data
}

// 주문 취소
export async function cancelOrder(storeCd, ordrId) {
    const url = 'users/orders/cancel'

    const response = await axios.patch(
        url,
        {
            storeCd: storeCd,
            ordrId: ordrId
        },
        config
    )
    return response.data
}

// 영수증 조회
export async function receipt(storeCd, ordrId) {
    const url = 'users/orders/receipt'

    const response = await axios.post(
        url,
        {
            storeCd: storeCd,
            ordrId: ordrId
        },        
        config
    )
    return response.data
}

// ====================================================================================================
// 매장 메뉴 목록
export async function getStoresMenusList(strId, brdId) {
    const params = {brdId : brdId};
    const url = "stores/" + strId + "/menus?" + objectToQueryString(params);
    
    const response = await axios.get(
        url, config
    );
    return response.data;
}

// 매장 메뉴 옵션 목록
export async function getStoresMenusListOptions(strId, prdId) {
    const params = {strId: strId, prdId: prdId};
    const url = "stores/" + strId + "/menus/" + prdId + "/options";
    
    const response = await axios.get(
        url, config
    );
    return response.data;
}

//// 찜
// 매장 찜 등록
export async function storeDipAdd(storeCd, strId) {
    const params = {}
    const url = 'users/dips/stores?' + objectToQueryString(params)

    const response = await axios.post(
        url,
        {
            storeCd: storeCd,
            strId: strId
        },
        config
    )
    return response.data;
}

// 매장 찜 삭제
export async function storeDipdel(storeCd, strId) {
    const params = {}
    const url = 'users/dips/stores?' + objectToQueryString(params)

    const response = await axios.patch(
        url,
        {
            storeCd: storeCd,
            strId: strId
        },
        config
    )
    return response.data;
}

// 메뉴 찜 등록
export async function menuDipAdd(strId, storeCd, prdId, brdId) {
    const params = {}
    const url = 'users/dips/menus?' + objectToQueryString(params)

    const response = await axios.post(
        url,
        {
            strId: strId,
            storeCd: storeCd,
            prdId: prdId,
            brdId: brdId
        },
        config
    )
    return response.data;
}

// 메뉴 찜 삭제
export async function menuDipdel(strId, storeCd, prdId) {
    const params = {}
    const url = 'users/dips/menus?' + objectToQueryString(params)

    const response = await axios.patch(
        url,
        {
            strId: strId,
            storeCd: storeCd,
            prdId: prdId
        },
        config
    )
    return response.data;
}

// 찜한 매장 조회
export async function getJjimStore(lat, lng) {
    const params = {userLat : lat, userLng : lng, myDipYn: "Y"};
    const url = "search/stores?" + objectToQueryString(params)

    const response = await axios.get(
        url, config
    )
    return response.data
}

// 찜한 휴게소 매장 조회
export async function getJjimRest(lat, lng) {
    const params = {userLat : lat, userLng : lng, myDipYn: "Y"};
    const url = "rest-areas?" + objectToQueryString(params)

    const response = await axios.get(
        url, config
    )
    return response.data
}

// 찜한 메뉴 조회
export async function getJjimMenu(lat, lng) {
    const params = {userLat : lat, userLng : lng};
    const url = "users/dips/menus?" + objectToQueryString(params)

    const response = await axios.get(
        url, config
    )
    return response.data
}

// 리뷰 등록
export async function postMemberReview(ordrId, rvwPoint, rvwMsg, files) {
    
    const url = 'members/reviews?'
    const formData = new FormData()
    console.log(files)

    formData.append('ordrId', ordrId)
    formData.append('rvwPoint', rvwPoint)
    formData.append('rvwMsg', rvwMsg)
    formData.append('files', files)

    const response = await axios.post(
        url,
        formData,
        config
    )

    return response.data
}

// 리뷰 조회
export async function getMemberReview(offet, limit) {
    const url = 'members/reviews?' + objectToQueryString({offset: 0, limit: 1000})
    const response = await axios.get(
        url, config
    )
    return response.data
}

// 리뷰 삭제
export async function deleteMemberReview(rvwId) {
    const url = 'members/reviews'
    const response = await axios.patch(
        url,
        {
            rvwId: rvwId
        },
        config
    )
    return response.data
}

// 매장 리뷰 조회
export async function getStoreReview(strId, photoOnly) {
    const url = 'stores/'+ strId + '/reviews?' + objectToQueryString({photoOnly: photoOnly})
    const response = await axios.get(
        url, config
    )
    return response.data
}

/* 
* 로그인
*/
export async function createOrder(order) {

    console.log('createOrdercreateOrdercreateOrdercreateOrder ' ,order)
    const url = 'users/orders';

    const response = await axios.post(
        url,
        JSON.stringify(order),
        config
    );
    console.log('createOrder',response.data)
    return response.data
}

// 한개의 매장 상세정보
export async function getStoreInfoDetail(strId) {
    const url = "stores/" + strId + "/details?"

    const response = await axios.get(
        url, config
    )
    return response.data
}

/* 
* 결재 완료 후 오더 주문
*/
export async function completeOrder(order) {

    const url = 'users/orders'

    const response = await axios.patch(
        url,
        order,
        config
    );
    console.log('completeOrder',response.data)
    return response.data
}

/* 
* 비회원 주문 휴대폰번호 인증번호 요청
*/
export async function certPhoneNumber(phoneNumber) {

    const url = 'users/orders/cellphone/cert-num'

    const response = await axios.post(
        url,
        {
            smsCertPhone: phoneNumber
        },
        config
    );
    console.log('certPhoneNumber',response.data)
    return response.data
}

/* 
* 비회원 주문 휴대폰번호 인증번호 요청
*/
export async function verifyCertNumber(phoneNumber, certNumber) {

    const url = 'users/orders/cellphone/confirm'

    const response = await axios.post(
        url,
        {
            smsCertPhone: phoneNumber,
            certMsg : certNumber
        },
        config
    );
    console.log('completeOrder',response.data)
    return response.data
}

/* 
* 푸시 업데이트
*/
export async function upDatePushToken(pushToken, os) {

    const url = 'users/push-token'

    const response = await axios.patch(
        url,
        {
            pshTkn: pushToken,
            dvcOsCd : os
        },
        config
    );
    console.log('upDatePushToken',response.data)
    return response.data
}

/* 
* 제로페이 정보 가져오기
*/
export async function checkZeropayAuth() {

    const url = 'zeropay/join?apiUrl='+ process.env.REACT_APP_SDL_API_DOMAIN

    const response = await axios.get(
        url,
        config
    );
    console.log('checkZeropayAuth',response.data)
    return response.data
}

/* 
* 체크페이 회원 정보 조회
*/
export async function getCheckPayInfo(queryString) {

    const url = 'CPIF_AFFL_550.jct?'+queryString
    const config = {
        baseURL : 'https://dev.checkpay.co.kr/',
    }
    const response = await axios.get(
        url,
        config
    );
    console.log('checkZeropayAuth',response.data)
    return response.data
}



/* 
* 사용자 가입 상태
*
*   응답
*   isSdlMember         //슬배생 회원 1, 비회원 0
*   isCheckPayMember   //체크페이 회원 1, 비회원 0
*   isZeroPayMember    //제로페이 회원 1, 비회원 0
*
*/
export async function getUserJoinStatus(queryString) {

    const url = 'users/join/status'

    const response = await axios.get(
        url,
        config
    );
    console.log('getUserJoinStatus response',response.data)
    return response.data
}

/**
 * 체크페이 회원가입 화면 진입 정보 가져오기
 * @param {api 주소} apiUrl 
 * 
 *   응답
 *   ID      
 *   RQ_DTIME
 *   TNO      
 *   EM      
 *   VM      
 *   EV_KT   
 *   VV_KT   
 *   EV_APP   
 *   VV_APP 
 */
export async function getDataForCheckpayjoin(apiUrl) {

    const url = 'checkpay/send/join'

    const response = await axios.post(
        url,
        {
            apiUrl : apiUrl 
        },
        config
    );
    console.log('getDataForCheckpayjoin response',response.data)
    return response.data
}

/**
 * 제로페이 메인 화면 진입 정보 가져오기
 * @param {api 주소} apiUrl 
 * 
 *   응답
 *   ID      
 *   RQ_DTIME
 *   TNO      
 *   EM      
 *   VM      
 *   EV_KT   
 *   VV_KT   
 *   EV_APP   
 *   VV_APP 
 */
export async function getDataForZeropayMain() {

    const url = 'zeropay/send/main'

    const response = await axios.get(
        url,
        config
    );
    console.log('getDataForZeropayMain response',response.data)
    return response.data
}

/**
 * 제로페이 메인 화면 진입 정보 가져오기
 * @param {}  
 * 
 * 응답
 * saleChannel   
 * unm         
 * mobile      
 * ci         
 * birthDate   
 * sexCode   
 * VV_APP 
 */
export async function getDataForZeropayJoin() {

    const url = 'zeropay/send/join'

    const response = await axios.get(
        url,
        config
    );
    console.log('getDataForZeropayJoin response',response.data)
    return response.data
}

/** 
* 제로페이 잔액 조회
*
*
* */
export async function getZeroPayBalance() {
    const url = 'zeropay/send/balance'
    const response = await axios.get(
        url,
        config
    )

    return response.data
}


/** 
* 제로페이 회원탈퇴
*
*
* */
export async function unregisterZeroPay() {
    const url = 'zeropay/send/withdrawal'
    const response = await axios.get(
        url,
        config
    )
    return response.data
}

/**
 * 휴게소 정보 조회(지오펜싱)
 */
export async function getAllRestArea() {
    const url = 'all-rest-areas'
    const response = await axios.get(
        url,
        config
    )
    return response.data
}

/**
 * 채널 정보 검증 조회(지오펜싱)
 */
export async function getChannelVaild(chnlValid) {
    const url = 'channel/valid'
    const response = await axios.post(
        url,
        {
            chnlValid : chnlValid 
        },
        config
    )
    return response.data
}

export async function getOrdersVerify(storeCd,userLng,userLat,userHjd,ordrKindCd,ordrId,pgCd) {

    const url = 'users/orders/verify'

    const response = await axios.post(
        url,
        {
            storeCd : storeCd,
            userLng : userLng,
            userLat : userLat,
            userHjd : userHjd,
            ordrKindCd : ordrKindCd,
            ordrId : ordrId,
            pgCd : pgCd,

        },
        config
    );
    console.log('getOrdersVerify response',response.data)
    return response.data
}


 /**
  * 위치정보 취득 서버 저장
  * @param {*} acqstPath 취득 경로
  * @param {*} svrcInfo 서비스 내용
  */
export async function setGpsHistory(acqstPath,svcInfo) {
    const url = 'users/gps-history'
    const response = await axios.post(
        url,
        {
            acqstPath : acqstPath,
            svcInfo : svcInfo
        },
        config
    )
    return response.data
}

/**
 * 채널사 정보 조회 해오기
 */
export async function getChannelInfo() {
    const url = 'channel/info'
    const response = await axios.get(
        url,
        config
    )
    return response.data
}