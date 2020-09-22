import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import Terms_00 from './Terms_00'
import Terms_01 from './Terms_01'
import Terms_02 from './Terms_02'
import Terms_03 from './Terms_03'
import Terms_04 from './Terms_04'

export default ({history, location}) => {
  
  const onClickBackBtn = (e) => {
    e.preventDefault();
    history.goBack();
  };

  const [activeTab, setActiveTab] = useState({
      id: location.idx ? location.idx : 0,
      title: location.title ? location.title : '서비스 약관'
    })

  const setTab = (idx=0)=>{
    let tabList = document.querySelectorAll(".tabBtnArea .btnList li")
    setActiveTab({
        id : Number(idx),
        title : tabList[idx].innerText
    })
    for(let i = 0; i < tabList.length; i++){
        tabList[i].classList.remove("active")
    }
    tabList[idx].classList.add("active")
  }

  const makeTerms = (idx) =>{
      if(idx === 1){
          return <Terms_01 />
      }else if(idx === 2){
        return <Terms_02 />
      }else if(idx === 3){
        return <Terms_03 />
      }else if(idx === 4){
        return <Terms_04 />
      }else {
        return <Terms_00 />
      }
  }

  useEffect(() => {
    setTab(activeTab.id)
  }, [])

  return (
    <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a onClick={onClickBackBtn} className="icon pageClose">CLOSE</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">{activeTab.title}</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="fullHeight bgWhite">
                    <div className="tabBtnArea">
                        <ul className="btnList">
                            <li className="active">
                                <button type="button" data-tabid="0" onClick={(e) => {setTab(0)}}>서비스 이용약관</button>
                            </li>
                            <li>
                                <button type="button" data-tabid="1" onClick={(e) => {setTab(1)}}>개인정보 처리방침</button>
                            </li>
                            <li>
                                <button type="button" data-tabid="2" onClick={(e) => {setTab(2)}}>전자금융거래 이용약관</button>
                            </li>
                            <li>
                                <button type="button" data-tabid="3" onClick={(e) => {setTab(3)}}>위치기반서비스 이용약관</button>
                            </li>
                            <li>
                                <button type="button" data-tabid="4" onClick={(e) => {setTab(4)}}>PUSH,SMS 수신동의(선택)</button>
                            </li>
                        </ul>
                    </div>
                    <div className="agreeContent">
                        {makeTerms(activeTab.id)}
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    );

}
