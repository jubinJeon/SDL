import React, { useEffect, useState, useContext } from 'react';
import { Route, Switch, Redirect, useLocation , useHistory} from 'react-router-dom';
import { pullIntroStatus, didNoticeAppPermision, hasAccessId ,pushShowScreen, setAccessId, removeCartDataAll, getQueryStringParams, getOS} from './util/Utils'
import * as API from './Api' 

// page/화면이름/ddd/index
// page/화면이름/index

import Home from './page/home/index'
import Search from './page/search/index'
import AddressSetting from './page/address/index'
import AddressSetting_map from './page/address/AddressSetting_map'

import AroundMap from './page/map/index'

import Cart from './page/cart/index'

import MyJjim from './page/jjim/index'
import ZeroPay from './page/zeropay/index'

import * as ACTION from './common/ActionTypes'
import BusinessInfo from './page/about/index'
import ServiceTerms from './page/terms/index'
import StoreList from './page/store/list/index'

import StoreDetail from './page/store/detail/index'
import StoreDetailMap from './page/store/detail/map'
import MenuComponent from './page/store/menu/index'

import OrderForm from './page/order/form/index'
import OrderSuccess from './page/order/inform/index'
import OrderHistory from './page/order/history/index'
import OrderDetail from './page/order/detail/index'
import Receipt from './page/order/detail/receipt'

import Review from './page/reviewHistory/index'
import ReviewImg from './page/reviewHistory/imageView'
import MakeReview from './page/makeReview/index'

import Mypage from './page/mysdl/index'
import MyInfo from './page/myInfo/MyInfo'
import PwdReset from './page/myInfo/PwdReset'
import Unresister from './page/myInfo/Unregister'
import ResetHP from './page/myInfo/ResetHP'

import Setting from './page/settings/index'

import NoticeList from './page/notice/list/index'
import NoticeDetail from './page/notice/detail/index'
import FAQ from './page/faq/index'
import CS from './page/service/index'

import Login from './page/signin/index'
import forgotId from './page/forgotId/index'
import forgotPw from './page/forgotPw/index'

import Agree from './page/signup/1_agree/index'
import Verify from './page/signup/2_join/index'
import Inform from './page/signup/inform/index'
import Form from './page/signup/a_form/index'
import Nickname from './page/signup/b2_nickname/index'

import AppAgree from './page/agree_app/index'
import PermissionAgree from './page/agree_permission/index'


import BannerList from './page/banner/list/index'
import BannerDetail from './page/banner/detail/index'

import Introduce from './components/Introduce'
import Applink from './AppLink'

import Error404 from './components/Error404.jsx';

import SDLRoute from './SDLRoute';

import {SDLContext} from './context/SDLStore'
import {REDUCER_ACTION} from './context/SDLReducer'


