import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'
import Joining_Header from '../../../components/HeaderCloser'

export default ({history}) => {

    const [agreeAll, setAgreeAll] = useState(false);
    const [agreeList1, setAgreeList1] = useState(false);
    const [agreeList2, setAgreeList2] = useState(false);
    const [agreeList3, setAgreeList3] = useState(false);
    const [agreeList4, setAgreeList4] = useState(false);

    useEffect(() => {
        setAgreeAll(false);
        setAgreeList1(false);
        setAgreeList2(false);
        setAgreeList3(false);
        setAgreeList4(false);
    }, []);

    return (
        <div id="wrap">
            <Joining_Header headerTitle='약관동의'/>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="sectionRow">
                            <div className="loginForm">
                                <div className="agreeWelcome">
                                    <p className="welcomeMsg"><strong>반갑습니다!<br />약관동의가 필요합니다.</strong></p>
                                    <div className="welcomeCheck">
                                        <label className="checkSelect">
                                            <input type="checkbox" id="agreeAll" onChange={onChangeChecked} checked={agreeAll}/>
                                            <strong className="dCheckBox">전체동의</strong>
                                        </label>
                                    </div>
                                </div>
                                
                                <ul className="agreeList">
                                    <li>
                                        <span>
                                            <label className="checkSelect reverse">
                                                <input type="checkbox" id="agreeList1" onChange={onChangeChecked} checked={agreeList1}/>
                                                <span className="dCheckBox">
                                                    <Link to={{
                                                        pathname: ACTION.LINK_SERVICE_TERMS,
                                                        idx : 0,
                                                        title : '서비스 약관'
                                                    }}>슬배생 이용약관 동의</Link>
                                                </span>
                                                
                                                {/* <span className="dCheckBox">슬배생 이용약관 동의</span> */}
                                            </label>
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            <label className="checkSelect reverse">
                                                <input type="checkbox" id="agreeList2" onChange={onChangeChecked} checked={agreeList2}/>
                                                <span className="dCheckBox">
                                                    <Link to={{
                                                        pathname: ACTION.LINK_SERVICE_TERMS,
                                                        idx : 1,
                                                        title : '개인정보 처리방침'
                                                    }}>개인정보 수집 및 이용 동의</Link>
                                                </span>
                                                
                                                {/* <span className="dCheckBox">개인정보 수집 및 이용 동의</span> */}
                                            </label>
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            <label className="checkSelect reverse">
                                                <input type="checkbox" id="agreeList3" onChange={onChangeChecked} checked={agreeList3}/>
                                                <span className="dCheckBox">
                                                    <Link to={{
                                                        pathname: ACTION.LINK_SERVICE_TERMS,
                                                        idx : 2,
                                                        title : '전자금융거래 이용약관'
                                                    }}>전자금융거래 이용약관 동의</Link>
                                                </span>
                                                
                                                {/* <span className="dCheckBox">전자금융거래 이용약관 동의</span> */}
                                            </label>
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            <label className="checkSelect reverse">
                                                <input type="checkbox" id="agreeList4" onChange={onChangeChecked} checked={agreeList4}/>
                                                <span className="dCheckBox noneLine">만 14세 이상 이용자</span>
                                            </label>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="fixedBottom">
                            <div className="btnWrap fullWidth">
                                <button type="submit" className={agreeAll ? "btn login default" : "btn login disable"} onClick={nextStep}><strong>다음</strong></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    function nextStep() {
        if(!(agreeAll && agreeList1 && agreeList2 && agreeList2 && agreeList2)) {
            // Masage 띄우기
        }
        else return (
            history.push(ACTION.LINK_SIGNUP_VERIFY)
        )
    }

    function  onChangeChecked(e) {
        if (e.currentTarget.id === "agreeAll") {
            setAgreeAll(!agreeAll);
            if(!agreeAll) {
                setAgreeList1(true);
                setAgreeList2(true);
                setAgreeList3(true);
                setAgreeList4(true);
            }
            else {
                setAgreeList1(false);
                setAgreeList2(false);
                setAgreeList3(false);
                setAgreeList4(false);
            }
        }
        else if(e.currentTarget.id === "agreeList1") {
            setAgreeList1(!agreeList1);
            if(!agreeList1 === false) setAgreeAll(false)
            if(!agreeList1 && agreeList2 && agreeList3 && agreeList4) setAgreeAll(true)
        }
        else if(e.currentTarget.id === "agreeList2") {
            setAgreeList2(!agreeList2);
            if(!agreeList2 === false) setAgreeAll(false)
            if(agreeList1 && !agreeList2 && agreeList3 && agreeList4) setAgreeAll(true)
        }
        else if(e.currentTarget.id === "agreeList3") {
            setAgreeList3(!agreeList3);
            if(!agreeList3 === false) setAgreeAll(false)
            if(agreeList1 && agreeList2 && !agreeList3 && agreeList4) setAgreeAll(true)
        }
        else if(e.currentTarget.id === "agreeList4") {
            setAgreeList4(!agreeList4);
            if(!agreeList4 === false) setAgreeAll(false)
            if(agreeList1 && agreeList2 && agreeList3 && !agreeList4) setAgreeAll(true)
        }
    }
}
