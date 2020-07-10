import React from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../common/ActionTypes'
import { decimalToMeterFormat, unescapehtmlcode, numberFormat } from '../util/Utils';

const SingleMarketCmpnt = ({ market }) => {
    
    const fn = (e, isOpen, isBreakTime) => {
        if(isOpen === "N" || isBreakTime === "Y")
            e.preventDefault()
    }

    const thumImgUrl = 'http://images.kisvan.co.kr/smartorder/' + market.imgModNm;

    if(market.isHld === "Y") return null

    return (
    <>
        <Link 
        onClick={(e)=>{fn(e, market.isOpen, market.isBreakTime)}}
        to = {{
                pathname:ACTION.LINK_MARKET_DETAIL+`${market.strId}`,
                state: {
                    strId : market.strId,
                    bizCtgDtl : market.bizCtgDtl
                }
             }} className={market.isOpen === "N" || market.isBreakTime === "Y" || market.isHld === "Y"? "disableList" : ""}> 
                
            <div className="listImg">
                { market.isNewStr && <span className="newLabel"><strong>신규</strong></span>}
                { market.isOpen === "N" || market.isBreakTime === "Y" || market.isHld === "Y" ? <span className="disableLabel"><strong>준비중</strong></span> : null }
                <img src={thumImgUrl} alt="썸네일 이미지"/>
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
                            (market.prpPrdNm1 || market.prpPrdNm2 || market.prpPrdNm3 || market.prpPrdNm3 || market.prpPrdNm3) ?
                            <li>
                                <span className="infoDescMenu">
                                    {market.prpPrdNm1 ? unescapehtmlcode(market.prpPrdNm1) : null}
                                    {market.prpPrdNm2 ? ", " + unescapehtmlcode(market.prpPrdNm2) : null}
                                    {market.prpPrdNm3 ? ", " + unescapehtmlcode(market.prpPrdNm3) : null}
                                    {market.prpPrdNm4 ? ", " + unescapehtmlcode(market.prpPrdNm4) : null}
                                    {market.prpPrdNm5 ? ", " + unescapehtmlcode(market.prpPrdNm5) : null}
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
                        {
                            (market.dlvTipDisc === 'Y' || market.discRateUseFg) ?
                            <li>
                                {market.dlvTipDisc === 'Y' ? <span className="infoLabel">배달팁할인</span> : null}
                                {/* {Number(market.discRateUseFg) ? <span className="infoLabel">추가할인 {market.discRate}%</span> : null} */}
                            </li>
                            : null
                        }
                        
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