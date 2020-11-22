import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import * as API from '../../Api'
import ListComponent from '../../components/listComponent'
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'
import { getRecentSearch, setRecentSearch, removeAllRecentSearch, removeRecentSearch, pullDefaultAddress, pullShowScreen, pushShowScreen} from '../../util/Utils'

const Search = ({history, location}) => {

    const inputSearchRef = useRef();
    const refSearchBtn = useRef();
    
    const defaultAddress = pullDefaultAddress()
    const latitude = defaultAddress.y;
    const longitude = defaultAddress.x;

    const [recentSearch, setRecenetSearch] = useState([]);
    const [searchResult, setSearchResult] = useState(null);

    const [showButton, setShowButton] = useState(false)

    const screenData = pullShowScreen()

    const {dispatch,data} = useContext(SDLContext);

    const btnSearchClick = useCallback((nFilter)=>{
        
        setRecentSearch(inputSearchRef.current.value);

        const data = {
          bizCtgGrp : screenData.bizCtgGrp,
          orderType : screenData.OrderTypeData,
          searchKeyword : inputSearchRef.current.value
        }
        pushShowScreen(data)

        if(inputSearchRef.current.value !== "") {
            API.getStores(latitude, longitude, "", inputSearchRef.current.value, nFilter, "")
            .then((data)=>{
                setSearchResult(data)})
                
            .catch((error) => {
                setSearchResult([]);
            })
        }
    })

    const btnBackClick = () =>{
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    };

    const btnRemoveAllSearch =  () => {
        removeAllRecentSearch();
        setRecenetSearch(getRecentSearch());
    }

    const btnRemoveSearch =  (e) => {
        const data = e.target.dataset.value
        removeRecentSearch(data);
        setRecenetSearch(getRecentSearch());
    }

    useEffect(() => {

        inputSearchRef.current.focus()

        if(screenData.searchKeyword === "" || screenData.searchKeyword === undefined) {
            const searchs = getRecentSearch();
            setRecenetSearch(searchs);
        }
        else {
            inputSearchRef.current.value = screenData.searchKeyword
            btnSearchClick("")
            setShowButton(true)
        }
    }, []);

    useEffect( () => {
    },[recentSearch, searchResult])

    const appKeyPress = (e) => {
        if (e.key === 'Enter') {
            refSearchBtn.current.click()
            refSearchBtn.current.focus()
        }
    }

    return (

        <div id="wrap" >
            <div id="header">
                <div className="headerTop">
                    {
                        <div className="leftArea">
                            <a onClick={btnBackClick} className="icon pageBack">Back</a>
                        </div>
                    }

                    <div className="middleArea search">
                        <div className="searchHeader">
                            <span className="textInput withDel">
                                <input type="text" title="검색" placeholder="음식, 가게 이름으로 검색하세요."
                                    ref = {inputSearchRef} onKeyPress={appKeyPress} onChange={() => {onChangeSearch(inputSearchRef, setShowButton)}}/>
                                    {showButton ? <button className="delInput" type="button" onClick={() => {btnClearClick(inputSearchRef, setShowButton)}}>삭제</button> : null}                              
                            </span>
                            <button className="icon searchBtn" type="button" ref = {refSearchBtn} onClick={() => {btnSearchClick("")}}/>
                        </div>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    {
                        searchResult !== null && searchResult.length > 0  ? 
                        '' 
                        : 
                        <Content1 searchResult = {searchResult} recentSearch = {recentSearch} 
                            btnRemoveAllSearch={btnRemoveAllSearch} btnRemoveSearch={btnRemoveSearch} 
                            searchWord = {searchWord} btnSearchClick = {btnSearchClick}/>
                    }
                </div>
            </div>
        </div>
    )

    function searchWord (word) {
        inputSearchRef.current.value = word.data
        btnSearchClick("")
    }
    
}

const Content1 = (props) => {
    
    function changeFilter(filter) {
        props.btnSearchClick(filter)
    }


    if(props.searchResult !== null && props.searchResult.length > 0 && props.searchResult.data.length > 0){
        
        let checkCnt = 0
        props.searchResult.data.map((check) => {
 //           if(check.isHld === "Y") checkCnt += 1
        })
        return (
            checkCnt === props.searchResult.data.length ? emptyComponent() : 
            <ListComponent data={props.searchResult.data} bizCtgGrp="" callback = {changeFilter}/>
        )
    }

    else if(props.searchResult !== null && (props.searchResult.length === 0 || props.searchResult.data.length === 0)){
        return emptyComponent()
    }

    return (
        <>
            <div className="sectionBlock">
                <div className="searchRecently">
                    <h2 className="title">최근 검색어
                        <button type="button" className="delAll" onClick={props.btnRemoveAllSearch}>전체삭제</button>
                    </h2>
                    {
                        props.recentSearch.length > 0 && 
                        <ul className="recentlyList">
                            {props.recentSearch.map((data,index) => {
                                return (
                                    <li key={index}>
                                        <span onClick={() => {props.searchWord({data})}}>{data}</span>
                                        <button data-value={data} type="button" className="del" onClick={props.btnRemoveSearch}>삭제</button>
                                    </li>
                                )
                            })}
                        </ul>
                    }
                </div>
            </div>
        </>
    )
}

const btnClearClick = (inputSearchRef, setShowButton) => {
    inputSearchRef.current.value=''
    setShowButton(false)
};

function onChangeSearch(inputSearchRef, setShowButton) {
    if(inputSearchRef.current.value !== "")
        setShowButton(true)
    else
        setShowButton(false)
}

const emptyComponent = () => {
    return (
        <div>
            <div className="sectionBlock"></div>
            <div className="emptyWrap typeSearch">
                <div className="empty">
                    <p className="emptyMsg_1">검색 결과가 없습니다.</p>
                    <p className="emptyMsg_2">
                        고객님이 설정한 위치를 기준으로<br />
                        배달/픽업이 가능한 가게만 검색됩니다.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Search