export default ({location,history}) => {

  return (
    <>
      <Switch location={location}>
          
            <Route exact path = {ACTION.LINK_APP_LINK} component={Applink} />
            <PrivateRoute exact path={ACTION.LINK_SDL_DEFAULT}  />
            <SDLRoute exact path={ACTION.LINK_HOME} component={Home} />
            <SDLRoute exact path={ACTION.LINK_INTRO} component={Introduce}/>  
            <SDLRoute exact path={ACTION.LINK_ADDRESS_SETTING} component={AddressSetting} />
            <SDLRoute path={ACTION.LINK_ADDRESS_SETTING_MAP} component={AddressSetting_map} />        
            <SDLRoute path={ACTION.LINK_SEARCH} component={Search} />
            <SDLRoute path={ACTION.LINK_ZERO_PAY} component={ZeroPay} />

            {/* 매장 */}
            <SDLRoute exact path={ACTION.LINK_MARKET} component={StoreList} />
            <SDLRoute path={ACTION.LINK_MARKET_DETAIL_MAP} component={StoreDetailMap} />
            <SDLRoute exact path={ACTION.LINK_MARKET_DETAIL+':id'} component={StoreDetail} />
            <SDLRoute path={ACTION.LINK_ORDER_MENU} component= {MenuComponent}/>

            {/* 장바구니 */}
            <SDLRoute exact path={ACTION.LINK_CART} component={Cart} />

            {/* 주변 지도 */}
            <SDLRoute path={ACTION.LINK_AROUND_MAP} component={AroundMap} />
            
            {/* my 슬배생 */}
            <SDLRoute exact path={ACTION.LINK_MY_SDL} component={Mypage} />
            <SDLRoute path={ACTION.LINK_MYINFO} component={MyInfo} />
            <SDLRoute path={ACTION.LINK_PWD_RESET} component={PwdReset} />
            <SDLRoute path={ACTION.LINK_UNREGISTER} component={Unresister} />
            <SDLRoute path={ACTION.LINK_HP_RESET} component={ResetHP} />

            <SDLRoute path={ACTION.LINK_SETTING} component={Setting} />
            <SDLRoute path={ACTION.LINK_REVIEW} component={Review} />
            <SDLRoute path={ACTION.LINK_REVIEW_IMG} component={ReviewImg} />
            <SDLRoute path={ACTION.LINK_MAKE_REVIEW} component={MakeReview} />
            
            <SDLRoute exact path={ACTION.LINK_NOTICE_LIST} component={NoticeList} />
            <SDLRoute path={ACTION.LINK_NOTICE_DETAIL+':index'} component={NoticeDetail} />
            <SDLRoute path={ACTION.LINK_FAQ} component={FAQ} />
            <SDLRoute path={ACTION.LINK_CS} component={CS} />

            {/* 주문 관련 */}
            <SDLRoute exact path={ACTION.LINK_ORDER_FORM} component={OrderForm} />
            <SDLRoute path={ACTION.LINK_ORDER_SUCCESS} component={OrderSuccess} />
            <SDLRoute path={ACTION.LINK_ORDER_HISTORY} component={OrderHistory} />
            <SDLRoute path={ACTION.LINK_ORDER_DETAIL} component={OrderDetail} />
            <SDLRoute path={ACTION.LINK_ORDER_RECEIPT} component={Receipt} />

            {/* 마이찜 */}
            <SDLRoute path={ACTION.LINK_MY_JJIM} component={MyJjim} />
            

            <SDLRoute path={ACTION.LINK_BUSINESS_INFO} component={BusinessInfo} />

            {/* 로그인 관련 */}
            <SDLRoute path={ACTION.LINK_LOGIN} component={Login} />
            <SDLRoute path={ACTION.LINK_FORGOT_ID} component={forgotId} />
            <SDLRoute path={ACTION.LINK_FORGOT_PW} component={forgotPw} />

            {/* 회원가입 */}
            <SDLRoute path={ACTION.LINK_SIGNUP_AGREE} exact component={Agree} />
            <SDLRoute path={ACTION.LINK_SIGNUP_VERIFY} exact component={Verify} />
            <SDLRoute path={ACTION.LINK_SIGNUP_FORM} exact component={Form} />
            <SDLRoute path={ACTION.LINK_SIGNUP_DUP} exact component={Inform} />
            <SDLRoute path={ACTION.LINK_SIGNUP_NICKNAME} exact component={Nickname} />

            {/* etc */}
            <SDLRoute path={ACTION.LINK_SERVICE_TERMS} component={ServiceTerms} />
            
            {/* 동의관련 */}
            <SDLRoute exact path={ACTION.LINK_AGREE_APP} component={AppAgree} />
            <SDLRoute exact path={ACTION.LINK_AGREE_PERMISSION} component={PermissionAgree} />

            {/* 배너  */}
            <SDLRoute exact path={ACTION.LINK_BANNER_LIST} component={BannerList} />
            <SDLRoute exact path={ACTION.LINK_BANNER_DETAIL} component={BannerDetail} />

          
            {/* ERROR */}
            <SDLRoute component={Error404} />
          
      </Switch>
    </>
  )
}

