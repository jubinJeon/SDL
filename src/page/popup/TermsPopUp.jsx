import React, { useState, useEffect } from 'react'
import Terms_00 from '../terms/Terms_00'
import Terms_01 from '../terms/Terms_01'
import Terms_02 from '../terms/Terms_02'
import Terms_03 from '../terms/Terms_03'
import Terms_04 from '../terms/Terms_04'

 const TermsPopUp = ({show, data, callback}) => {

    const [tabIndex, setTabIndex] = useState(-1)

    useEffect(()=>{
        setTabIndex(data.index)
    },[data.index])

    // const [tabIndex, setTabIndex] = useState()

    const getTermView = (idx) =>{

        let termView = null;
        switch(idx){
            case 0:
                termView = <Terms_00/>
            break;
            case 1:
                termView = <Terms_01/>
            break;
            case 2:
                termView = <Terms_02/>
            break;
            case 3:
                termView = <Terms_03/>
            break;
            case 4:
                termView = <Terms_04/>
            break;
            default:
        }

        console.log(termView)
        console.log('======================',idx)
        
        return termView
    }

    const getTitle = (idx) => {

        let title = ''
        console.log(idx)

        switch(idx){
            case 0 :
                title = '서비스 이용약관'
            break;
            case 1 :
                title = '개인정보 처리방침'
            break
            case 2 :
                title = '전자금융거래 이용약관'
            break
            case 3 :
                title = '위치기반서비스 이용약관'
            break
            case 4 :
                title = 'PUSH,SMS 수신동의(선택)'
            break
            default:
            
        }

        return title;
    }

    if(tabIndex === -1){
        return null
    }
    

    return (
        <>
            { show &&
                <div className="pagePop active">
                    <div className="popInner">
                        <div className="popHeader">
                            <div className="leftArea">
                                <button type="button" onClick={callback} className="icon pageClose">CLOSE</button>
                            </div>            
                            <div className="middleArea">
                                <h1 className="headerTitle">{getTitle(Number(tabIndex))}</h1>
                            </div>
                        </div>
                        <div className="popBody">
                            <div className="tabBtnArea">
                                <ul className="btnList">
                                    <li className={Number(tabIndex) === 0 ? 'active' : ''}>
                                        <button type="button"  onClick={(e) => {setTabIndex(0)}}>서비스 이용약관</button>
                                    </li>
                                    <li className={Number(tabIndex) === 1 ? 'active' : ''}>
                                        <button type="button" onClick={(e) => {setTabIndex(1)}}>개인정보 처리방침</button>
                                    </li>
                                    <li className={Number(tabIndex) === 2 ? 'active' : ''}>
                                        <button type="button" onClick={(e) => {setTabIndex(2)}}>전자금융거래 이용약관</button>
                                    </li>
                                    <li className={Number(tabIndex) === 3 ? 'active' : ''}>
                                        <button type="button" onClick={(e) => {setTabIndex(3)}}>위치기반서비스 이용약관</button>
                                    </li>
                                    <li className={Number(tabIndex) === 4 ? 'active' : ''}>
                                        <button type="button" onClick={(e) => {setTabIndex(4)}}>PUSH,SMS 수신동의(선택)</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="agreeContent">
                            {getTermView(Number(tabIndex))}
         
                                {/* {(Number(tabIndex) === 0) ? <Terms_00/> : null}
                                {(Number(tabIndex) === 1) ? <Terms_01/> : null}
                                {(Number(tabIndex) === 2) ? <Terms_02/> : null}
                                {(Number(tabIndex) === 3) ? <Terms_03/> : null}
                                {(Number(tabIndex) === 4) ? <Terms_04/> : null} */}
                            </div>
                        </div>
                    </div>
                </div>
            }
    </>
    )
}

export default TermsPopUp