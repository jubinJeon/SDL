import React from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

import * as ACTION from '../common/ActionTypes'
import { decimalToMeterFormat, unescapehtmlcode, numberFormat } from '../util/Utils';

const SingleMarketCmpnt = ({ market, restYN }) => {

    const fn = (e, isOpen, isBreakTime, isHld) => {
        if(isOpen === "N" || isBreakTime === "Y" || isHld === "Y")
            e.preventDefault()
    }

    const thumImgUrl = market.imgModNm;

    return (
    <>
        <Link   onClick={(e)=>{fn(e, market.isOpen, market.isBreakTime, market.isHld)}}
                to = {{
                    pathname:ACTION.LINK_MARKET_DETAIL+`${market.strId}`,
                    state: {
                        strId : market.strId,
                        storeCd : market.storeCd
                    }
                }}
                className={market.isOpen === "N" || market.isBreakTime === "Y" || market.isHld === "Y"? "disableList" : ""}> 
                
            <div className="listImg">
                { market.isNewStr && <span className="newLabel"><strong>신규</strong></span>}
                { market.isOpen === "N" || market.isBreakTime === "Y" || market.isHld === "Y" ? <span className="disableLabel"><strong>준비중</strong></span> : null }
                <LazyLoad>
                    <img src={thumImgUrl} alt="썸네일 이미지" onError={(e)=>{e.target.onerror = null; e.target.src="/common/images/no_image.png"}}/>
                </LazyLoad>
            </div>

            <div className="listInfo">
                <div className="infoLabel">
                    {(market.dlvYn === 'Y') ? <span className="label deli">배달</span> : null}
                    {(market.pickYn === 'Y') ? <span className="label pick">픽업</span> : null}
                </div>
                <div className="infoTitle">
                    <p className="title">{unescapehtmlcode(market.strNm)}</p>                    
                </div>
                <div className="infoDesc">
                    <ul>
                        <li>
                            {/* <span className="startPoint"><span className="star">{market.avrgStarPnt ==="" ? 0 : market.avrgStarPnt}</span>{market.rvwCnt ? " " + "(" + market.rvwCnt + ")" : ""}</span> */}
                            <span className="descLabel distance">{decimalToMeterFormat(market.distance)}</span>
                            {market.pickYn === 'Y' && market.dlvYn === 'N' ? null : <span className="descLabel deliveryTime">{market.expDlvTm}분 </span>}
                        </li>
                        {
                            market.prpPrdNm ?
                            <li>
                                <span className="infoDescMenu">
                                    {market.prpPrdNm ? unescapehtmlcode(market.prpPrdNm) : null}
                                </span>
                            </li>
                            : null
                        }
                        
                        <li>
                            {
                                market.pickYn === 'Y' && market.dlvYn === 'N' ? null : 
                                <>
                                <span className="descLabel"> 최소주문 {numberFormat(calcMinOderPrice(market))}원
                                </span>
                                {
                                  Number(market.dlPrc3) !== 0
                                  ?
                                  <span className="descLabel">배달팁 {numberFormat(market.dlPrc3)}원 ~ {numberFormat(market.dlPrc1)}원</span>
                                  :
                                  Number(market.dlPrc2) !== 0
                                  ?
                                  <span className="descLabel">배달팁 {numberFormat(market.dlPrc2)}원 ~ {numberFormat(market.dlPrc1)}원</span>
                                  :
                                  <span className="descLabel">배달팁 {numberFormat(market.dlPrc1)}원</span>
                                }    
                                </>
                            }
                        </li>
                        <li>
                            {market.strDlevYn === "1" ? <span className="infoLabel">배달팁할인</span> : null}
                            {market.strPkevYn === "1" ? <span className="infoLabel">픽업할인</span> : null}
                            {market.strStevYn === "1" ? <span className="infoLabel">추가할인</span> : null}
                            {restYN === 'N' && market.zeropayUseFg == '1' ? <span className="infoLabel zeroPay">제로페이</span> : null }
                        </li>
                    </ul>
                </div>
            </div>

        </Link>
    </>
    );
}

const calcMinOderPrice = (cartData) => {

    const dlMinOrdrPrc9icp = cartData.dlMinOrdrPrc9icp
    const dlMinOrdrPrc9ica = cartData.dlMinOrdrPrc9ica
    const dlMinOrdrPrc9icm = cartData.dlMinOrdrPrc9icm

    const arr = [Number(dlMinOrdrPrc9icp),Number(dlMinOrdrPrc9ica),Number(dlMinOrdrPrc9icm)]

    return Math.max.apply(null, arr);
}

export default SingleMarketCmpnt;