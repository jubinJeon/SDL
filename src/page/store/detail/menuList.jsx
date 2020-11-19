import React from 'react'
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';

// Version >= 2.4.0
import 'swiper/css/swiper.css';
import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import { numberFormat, unescapehtmlcode, pullShowScreen } from '../../../util/Utils'

const MenuListComponent = (props) => {

    const menus = props.mainMenu.filter(item=> item.brdCtgId.length > 0)

    let mainMenuShow = props.mainMenu.filter(it => it.ctgPriority === "1")
    if(mainMenuShow.length !== 0) mainMenuShow = mainMenuShow[0].detail.map((show) => show.prdId)
    
    const menuActive = (e) =>{
        e.currentTarget.parentNode.classList.toggle("hide")
    }

    return (
        <>
            {
                menus.map((category, idx) => {
           
                    return (
        
                        <li id={category.brdCtgId} key={category.brdCtgId}> {/*  <!-- 메뉴 href 와 ID 값 일치   --> */}
                            <button type="button" onClick={(e)=>{menuActive(e)}} className="listTitle">
                              <span className="title">{unescapehtmlcode(category.ctgNm)}</span>
                            </button>
                            {
                                category.ctgPriority !== "1" ?
                                <NomalMenu
                                    mainMenu = {category} 
                                    orderType = {props.orderType}
                                    strNm = {props.strNm} 
                                    strAddr_Detail = {props.strAddr_Detail} 
                                    dlMinOrdrPrc = {props.dlMinOrdrPrc} 
                                    dlMinOrdrPrc9icp = {props.dlMinOrdrPrc9icp}
                                    dlMinOrdrPrc9ica = {props.dlMinOrdrPrc9ica}
                                    dlMinOrdrPrc9icm = {props.dlMinOrdrPrc9icm}
                                    storeCd={props.storeCd}
                                    mainMenuShow = {mainMenuShow} 
                                    strAddr = {props.strAddr}
                                />
                                :
                                <RepresentativeMenu 
                                    category = {category} 
                                    strNm = {props.strNm} 
                                    strAddr = {props.strAddr} 
                                    orderType ={props.orderType}
                                    dlMinOrdrPrc = {props.dlMinOrdrPrc} 
                                    dlMinOrdrPrc9icp = {props.dlMinOrdrPrc9icp}
                                    dlMinOrdrPrc9ica = {props.dlMinOrdrPrc9ica}
                                    dlMinOrdrPrc9icm = {props.dlMinOrdrPrc9icm}
                                    storeCd={props.storeCd}
                                />
                            }
                        </li>
                    )
                })
            }
        </>
    )
}

const RepresentativeMenu = (props) => {

    const params = {
        slidesPerView: 2.35,
        freeMode: true,
        centeredSlides: false,
        spaceBetween: 10,
        initialSlide:0,
    }
    
    const toggleLiked = (e) => {
        e.preventDefault();
        e.currentTarget.classList.toggle('active')
        
        // 찜 등록
        if(e.currentTarget.classList.length > 2)
            API.menuDipAdd(props.category.strId, props.storeCd, e.currentTarget.value, props.category[0].brdId)
        // 찜 삭제
        else
            API.menuDipdel(props.category.strId, props.storeCd, e.currentTarget.value)
    }

    return (
        <>
            <div className="listContent mainMenu swiper-container">
                <Swiper {...params}>
                    {
                        props.category.detail.map((data) => {
                            const thumImgUrl = data.imgModNm;
                    
                            if(data.prdSaleCd === "OS")
                            {
                                return (
                                    <div key={data.prdId} className="swiper-slide">
                                        <Link to = {{
                                            pathname:ACTION.LINK_ORDER_MENU,
                                            state: {
                                                mainMenu : true,
                                                strId : props.category.strId,
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
                                                prdDesc : data.prdDesc,
                                                // orderType : props.orderType,
                                                maxSaleCnt : data.maxSaleCnt,
                                                adultPrdFg : data.adultPrdFg,
                                                storeCd : props.storeCd
                                            }}}>
                                                <div>
                                                    <div className="viewImg">
                                                        <img src={thumImgUrl} alt="" onError={(e)=>{e.target.onerror = null; e.target.src="/common/images/no_image.png"}}/>
                                                    </div>
                                                    <p className="itemName">
                                                        <button onClick={toggleLiked} className={data.dipPrdYn === "Y" ? "icon like active" : "icon like"} value={data.prdId}></button>
                                                        <span className="name">{unescapehtmlcode(data.prdNm)}</span>
                                                        {data.adultPrdFg ? <span className="icon drinkMenu"></span> : null}
                                                    </p>
                                                    <p className="itemPrice"><span>{numberFormat(data.normalPrice)}원</span></p>
                                                </div>
                                            </Link>
                                    </div>
                                )
                            }
                            else
                            {
                                return (<></>)
                            }
                        })
                    }
                </Swiper>
            </div>
        </>
    )
}


