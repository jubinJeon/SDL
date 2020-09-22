import React, { useState, useEffect } from 'react';

import useAsync from '../../hook/useAcync';
import * as API from '../../Api'
import {unescapehtmlcode} from '../../util/Utils'

export default ({history}) => {

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    const fnCatToggleBtn = (e) => {
        
        var kind = e.target.dataset.kind
        setSelectedCd(kind)
        
        var items = document.querySelectorAll('.tabBtnArea  ul li')
        for(var i =0; i < items.length; i++) {
            items[i].className = "";
        }
        e.currentTarget.parentNode.className = "active"
    }

    const fnToggleBtn = (e) => {
        var items = document.querySelectorAll('.toggleList ul li')
        if(e.currentTarget.parentNode.className  === "active") {
            e.currentTarget.parentNode.className = ""
        }else{
            for(var i =0; i < items.length; i++){
                items[i].className = "";
            }
            e.currentTarget.parentNode.className = "active"
        }
    }

    const [cgState, cgRefetch] = useAsync(
        API.faqcategory
    , [])

    const [listState, listRefetch] = useAsync(
        ()=> API.faqs(0, 100)
    , [])

    const [selectedCd, setSelectedCd] = useState("ALL")

    if (cgState.loading || listState.loading) return (
        <div className="pageLoding">
            <div className="stateWrap">
                <div className="loading">로딩중..</div>
            </div>
        </div>
    )
    else if (cgState.error|| listState.error) return (
        <div className="pageLoding">
            <div className="stateWrap">
                <div className="error">에러가 발생했습니다</div>
            </div>
        </div>
    )
    else if (!cgState.data|| !listState.data) return (
        <div>데이터가 없습니다.</div>
    )

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={handleOnClick} className="icon pageBack">Back</a>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">FAQ</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="tabBtnArea">
                            <ul className="btnList">
                                <li className="active">
                                    <a onClick={(e)=>fnCatToggleBtn(e)} data-kind="ALL" >전체</a>
                                </li>
                                {cgState.data.data && cgState.data.data.map((category) => {
                                    return (
                                        <li key={category.faqKindCd} >
                                            <a data-kind={category.faqKindCd} onClick={(e)=>fnCatToggleBtn(e)} >
                                                {category.faqKindCdNm}</a>
                                        </li> )
                                }) }
                            </ul>
                        </div>
                        <div className="toggleList">
                            <ul>
                            {listState.data.data && listState.data.data.map((qna) => {
                                    
                                    if(selectedCd === "ALL") {
                                        return (
                                            <li key={qna.faqId} >
                                                <a onClick={(e)=> {
                                                        e.preventDefault() 
                                                        fnToggleBtn(e)}} className="toggleTitle fnToggleList">
                                                    {unescapehtmlcode(qna.faqQuestion)}
                                                </a>
                                                <div className="toggleContent">
                                                    <p className="contentMsg">
                                                        {unescapehtmlcode(qna.faqAnswer)}
                                                    </p>
                                                </div>
                                            </li> )
                                    }
                                    else {
                                        if( qna.faqKindCd === selectedCd ) {
                                            return (
                                                <li key={qna.faqId} >
                                                    <a onClick={(e)=> {
                                                        e.preventDefault() 
                                                        fnToggleBtn(e)}} className="toggleTitle fnToggleList">
                                                        <p>{unescapehtmlcode(qna.faqQuestion)}</p>
                                                    </a>
                                                    <div className="toggleContent">
                                                        <p className="contentMsg">
                                                            {unescapehtmlcode(qna.faqAnswer)}
                                                        </p>
                                                    </div>
                                                </li> )
                                        }
                                    }
                                }) }

                            </ul>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
};