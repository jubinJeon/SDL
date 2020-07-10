/** *
 * object to query string
 * @param object
 * @returns {string}
 * @example
 *  {
 *    k1: 2,
 *    k2: 3
 *  } -> k1=2&k2=3
 */
export const objectToQueryString = (obj) => Object.entries(obj)
  .map(([k, v]) => `${k}=${v}`)
  .join('&')

export const  getQueryStringParams = query => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    return params;
                }, {}
            )
        : {}
};

export const decimalToMeterFormat = (decimal) => {
  const dist = Math.round(decimal * 1000)
  if(dist > 999) return (dist/1000).toFixed(1) + 'km'
  else return dist+'m'
}

/**
 * 최초 앱 실행시 권한 알림 여부 정보를 가져온다.
 */
export const didNoticeAppPermision = () => {
  const result = localStorage.getItem('didNoticeAppPermision')
   return result === null ? false : true;
}

/**
 * 권한 알림 여부 정보를 설정한다.
 */
export const setDidNoticeAppPermision = () => {
  localStorage.setItem('didNoticeAppPermision','true')
}

/**
 * 로컬스토리지에서 accessId값을 반환한다.
 */
export const getAccessId = () => {
   const result = localStorage.getItem('accessId')
   return result === null ? '' : 'Bearer ' + result;
}

/**
 * 로컬스토리지에 accessId 저장 여부
 */
export const hasAccessId = () => {
  return getAccessId() !== '' 
}

/**
 * accessId 를 로컬스토리지에 저장한다.
 * @param {*} value 
 */
export const setAccessId = (value) => {
  localStorage.setItem('accessId', value);
}

/**
 * 최근 검색어를 로컬스토리지에서 가져와서
 * json 객체로 변환 후 반환한다.
 */
export const getRecentSearch = () => {
  const data = localStorage.getItem('recentSearch');
  return data === null ? [] : JSON.parse(data);
}

/**
 * 최근 검색어를 저장한다.
 * @param {*} search 
 */
export const setRecentSearch = (search) => {
  const data = getRecentSearch();
  if(!data.includes(search)){
    const result = getRecentSearch().concat([search]);
    console.log('pushRecentSearch', result);
    localStorage.setItem('recentSearch', JSON.stringify(result));
  }
}

/**
 * 최근 검색어를 모두 삭제한다.
 */
export const removeAllRecentSearch = () => {
  const result = []
  console.log('removeRecentSearch', result);
  localStorage.setItem('recentSearch', JSON.stringify(result));
}

/**
 * 사용자가 지정한 최근 검색어를 삭제한다.
 * @param {*}} search 
 */
export const removeRecentSearch = (search) => {
  const data = getRecentSearch();
  const result = data.filter( item => item !== search)
  console.log('removeRecentSearch', result);
  localStorage.setItem('recentSearch', JSON.stringify(result));
}

/**
 * 사용자 최근 위치정보를 저장한다.
 * 
 * data = (address : '주소명', lat : 12.4567, lan: 34.4523423)
 * @param {*} data 
 */
export const pushDefaultAddress = (data) => {
  localStorage.setItem('defaultAddress', JSON.stringify(data));
}

export const pullDefaultAddress = () => {

  const data = localStorage.getItem('defaultAddress');
  return data === null ? {} : JSON.parse(data);
}

/**
 * 주소검색정보를 가져온다.
 */
export const pullSearchAddress = ()=>{
  const data = localStorage.getItem('searchAddress');
  return data === null ? [] : JSON.parse(data);
}

/**
 * 주소검색정보를 저장한다.
 * @param {*} item 
 */
