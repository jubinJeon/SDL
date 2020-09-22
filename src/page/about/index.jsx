import React, {useEffect} from 'react';


export default ({history}) => {

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    return(
        <>
            <div id="wrap">
                <div id="header">
                    <div className="headerTop">
                        <div className="leftArea">
                            <button  className="icon pageBack" onClick={handleOnClick}>Back</button>
                        </div>
                        <div className="middleArea">
                            <h1 className="headerTitle">사업자 정보</h1>
                        </div>
                    </div>
                </div>
                <div id="container">
                    <div id="content">
                        <div id="about" className="iframeWrap">
                            <iframe frameBorder="0" scrolling="yes" src="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1168143939&apv_perm_no="></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}