const NomalMenu = (props) => {
    
    const toggleLiked = (e) =>{
        e.preventDefault();
        e.currentTarget.classList.toggle('active')
        
        // 찜 등록
        if(e.currentTarget.classList.length > 2)
            API.menuDipAdd(props.mainMenu.strId, props.storeCd, e.currentTarget.value, props.mainMenu.brdId)
        // 찜 삭제
        else
            API.menuDipdel(props.mainMenu.strId, props.storeCd, e.currentTarget.value)
    }
    
    return (
        <>
            <div className="listContent">
                <ul>
                    {
                        props.mainMenu.detail.map((menu) => {
                            return(
                                <li className={menu.prdSaleCd === "OS" ? "" : "soldOut"} key={menu.prdId}>
                                    <Link to = {{
                                        pathname:ACTION.LINK_ORDER_MENU,
                                        state: {
                                            mainMenu : props.mainMenuShow.indexOf(menu.prdId) >= 0 ? true : false,
                                            strId : props.mainMenu.strId,
                                            strNm : props.strNm,
                                            strAddr_Detail : props.strAddr_Detail,
                                            prdId : menu.prdId,
                                            prdNm : menu.prdNm,
                                            prdDesc : menu.prdDesc,
                                            normalPrice : menu.normalPrice,
                                            dlMinOrdrPrc : props.dlMinOrdrPrc,
                                            dlMinOrdrPrc9icp : props.dlMinOrdrPrc9icp,
                                            dlMinOrdrPrc9ica : props.dlMinOrdrPrc9ica,
                                            dlMinOrdrPrc9icm : props.dlMinOrdrPrc9icm,
                                            imgModNm : menu.imgModNm,
                                            storeCd : props.storeCd,
                                            strAddr : props.strAddr,
                                            maxSaleCnt : menu.maxSaleCnt,
                                            adultPrdFg : menu.adultPrdFg
                                        }}}>
                                        <div>
                                            <p className="itemName">
                                                <button onClick={toggleLiked} className={menu.dipPrdYn === "Y" ? "icon like active" : "icon like"} value={menu.prdId}></button>
                                                <span className="name">{unescapehtmlcode(menu.prdNm)}</span>                            
                                                {props.mainMenuShow.indexOf(menu.prdId) >= 0 ? <span className="icon icuMainMenu">대표메뉴</span> : null}
                                                {menu.adultPrdFg ? <span className="icon drinkMenu"></span> : null}
                                            </p>
                                            <p className="itemDesc">{(unescapehtmlcode(menu.prdDesc))}</p>
                                            <p className="itemPrice">
                                                {/* <span className="sale">6,000원</span> */}
                                                <span>{numberFormat(menu.normalPrice)}원</span>
                                            </p>
                                            {/* <p className="itemStock">(남은 수량 5개)</p> */}
                                        </div>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}

export default MenuListComponent