const Channel = () => {

  console.log("-------------------")
  const history = useHistory();
  const location = useLocation();
  const {dispatch} = useContext(SDLContext)

  useEffect(()=>{
    API.getChannelVaild(location.hash.substring(1,location.hash.length))
    .then((res)=>{

      console.log(res.data)
      
      const accessId = res.data.accessId
      const bizCtgGrp = res.data.bizCtgGrp
      const chnlScrn = res.data.chnlScrn
      const chnlStrId = res.data.chnlStrId
      const storeCd = res.data.storeCd
      const chnlCd = res.data.chnlId
      const bizCtgShowYn = res.data.bizCtgShowYn

      let channelUIType = 'B'

      if (chnlScrn === 'SCR01'){
        if(bizCtgShowYn === 'N')
          channelUIType = 'D'
      }else if (chnlScrn === 'SCR02'){
        channelUIType = 'C'
      }

      dispatch({type : REDUCER_ACTION.CREATE_CHANNEL_DATA, payload : {channelCode : chnlCd , agent : getOS(), channelUIType : channelUIType}})

      setAccessId(accessId)

      pushShowScreen({
        bizCtgGrp : bizCtgGrp
      })

      removeCartDataAll()

      if(chnlScrn === 'SCR01'){ // 목록
        history.replace({pathname: ACTION.LINK_MARKET})
      }else if(chnlScrn === 'SCR02'){ // 상점상세
        history.replace({pathname:ACTION.LINK_MARKET_DETAIL+`${chnlStrId}`,
        state: {
            strId : chnlStrId,
            storeCd : storeCd
        }})
      }else if(chnlScrn === 'SCR03'){ // 주문내역
        history.replace({pathname: ACTION.LINK_ORDER_HISTORY})
      }else if(chnlScrn === 'SCR04'){ // 리뷰
        history.replace( ACTION.LINK_REVIEW)
      }else if(chnlScrn === 'SCR05'){ // 찜
        history.replace( ACTION.LINK_MY_JJIM)
      }else if(chnlScrn === 'SCR06'){ // 검색
        history.replace( ACTION.LINK_SEARCH)
      }

    })
    .catch(()=>{

    })
  },[])
  
  return (
    <>
    </>
  )

}

function PrivateRoute({...rest }) {

  const {dispatch,data} = useContext(SDLContext)
  const location = useLocation();
  console.log(location)
  const param = getQueryStringParams(location.search)

  // applink 경로가 생기면 아래 분기문은 삭제해도됨
  if ('applink' in param){

    return (
      <Route {...rest} 
        render={() => <Redirect to={{ pathname: ACTION.LINK_APP_LINK, search : location.search}} />}
      />
    )
  }

  const noticeYN = didNoticeAppPermision()
  const getHasAccessId = hasAccessId()

  let showIntro = false;
  const introStatus = pullIntroStatus();

  console.log(location)
  
  if(location.hash){

      return (
        <>
          <Channel/>
        </>
      )
  }else{
    console.log("normal")
    console.log('data' , introStatus)

    if(introStatus.noMore === true){
        console.log('noMore!!!')
        showIntro = false
    }else{
        // 오늘 그만 보기 한 시간과 현재 시간에서 년월일 이 다르면 오늘 그만 보기는 false로 설정한다.
        const visitTime = introStatus.visitTime;
        const today = new Date();

        if(visitTime !== today.getFullYear() + today.getMonth() + today.getDate()){
          introStatus.noToday = false
        }
        
        if(introStatus.noToday === true){
            showIntro = false
        }else{
            showIntro = true
        }
    }

    console.log('location',location.search)
    const query = getQueryStringParams(location.search)



    const toScreen = (toScreen) => {
      data.toScreen = toScreen
      data.mainLocation = location

      if(toScreen === 'MAIN'){
        return <Redirect to={{ pathname: ACTION.LINK_HOME, state: { from: location }}} />
      }else if(toScreen === 'ORDER_HISTORY'){
        return <Redirect to={{ pathname: ACTION.LINK_ORDER_HISTORY}} />
      }else if(toScreen === 'STORE'){
        return <Redirect to={{ pathname: ACTION.LINK_MARKET_DETAIL+`${query.strId}`, state: { from: location, strId : query.strId, storeCd : query.storeCd }}} />
      }else{
        data.toScreen = 'MAIN'
        return <Redirect to={{ pathname: ACTION.LINK_HOME, state: { from: location }}} />
      }
    }

    return ( 
      
      <Route {...rest} 
        render={({ location }) =>

          location.hash ? 
          (<Channel/>)
          :
          (
            noticeYN ? 
              (
                getHasAccessId ? 
                  showIntro ? 
                    ( 
                      <Redirect to={{ pathname: ACTION.LINK_INTRO, state: { from:location }}} /> 
                    )  
                    : 
                    toScreen(query.toScreen)
                : 
                ( 
                  <Redirect to={{ pathname: ACTION.LINK_AGREE_APP, state: { from: location }}} /> 
                )
              )
            : 
            (
              <Redirect to={{ pathname: ACTION.LINK_AGREE_PERMISSION, state: { from: location }}} /> 
            )
          )
        }
      />
    )
  }

     
  }

