import React, { useState, useEffect, useRef } from 'react';

import * as API from '../../../Api'

import KeywordMenuListComponent from './keywordMenuList'
import MenuListComponent from './menuList'
import ListTabMenu from './tab'
import { unescapehtmlcode, pullShowScreen } from '../../../util/Utils'

export default ({strId, strNm, dlMinOrdrPrc, prdOrgn, storeCd, orderType, strAddr,dlMinOrdrPrc9icp,dlMinOrdrPrc9ica,dlMinOrdrPrc9icm, brdId}) =>{

    const inputSearchRef = useRef();
    const refSearchBtn = useRef();
    
    const [keyWord, setKeyWord] = useState("");
    const [result, setResult] = useState(null);
    const [showButton, setShowButton] = useState(false)
    
    useEffect (() => {
        if(storeCd === "R") {
            // 휴게소 메뉴 목록
            API.getRestMenus(strId, brdId)
            .then((data)=>{
                setResult(data)
            })
            .catch((error) => {
                setResult([]);
            })
        }
        else {
            // 매장 메뉴 목록
            API.getStoresMenusList(strId, brdId)
            .then((data)=>{
                setResult(data)
            })
            .catch((error) => {
                setResult([]);
            })
        }
    }, []);

    const appKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchClicked(inputSearchRef.current.value, setKeyWord);
            refSearchBtn.current.focus()
        }
    }

    return ( 
        <>
        {
            result !== null
            ? <ListTabMenu mainMenu = {result.data.menus} category = {result.data.category}
                inputSearchRef = {inputSearchRef} setKeyWord = {setKeyWord} setShowButton = {setShowButton}/>
            : null
        }
        <div className="menuList">
            <div className="searchArea">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="searchBox">
                        <input type="text" className="searchInput" placeholder="어떤 메뉴를 찾으세요?"
                            ref = {inputSearchRef} onKeyPress={appKeyPress} onChange={() => {onChangeSearch(setShowButton, setKeyWord, inputSearchRef)}}/>
                        <button type="button" className="searchBtn" ref = {refSearchBtn}
                            onClick={() => {searchClicked(inputSearchRef.current.value, setKeyWord)}}>검색</button>
                            {showButton ? <button className="delInput" type="button" onClick={() => {btnClearClick(setShowButton, setKeyWord, inputSearchRef)}}>삭제</button> : null}  
                    </div>
                </form>
            </div>
            <div className="menuItems">
                <ul className="itemsList">
                    {
                        result !== null && keyWord !== "" ? 
                        <KeywordMenuListComponent    
                            strNm = {strNm} 
                            dlMinOrdrPrc = {dlMinOrdrPrc}
                            dlMinOrdrPrc9icp = {dlMinOrdrPrc9icp}
                            dlMinOrdrPrc9ica = {dlMinOrdrPrc9ica}
                            dlMinOrdrPrc9icm = {dlMinOrdrPrc9icm}
                            mainMenu = {result.data.menus} 
                            keyWord = {keyWord}
                            strAddr = {strAddr}
                            storeCd ={storeCd}/>
                        :
                        null
                    }

                    {
                        result !== null && keyWord === "" ?
                        <MenuListComponent  
                            strNm = {strNm} 
                            dlMinOrdrPrc = {dlMinOrdrPrc}
                            dlMinOrdrPrc9icp = {dlMinOrdrPrc9icp}
                            dlMinOrdrPrc9ica = {dlMinOrdrPrc9ica}
                            dlMinOrdrPrc9icm = {dlMinOrdrPrc9icm}
                            mainMenu = {result.data.menus} 
                            category = {result.data.category} 
                            strAddr = {strAddr}
                            storeCd ={storeCd}/>
                        :
                        null
                    }
                </ul>
                <div className="itemsFrom">
                    {
                        prdOrgn !== null && prdOrgn !== '' && 
                        <div className="infoBox">
                            <p className="fromTitle">원산지 정보</p>
                            <ul className="fromLIst fnMoreContent">
                                {
                                    prdOrgn.split("\n").map((text) =>
                                        <li>{unescapehtmlcode(text)}</li>
                                    )
                                }
                            </ul>
                            <button type="button" className="msgMore fnMoreBtn">더보기</button>
                        </div>
                    }
                    
                    <p className="moreInfo">메뉴 이미지는 실제 음식과는 다를 수 있습니다.</p>
                </div>
            </div>
        </div>
        </>
    )
}

function searchClicked(keyWord, setKeyWord) {
    setKeyWord(keyWord)
}

function onChangeSearch(setShowButton, setKeyWord, inputSearchRef) {
    if(inputSearchRef.current.value !== "")
        setShowButton(true)
    else {
        setKeyWord("")
        setShowButton(false)
    }
}

const btnClearClick = (setShowButton, setKeyWord, inputSearchRef) => {
    inputSearchRef.current.value = ""
    setKeyWord("")
    setShowButton(false)
};