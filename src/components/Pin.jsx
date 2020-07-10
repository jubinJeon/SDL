import React , { useRef }from 'react'

const PinPad = () => {

    const refPin = useRef()

    


    return (
        <div className="loginForm"> 
            <h2 className="pageTitle">PIN번호 입력</h2>
            <ul className="formList">
                <li>
                    <label className="textInput">
                        <input type="tel" title="" placeholder="PIN번호를 입력하세요" ref = {refPin}/>
                    </label>  
                </li>
            </ul>
            <div class="btnWrap">
                <button type="submit" className="btn login disable"><strong>확인</strong></button>
            </div>
        </div>
    )
}
export default PinPad