import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import * as ACTION from '../../../common/ActionTypes'

import useAsync from '../../../hook/useAcync'
import * as API from '../../../Api'

export default ({history}) => {

    // dummy data
    const NoticeData = [
        {
        index: 0,
        title: "first",
        date: "2020.07.07",
        contents: <>
                안녕하세요. 슬배생입니다.<br /><br />
                스마트오더 2.0의 새 이름 슬배생!<br />
                슬배생 앱이 출시되었습니다!<br /><br />    
                보다 나은 서비스를 위해 노력하겠습니다.<br />
                감사합니다.
                </>
        },
        {
        index: 1,
        title: "second",
        date: "2020.07.08",
        contents: <>
                안녕하세요. 슬배생입니다.<br /><br />
                스마트오더 2.0의 새 이름 슬배생!<br />
                슬배생 앱이 출시되었습니다!<br /><br />    
                보다 나은 서비스를 위해 노력하겠습니다.<br />
                감사합니다.
                </>
        }
    ];

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    const [state, refetch] = useAsync(() => {

        return API.getNoticeList(0, 100)
    }, [])

    const { loading, error, data } = state;

    if (loading) return (
        <div className="pageLoding">
            <div className="stateWrap">
                <div className="loading">로딩중..</div>
            </div>
        </div>
    )
    else if (error) return (
        <div className="pageLoding">
            <div className="stateWrap">
                <div className="error">에러가 발생했습니다</div>
            </div>
        </div>
    )
    else if (!data) return (
        <div>데이터가 없숨</div>
    )
    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <a onClick={handleOnClick} className="icon pageBack">Back</a>
                    </div>
                    <div className="middleArea">
                        <h1 className="headerTitle">공지사항</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="fullHeight">
                        <div className="arrowList typeNotice">
                            <ul>
                            { data && data.data.map((notice) => 
                                <li key={notice.brcId}>
                                    { notice && <SingleNoticeComponent notice={notice} />}
                                </li>
                            )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};



const SingleNoticeComponent = ({notice}) => {

    // useEffect(() => {
    //     console.log(`/mysdl/notice/${notice.brcId}`)
    // })

    /* export const LINK_NOTICE_PAGE = '/mysdl/notice/:index'; */
    /* ACTION.LINK_NOTICE */ 
    return (
        <Link to={{pathname: ACTION.LINK_NOTICE_DETAIL + `${notice.brcId}`
                , data: notice}} 
            className="listLine">
            <span className="date">
                {notice.regDtm}
                { notice.isNew && <span className="iconNew">신규</span> }
            </span>
            <p>{notice.boardTitle}</p>
        </Link>
    )
}