export const pushSearchAddress = (item) => {
  const storedSearchAddress = pullSearchAddress();
  console.log('pushSearchAddress storedSearchAddress', storedSearchAddress)

  item.key = new Date().getTime()

  if(storedSearchAddress.length === 0){
    const searchAddress = [...storedSearchAddress,item]
    console.log('pushSearchAddress searchAddress', searchAddress)
    localStorage.setItem('searchAddress', JSON.stringify(searchAddress));
  }else{
    const index = storedSearchAddress.findIndex((address)=>{
      return item.address_name === address.address_name && item.address_detail === address.address_detail
    })
    console.log('pushSearchAddress index', index)
    if(index === -1){
      const searchAddress = [...storedSearchAddress,item]
      console.log('pushSearchAddress searchAddress', searchAddress)
      localStorage.setItem('searchAddress', JSON.stringify(searchAddress));
    }
  }
}

/**
 * 주소 검색 정보를 삭제한다.
 * key : addressName
 * @param {*} key 
 */
export const removeSearchAddress = (key) => {
  const storeSearchdAddress = pullSearchAddress()

  if(storeSearchdAddress.length !== 0){
    const index = storeSearchdAddress.findIndex((item)=>{
      return item.key === key
    })
    console.log('deleteSearchAddress index', index)
    if (index > -1) storeSearchdAddress.splice(index, 1)
    localStorage.setItem('searchAddress',JSON.stringify(storeSearchdAddress))
  }
}

