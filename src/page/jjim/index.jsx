import React, { useState, useEffect,  useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

import * as ACTION from '../../common/ActionTypes'
import useAsync from '../../hook/useAcync'
import {SDLContext} from '../../context/SDLStore'

import useAddress from '../../hook/useAddress';
import * as API from '../../Api'
import { pullDefaultAddress, pushDefaultAddress, numberFormat, unescapehtmlcode } from '../../util/Utils'
import SingleMarketCmpnt from '../../components/SingleMarketCmpnt'

export default ({history}) => {

    // 주소정보
    const storedDefaultAddress = pullDefaultAddress()
    const type = Object.keys(storedDefaultAddress).length === 0 ? 1 : 4;
    const addressParams =  {type : type}
    const defaultAddress = useAddress(addressParams,[])

    const [state, setState] = useState(false)
    const [storeMenu, setStoreMenu] = useState("store")

    // 저장된 주소정보가 없을 경우 저장한다.
    if(type == 1) {
        pushDefaultAddress(defaultAddress)
    }

    if(Object.keys(defaultAddress).length === 0){
        return null
    }
   
    return (
        <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="middleArea">
                    <h1 className="headerTitle">마이찜</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="fullHeight">
                    <div className="listSort pageSort">
                        <div className="btnWrap leftCol">
                            {/* <button type="button" value="store" className={state ? "active btn" : "btn"} onClick={activeClicked}>매장</button>
                            <button type="button" value="menu" className={state ? "btn" : "active btn"} onClick={activeClicked}>메뉴</button> */}
                            <button type="button" value="menu" className={state ? "btn" : "active btn"}>메뉴</button>
                        </div>                       
                    </div>
                    {state ? <LikeStore defaultAddress = {defaultAddress}/> : <LikeMenu defaultAddress = {defaultAddress} history={history}/>}
                </div>
            </div>
        </div>
        <div id="nav">
                <div>
                <ul className="navList">
                    <li className="home"><Link to={{pathname: ACTION.LINK_HOME}}>홈</Link></li>
                    <li className="map"><Link to={{pathname: ACTION.LINK_AROUND_MAP}}>주변지도</Link></li>
                    <li className="myPage"><Link to={{pathname: ACTION.LINK_MYPAGE}}>my슬배생</Link></li>
                    <li className="myOrder"><Link to={{pathname: ACTION.LINK_ORDER_HISTORY}}>주문내역</Link></li>
                    <li className="myLike active"><Link to={{pathname: ACTION.LINK_MY_JJIM}}>마이찜</Link></li>
                </ul>
                </div>
        </div>
    </div>
    )

    // state true: 매장 
    function activeClicked(e) {
        if(storeMenu !== e.currentTarget.value) {
            setState(!state)
            setStoreMenu(e.currentTarget.value)
        }
    }

}

const LikeStore = (props, history) => {
    
    const [result, setResult] = useState(null)

    useEffect (() => {
        API.getJjimStore(props.defaultAddress.y, props.defaultAddress.x)
        .then((data)=>{
            setResult(data.data)
        })
        .catch((error) => {
            setResult([]);
        })
    }, []);
    
    return (
        <>
        <div className="listWrap">
            <p className="sortResult"><strong>총 <span className="num">{result !== null ? result.length : 0}</span>개 매장</strong></p>
            {
                result === null ?
                null
                :
                <ul className="listContent typeLikeItems">
                {
                    result.map((store) => 
                        <li key={store.strId} >
                            {store && 
                                <LazyLoad height={100} once >
                                    <SingleMarketCmpnt market={store} />
                                </LazyLoad>
                            }
                        </li>
                    )
                }
            </ul>
            }
        </div>
        </>
    )
}

const LikeMenu = ({defaultAddress, history}) => {
    
    const {dispatch} = useContext(SDLContext);
    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }
    
    const [result, setResult] = useState(null)

    useEffect (() => {
        API.getJjimMenu(defaultAddress.y, defaultAddress.x, "")
        .then((data)=>{
            setResult(data.data)
            console.log(data.data)
        })
        .catch((error) => {
            setResult([]);
        })
    }, []);

    const countRef = useRef(0)
    
    return (
        <div className="listWrap">
        <p className="sortResult"><strong>총 <span className="num" ref={countRef} >{result !== null ? Number(result.length) : 0}</span>개 메뉴</strong></p>
        {
            result === null ?
            null
            :
            <div className="storeMenuList">
                {result.length !== 0 ? 
                        <div className="itemsList ">
                            <ul className="listContent">
                                {result.map((menus) => 
                                    <li key={menus.prdId} style={{display: 'block'}}>
                                        
                                            <a onClick={ menus.isOpen === "N" || menus.isBreakTime === "Y" || menus.isHld === "Y" ? 
                                                        () => dispatch({type : 'TOAST', payload : {show : true,
                                                                        data : {msg: '영업중인 매장이 아닙니다.', code : '', dispatch : dispatch},
                                                                        callback : toastCallback}})
                                                        :
                                                        ()=> {
                                                            history.push({
                                                                pathname: ACTION.LINK_MARKET_DETAIL+`${menus.strId}`,
                                                                state: {
                                                                    strId : menus.strId,
                                                                    bizCtgDtl : menus.bizCtgDtl
                                                                }
                                                            })
                                                            // history.push({
                                                            //     // pathname: ACTION.LINK_MARKET_DETAIL+`${menus.strId}`,
                                                            //     // state: {
                                                            //     //     strId : menus.strId,
                                                            //     //     bizCtgDtl : menus.bizCtgDtl
                                                            //     // }
                                                            //     pathname:ACTION.LINK_ORDER_MENU,
                                                            //     state: menus
                                                            // })
                                                        }
                                                        }>
                                            <div>
                                                <p className="strName">
                                                    <span className="strNm">{unescapehtmlcode(menus.strNm)}</span>
                                                </p>
                                                <p className="itemName">
                                                    <span className="name">{unescapehtmlcode(menus.prdNm)}</span>
                                                </p>
                                                <p className="itemDesc">{menus.prdDesc} </p>
                                                <p className="itemPrice"><strong>{numberFormat(Number(menus.normalPrice))}원</strong></p>
                                            </div>
                                        </a>
                                        <button onClick={(e)=> {
                                            API.menuDipdel(menus.strId, menus.storeCd, menus.prdId)
                                            // refech()
                                            e.target.parentElement.setAttribute("style", "display: none")
                                            countRef.current.textContent = Number(countRef.current.textContent) -1

                                        }} type="button" className="delRow">삭제</button>
                                    </li>
                                )}
                                
                            </ul>
                        </div>
                    :
                        <div className="emptyWrap noneData">
                            <div className="empty">
                                <p className="emptyMsg_1">찜 내역이 없습니다.</p>
                            </div>
                        </div>
                    }
            </div>
        }
        </div>
    )
}
// const LikeMenu = (props) => {

