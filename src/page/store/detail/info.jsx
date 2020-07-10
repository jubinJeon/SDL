import React, { useState, useEffect, useContext } from 'react';

import * as API from '../../../Api'
import { numberFormat, unescapehtmlcode, tmFormat } from '../../../util/Utils'
import {SDLContext} from '../../../context/SDLStore'

 // copyAddress_corp classname을 가진 태그의 값을 클립보드로 복사
 const copyMsg = (e) =>{
    var copyAddress = document.querySelector(".copyAddress_corp").innerText
    var tempElem = document.createElement("textarea")
    document.body.appendChild(tempElem)
    tempElem.value = copyAddress;
    tempElem.select();
    document.execCommand("copy")
    document.body.removeChild(tempElem)
}

export default ({strId, dlvYn}) =>{

    const {dispatch} = useContext(SDLContext);

    const [open, setOpen] = React.useState(false);

    const [result, setResult] = useState(null)

    useEffect (() => {
        // 한개의 매장 상세정보
        API.getStoreInfoDetail(strId)
        .then((data)=>{
            setResult(data)
        })
        .catch((error) => {
            setResult([]);
        })
    }, []);

    const handleClick = () => {
        setOpen(true);
        copyMsg()
        dispatch({type : 'TOAST', payload : {show : true , data : {msg:'주소가 복사되었습니다.', code : '', dispatch : dispatch} , callback : toastCallback}})
    };

    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    if(result === null) return null

    return (
        <>
            <div className="sectionLine"></div>
            { dlvYn == "Y" && <>
            <div className="contentSection">
                <h2 className="sectionTitle">배달팁 안내</h2>
                <p className="sectionDesc">배달팁은 라이더에게 드리는 비용입니다. 주문금액 및 지역별, 요일, 시간 등에 따라 달라질 수 있습니다.</p>
                <div className="sectionTableInfo">
                    <table>
                        <caption>배달팁 안내 주문금액 배달팁 정보를 확인 할수 있습니다.</caption>
                        <thead>
                        <tr>
                            <th scope="col" className="leftText">주문금액</th>
                            <th scope="col" className="centerText">배달팁</th>
                        </tr>
                        </thead>
                        <tbody>
                            {result.data.dlvTipPrcList[0].minOrdrPrc1 &&
                                <tr>
                                    <td className="leftText">{numberFormat(result.data.dlvTipPrcList[0].minOrdrPrc1)}원~</td>
                                    <td className="centerText">{numberFormat(result.data.dlvTipPrcList[0].dlPrc1)}원</td>
                                </tr>
                            }
                            {result.data.dlvTipPrcList[0].minOrdrPrc2 &&
                                <tr>
                                    <td className="leftText">{numberFormat(result.data.dlvTipPrcList[0].minOrdrPrc2)}원~</td>
                                    <td className="centerText">{numberFormat(result.data.dlvTipPrcList[0].dlPrc2)}원</td>
                                </tr>
                            }
                            {result.data.dlvTipPrcList[0].minOrdrPrc3 &&
                                <tr>
                                    <td className="leftText">{numberFormat(result.data.dlvTipPrcList[0].minOrdrPrc3)}원~</td>
                                    <td className="centerText">{numberFormat(result.data.dlvTipPrcList[0].dlPrc3)}원</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    Object.keys(result.data.dlvTipRgnList).length > 0 || Object.keys(result.data.dlvTipDtcList).length > 0
                        ||  Object.keys(result.data.dlvTipTmList).length > 0 ?
                    <div className="sectionBoxInfo">
                        <p className="title">할증 정보</p>
                        <ul className="descBox">
                            {
                                result.data.dlCvrRgnUseCd === "R" && Object.keys(result.data.dlvTipRgnList).length > 0 ?
                                <li>
                                    <span className="title">지역</span>
                                    <div className="desc">
                                        {
                                            result.data.dlvTipRgnList.map((list, index) =>
                                                <p key={"dlvTipRgnList" + index}>
                                                    <span>{numberFormat(list.dlPrc)}원</span>
                                                    <span className="descSp">
                                                        {list.hjdongNm}
                                                    </span>
                                                </p>
                                            )
                                        }
                                    </div>
                                </li>
                                :
                                null
                            }
                            {
                                result.data.dlCvrRgnUseCd === "D" && Object.keys(result.data.dlvTipDtcList).length > 0 ?
                                <li>
                                    <span className="title">거리</span>
                                    <div className="desc">
                                        {
                                            result.data.dlvTipDtcList.map((list, index) =>
                                                <p key={"dlvTipDtcList" + index}>
                                                    <span>{numberFormat(list.dlPrc)}원</span>
                                                    <span className="descSp">
                                                        {numberFormat(list.dlDtc)}km
                                                    </span>
                                                </p>
                                            )
                                        }
                                    </div>
                                </li>
                                :
                                null
                            }
                            {
                                Object.keys(result.data.dlvTipTmList).length > 0 ?
                                <li>
                                    <span className="title">요일/시간</span>
                                    <div className="desc">
                                        {
                                            result.data.dlvTipTmList.map((list, index) =>
                                                <p key={"dlvTipTmList" + index}>
                                                    <span>{numberFormat(list.dlPrc)}원</span>
                                                    <span className="descSp">{list.tmNm}</span>
                                                </p>
                                            )
                                        }
                                    </div>
                                </li>
                                :
                                null
                            }
                        </ul>
                    </div>
                    :
                    null
                }
            </div>
            </> }
            <div className="sectionLine"></div>
            <div className="contentSection">
                <h2 className="sectionTitle">영업 정보</h2>
                <ul className="sectionListInfo">
                <li>
                    <span className="title">운영시간</span>

                    <span className="desc">
                        평일 - {tmFormat(result.data.oprTmList[1].staTm)} ~ {tmFormat(result.data.oprTmList[1].endTm)}<br/>
                        토요일,일요일 - {tmFormat(result.data.oprTmList[0].staTm)} ~ {tmFormat(result.data.oprTmList[0].endTm)}
                    </span>

                </li>
                {
                    result.data.storesHldList.length > 0 ?
                    <li>
                        <span className="title">휴무일</span>
                        {
                            result.data.storesHldList.map((list, index) => 
                                <span key={"storesHldList" + index} className="desc">{list.perdNm} {list.dayNm} {list.hldNm}<br/></span>
                            )
                        }
                    </li>
                    :
                    null
                }
                <li>
                    <span className="title">전화번호</span>
                    <span className="desc">{result.data.storesBsnInfoVo.cnctNo}</span>
                </li>
                </ul>
            </div>
            <div className="sectionLine"></div>
            { dlvYn == "Y" &&
            <>
            <div className="contentSection">
                <h2 className="sectionTitle">배달 가능 지역</h2>
                <ul className="sectionListInfo">
                <li>
                    <span className="title">배달지역</span>
                    {/* 거리별 */}
                    { result.data.dlCvrRgnUseCd === "D" && Object.keys(result.data.dlvTipDtcList).length > 0 &&
                        <span className="desc">{parseInt(result.data.dlvTipDtcList[result.data.dlvTipDtcList.length-1].dlDtc)}km</span>}
                    {/* 지역별 */}
                    { result.data.dlCvrRgnUseCd === "R" && Object.keys(result.data.storesDlvRgnVo).length > 0 &&
                        <span className="desc">{result.data.storesDlvRgnVo.rgnNm}</span>
                    }
                </li>
                </ul>
            </div>
            <div className="sectionLine"></div>
            </> }
            <div className="contentSection">
                <h2 className="sectionTitle">사업자 정보</h2>
                <ul className="sectionListInfo">
                <li>
                    <span className="title">대표자명</span>
                    <span className="desc">{result.data.storesBsnInfoVo.ceoNm}</span>
                </li>
                <li>
                    <span className="title">상호명</span>
                    <span className="desc">{unescapehtmlcode(result.data.storesBsnInfoVo.strNm)}</span>
                </li>
                <li>
                    <span className="title">주소</span>
                    <span className="desc">
                        <span className="copyAddress_corp">
                            {unescapehtmlcode(result.data.storesBsnInfoVo.strAddr)} {unescapehtmlcode(result.data.storesBsnInfoVo.strAddrDtl)}
                        </span>
                        <button type="button" onClick={handleClick} className="btn borderBtn btnSmall">주소복사</button></span>
                </li>
                <li>
                    <span className="title">사업자등록번호</span>
                    <span className="desc">{result.data.storesBsnInfoVo.corpDtgsNo}</span>
                </li>
                </ul>
            </div>
            <div className="sectionBg whiteBg"></div>
        </>
    )
}