export const getOS = () => {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

/**
 * 로컬스토리지에 장바구니 아이템을 반환한다.
 */
export const pullCartData = () => {

  const data = localStorage.getItem('cart');
  return data ? JSON.parse(data) : {};
}

/**
 * 로컬스토리지에 장바구니 아이템을 추가하다. 
 * @param {*} newData 
 */
export const pushCartData = (newData) => {

  const storedData = pullCartData()

  if(Object.keys(storedData).length === 0){
    localStorage.setItem('cart',JSON.stringify(newData))
  }else{
    const newMenu = newData.menus[0]
   
    for(let i = 0; i < storedData.menus.length; i++) {
      if(storedData.menus[i].prdId === newMenu.prdId && JSON.stringify(storedData.menus[i].option.sort()) === JSON.stringify(newMenu.option.sort())) {
        storedData.menus[i].count += 1
        localStorage.removeItem('cart')
        localStorage.setItem('cart', JSON.stringify(storedData))
        return
      }
    }
    
    storedData.menus = [...storedData.menus, newMenu]
    localStorage.setItem('cart', JSON.stringify(storedData))
  }
}

/**
 * 장바구니 아이템을 삭제한다.
 * @param {*} key 
 */
export const removeCartData = (key)=>{

  const storedData = pullCartData()

  if(Object.keys(storedData).length !== 0){
    const index = storedData.menus.findIndex((item)=>{
      return item.key === key
    })
    console.log('deleteCartData index', index)
    if (index > -1) storedData.menus.splice(index, 1)
    localStorage.setItem('cart',JSON.stringify(storedData))
  }
}

/**
 * 로컬스토리지에 장바구니 정보를 삭제한다.
 */
export const removeCartDataAll = () => {
  localStorage.removeItem('cart')
}

/**
 * 로컬스토리지에 장바구니 아이템갯수를 반환한다. 
 */
export const getCartCnt = () => {

  const storedData = pullCartData()

  if(Object.keys(storedData).length === 0){
    return 0
  } else{
    return storedData.menus.length
  }
}

/**
 * 로컬스토리지에 장바구니 orderType 을 변환한다. 
 */
export const changeOrderType = (type) => {
  const storedData = pullCartData()
  if(Object.keys(storedData).length > 0){
    storedData.orderType = type
    removeCartDataAll()
    pushCartData(storedData)
  }
}

/**
 * 로컬스토리지에 장바구니 Toast Message On/Off 를 변환한다. 
 */
export const changeShowToast = (onoff) => {
  const storedData = pullCartData()
  storedData.showToast = onoff
  removeCartDataAll()
  pushCartData(storedData)
}

/**
 * 로컬스토리지에서 소개화면 상태값을 반환한다.
 */
export const pullIntroStatus = () => {
  const introStatus = localStorage.getItem('introStatus')
  if(!introStatus){
      return {
          noMore : false,
          noToday : false,
          visitTime : 0
      }
  }else{
      return JSON.parse(introStatus)
  }
}

/**
 * 로컬스토리지에 소개화면 상태값을 저장한다.
 * {
      noMore : false, // 더이상 보지 않기
      noToday : false, // 오늘 그만 보기
      visitTime : 0 // 오늘 그만 보기 선택한 시간
    }
 * @param {*} introStatus 
 */
export const pushIntroStatus = (introStatus) => {
  localStorage.setItem('introStatus',JSON.stringify(introStatus))
}

/**
 * 로컬스토리지에서 현재 보고있는 위치를 저장한다.
 */
export const pushShowScreen = (screenData) => {
  
  const getScreenData = pullShowScreen();

  if(Object.keys(getScreenData).length === 0){
    localStorage.setItem('screen', JSON.stringify(screenData))
  }
  else {
    if(getScreenData !== screenData) {
      localStorage.setItem('screen', JSON.stringify(screenData))
    }
  }
}

/**
 * 로컬스토리지에 현재 보고있는 위치를 반환한다.
 */
export const pullShowScreen = () => {
  const data = localStorage.getItem('screen');
  return data === null ? [] : JSON.parse(data);
}

/**
 * 로컬스토리지에 현재 보고있는 위치를 삭제한다.
 */
export const removeShowScreenDataAll = () => {
  localStorage.removeItem('screen')
}








/**
 * 특수 문자 치환 함수
 * @param {*} str 
 */
export const unescapehtmlcode = (str) => {

  if(str === null || str === undefined) return ""

  return str.replace("&amp;", "&").replace("&#35;", "#")
  .replace("&lt;", "<").replace("&gt;", ">")
  .replace("&quot;", /"/g).replace("&#39;", '\\')
  .replace("&#37;", '%').replace("&#40;", '(').replace("&#41;", ')')
  .replace("&#43;", '+').replace("&#47;", '/').replace("&#46;", '.');
}

/**
 * 천단위 콤마 구분 함수
 * @param {*} number 
 */
export const numberFormat = (number) => {
  return Number(number === 0 || number === undefined) ? 0 : Number(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 시:분 으로 Format
 * @param {*} number 
 */
export const tmFormat = (number) => {
  return number === 0 || number === undefined ? 0 : number.substring(0,2) + ":" + number.substring(2,4);
}

export const makeParamForCreateOrder = (cartData,addressData) => {
    
  // 총 가격 구하기
  let totalAmount = 0;
  cartData.menus.forEach((menu)=>{
      totalAmount += menu.totalPrice * menu.count
  })

  const prdInfo = cartData.menus.map((menu)=>{
      const foo = {prdId : menu.prdId , count : menu.count, option : []}

      menu.option.map((opt)=>{
        opt.value.map((real) => {
          foo.option.push({optPrdId : real.optPrdId}) 
        })
      })
      
      return foo
  })
  
  const param = {
      userHjd : addressData.address.h_code,
      userLng : addressData.x,
      userLat : addressData.y,
      ordrKindCd : cartData.orderType === 0 ? '9ICP' : '2ICP',
      storeCd : cartData.bizCtgDtl === Number(19) ? 'R' : 'S', //bizCtgDtl 19 인 경우 휴게소 그 외는 상점
      ordrPrc : totalAmount,
      strId : cartData.strId,
      prdInfo : prdInfo
  }

  return param
}

/**
 * 푸쉬토큰값을 저장한다.
 * @param {} token 
 */
export const pushPushToken = (token) => {
  localStorage.setItem('pushToken',token)
}

/**
 * 푸시토큰값을 가져온다.
 */
export const pullPushToken = () => {
  return localStorage.getItem('pushToken')
}