//     const [state, refech] = useAsync(()=>
//         API.getJjimMenu(props.defaultAddress.y, props.defaultAddress.x, "")
//     )
//     const { loading, data, error } = state;
//     const countRef = useRef(0)
    
//     return (
//         <div className="listWrap">
//         <p className="sortResult"><strong>총 <span className="num" ref={countRef} >{data !== null ? Number(data.data.length) : 0}</span>개 메뉴</strong></p>
//         {
//             data === null ?
//             null
//             :
//             <div className="storeMenuList">
//                 {data.data.length !== 0 ? 
//                 <>
//                 {/* map */}
//                     <div className="storeName">
//                         <div className="statusLabel">
//                             <span className="label deli">배달</span>
//                             <span className="label pick">픽업</span>
//                         </div>
//                         <strong className="name">마트 24 - 신도림점</strong>
//                     </div>
//                     <div className="itemsList ">
//                         <ul className="listContent">
//                             {/* map */}
//                                 <li>
//                                     <a href="#">
//                                         <div>
//                                             <p className="itemName">
//                                                 <span className="name">비프 샐러드</span>
//                                             </p>
//                                             <p className="itemDesc">한끼 식사로 든든 </p>
//                                             <p className="itemPrice"><span className="sale">6,000원</span><strong>5,800원</strong></p>
//                                         </div>
//                                     </a>
//                                     <button type="button" className="delRow">삭제</button>
//                                 </li>
//                             {/* map */}
//                         </ul>
//                     </div>
//                 {/* map */}
//                 </>
//                 :
//                 <div className="emptyWrap noneData">
//                     <div className="empty">
//                         <p className="emptyMsg_1">찜 내역이 없습니다.</p>
//                     </div>
//                 </div>
//                 }
//             </div>
//         }
//         </div>
//     )
// }