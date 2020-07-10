import React, {useState, useCallback, useEffect} from 'react';

import * as API from '../../../Api'

export default ({match, location, history}) => {

    // console.log(match)
    // console.log(match.params.index)
    // console.log(location.data)

    const [noticeData, setNoticeData] = useState({})

    // const setData = useCallback(() => {
    //     // 홈화면 등에서 공지사항 index로 들어온 경우 한 건 조회함.
    //     if(location.data === undefined) {
    //         API.getNoticeList(0, 1)
    //         .then((result) => {
    //             result.data.map((data) => {
    //                 if( parseInt(data.brcId) === parseInt(match.params.index) ) {
    //                     setNoticeData(data)
    //                     console.log(data)
    //                 }
    //             })
    //         })
    //         .catch((err) => {
    
    //         })
    //         // console.log(noticeData)
    //     }
    //     else {
    //         setNoticeData(location.data)
    //     }
    // })
    
    useEffect(() => {
        // setData()
        setNoticeData(location.data)
    }, [])


    const { boardTitle, boardContent, regDtm, isNew } = noticeData

    const onClickBackBtn = () => {
        history.goBack();
    };

    return (
    <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a onClick={onClickBackBtn} className="icon pageBack">Back</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">공지사항</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="">
                    <div className="listContent">
                        <div className="titleArea">
                            <span className="date">
                                {regDtm}
                                { isNew && <span className="iconNew">신규</span>}
                            </span>
                            <h2 className="title">{boardTitle}</h2>                          
                        </div>
                        <div className="contentArea">
                            <p>
                                {boardContent}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}