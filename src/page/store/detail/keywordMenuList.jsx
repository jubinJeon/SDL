import React, {useEffect} from 'react'
import { Link } from 'react-router-dom';

// Version >= 2.4.0
import 'swiper/css/swiper.css';

import { numberFormat, unescapehtmlcode } from '../../../util/Utils'
import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'

const KeywordMenuListComponent = (props) => {

    let mainMenuShow = props.mainMenu.filter(it => new RegExp('대표메뉴', "i").test(it.ctgNm))
    if(mainMenuShow.length !== 0) mainMenuShow = mainMenuShow[0].detail.map((show) => show.prdId)

    return (
        <div className="listContent">
            <ul>
            {
                props.mainMenu !== null ?
                props.mainMenu.map((mainMenu) => {
                    if(mainMenu.ctgNm === "대표메뉴") return
                    return (
                                <MakeMenuList   mainMenu = {mainMenu} 
                                                keyWord = {props.keyWord} 
                                                orderType = {props.orderType}
                                                strNm = {props.strNm} 
                                                strAddr = {props.strAddr} 
                                                dlMinOrdrPrc = {props.dlMinOrdrPrc} 
                                                bizCtgDtl={props.bizCtgDtl}
                                                mainMenuShow = {mainMenuShow}
                                                dlMinOrdrPrc9icp = {props.dlMinOrdrPrc9icp}
                                                dlMinOrdrPrc9ica = {props.dlMinOrdrPrc9ica}
                                                dlMinOrdrPrc9icm = {props.dlMinOrdrPrc9icm}
                                    /> 
                    )
                })
                :
                null
            }
            </ul>
        </div>
    )
}

const MakeMenuList = (props) => {
    let listClass = ""
    const toggleLiked = (e) =>{
        e.preventDefault();
        e.currentTarget.classList.toggle('active')
        
        var storeCd = ''

        // 일반 매장
        if(props.bizCtgDtl != '2029') {
            storeCd = 'S'
        } else storeCd = 'R'

        // 찜 등록
        if(e.currentTarget.classList.length > 2)
            API.menuDipAdd(props.mainMenu.strId, storeCd, e.currentTarget.value, props.mainMenu.brdId)
        // 찜 삭제
        else
            API.menuDipdel(props.mainMenu.strId, storeCd, e.currentTarget.value)
    }

    return (
        props.mainMenu.detail.map((menu) => {
            {menu.prdSaleCd === "OS" ? listClass = "" : listClass = "soldOut"}
            if(props.keyWord === null || menu.prdNm.indexOf(props.keyWord) > -1) {
                return(
                    <li className={listClass} key={menu.prdId}>
                        <Link to = {{
                            pathname:ACTION.LINK_ORDER_MENU,
                            state: {
                                mainMenu : props.mainMenuShow.indexOf(menu.prdId) >= 0 ? true : false,
                                strId : props.mainMenu.strId,
                                strNm : props.strNm,
                                strAddr : props.strAddr,
                                prdId : menu.prdId,
                                prdNm : menu.prdNm,
                                normalPrice : menu.normalPrice,
                                dlMinOrdrPrc : props.dlMinOrdrPrc,
                                dlMinOrdrPrc9icp : props.dlMinOrdrPrc9icp,
                                dlMinOrdrPrc9ica : props.dlMinOrdrPrc9ica,
                                dlMinOrdrPrc9icm : props.dlMinOrdrPrc9icm,
                                imgModNm : menu.imgModNm,
                                // orderType : props.orderType,
                                bizCtgDtl : props.bizCtgDtl
                            }}}>
                            <div>
                                <p className="itemName">
                                <button onClick={toggleLiked} className={menu.dipPrdYn === "Y" ? "icon like active" : "icon like"} value={menu.prdId}></button>
                                <span className="name">{unescapehtmlcode(menu.prdNm)}</span>
                                {props.mainMenuShow.indexOf(menu.prdId) >= 0 ? <span className="icon icuMainMenu">대표메뉴</span> : null}
                                </p>
                                <p className="itemDesc">{menu.prdTagLst}</p>
                                <p className="itemPrice">
                                    {/* <span className="sale">6,000원</span> */}
                                    <span>{numberFormat(menu.normalPrice)}원</span>
                                </p>
                                {/* <p className="itemStock">(남은 수량 5개)</p> */}
                            </div>
                        </Link>
                    </li>
                )
            }
        })
    )
}

export default KeywordMenuListComponent