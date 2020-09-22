import React from 'react'

const TestPage = () => {

    const handleBtnClick = ()=>{
        console.log('handleBtnClick')
        var win = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
    }

    return(
        <button onClick={handleBtnClick} className="btn login default"><strong>휴대폰 본인 인증하기</strong></button>
    )

}
export default TestPage;