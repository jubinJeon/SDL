import React from 'react';

import Swiper from 'react-id-swiper';

import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import { numberFormat, unescapehtmlcode } from '../../../util/Utils'

// Version >= 2.4.0
import 'swiper/css/swiper.css';

const MainMenuSwiper = (props) => {
  
    const params = {
        slidesPerView: 2.35,
        freeMode: true,
        centeredSlides: false,
        spaceBetween: 10,
        initialSlide:0,
    }

    let mainMenu = props.mainMenu.filter(it => new RegExp('대표메뉴', "i").test(it.ctgNm))

    if(mainMenu.length <= 0) return null

    const menuActive = (e) =>{
        e.currentTarget.parentNode.classList.toggle("hide")
    }
    return (
        <li id="menu_01">{/*  <!-- 메뉴 href 와 ID 값 일치   --> */}
            <button type="button" onClick={(e)=>{menuActive(e, props.menuHandle(0))}} className="listTitle">
                <span className="icon mainMenu"></span>
                <span className="title">대표 메뉴</span>
            </button>
            <div className="listContent mainMenu swiper-container">
                <Swiper {...params}>
                    {
                        props.mainMenu.length > 0 ? 
                        <MainMenuSwiperComponent detail = {props.mainMenu} 
                                                strNm = {props.strNm} 
                                                strAddr = {props.strAddr} 
                                                orderType ={props.orderType}
                                                dlMinOrdrPrc = {props.dlMinOrdrPrc} 
                                                dlMinOrdrPrc9icp = {props.dlMinOrdrPrc9icp}
                                                dlMinOrdrPrc9ica = {props.dlMinOrdrPrc9ica}
                                                dlMinOrdrPrc9icm = {props.dlMinOrdrPrc9icm}
                                                bizCtgDtl={props.bizCtgDtl} /> 
                        : 
                        null
                    }
                </Swiper>
            </div>
        </li>
    )
}

const MainMenuSwiperComponent = (props) => {

    let mainMenu = props.detail.filter(it => new RegExp('대표메뉴', "i").test(it.ctgNm))

    if(mainMenu.length <= 0) return

    const toggleLiked = (e) => {
        e.preventDefault();
        e.currentTarget.classList.toggle('active')
        
        var storeCd = ''

        // 일반 매장
        if(props.bizCtgDtl != '2029') {
            storeCd = 'S'
        } else storeCd = 'R'

        // 찜 등록
        if(e.currentTarget.classList.length > 2)
            API.menuDipAdd(props.detail[0].strId, storeCd, e.currentTarget.value, props.detail[0].brdId)
        // 찜 삭제
        else
            API.menuDipdel(props.detail[0].strId, storeCd, e.currentTarget.value)
    }

    return (
        mainMenu[0].detail.map((data) => {
            const thumImgUrl = 'http://images.kisvan.co.kr/smartorder/' + data.imgModNm;
    
            return (
                <div key={data.prdId} className="swiper-slide">
                    <Link to = {{
                        pathname:ACTION.LINK_ORDER_MENU,
                        state: {
                            mainMenu : true,
                            strId : mainMenu[0].strId,
                            strNm : props.strNm,
                            strAddr : props.strAddr,
                            prdId : data.prdId,
                            prdNm : data.prdNm,
                            normalPrice : data.normalPrice,
                            dlMinOrdrPrc : props.dlMinOrdrPrc,
                            dlMinOrdrPrc9icp : props.dlMinOrdrPrc9icp,
                            dlMinOrdrPrc9ica : props.dlMinOrdrPrc9ica,
                            dlMinOrdrPrc9icm : props.dlMinOrdrPrc9icm,
                            imgModNm : data.imgModNm,
                            prdTagLst : data.prdTagLst,
                            // orderType : props.orderType
                        }}}>
                            <div>
                                <div className="viewImg">
                                <img src={thumImgUrl} alt="" />
                                </div>
                                <p className="itemName">
                                <button onClick={toggleLiked} className={data.dipPrdYn === "Y" ? "icon like active" : "icon like"} value={data.prdId}></button>
                                <span className="name">{unescapehtmlcode(data.prdNm)}</span>
                                </p>
                                <p className="itemPrice"><span>{numberFormat(data.normalPrice)}원</span></p>
                            </div>
                        </Link>
                </div>
            )
        })
    )
}

export default MainMenuSwiper