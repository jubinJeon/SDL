import React from 'react';

export default ({history}) => {

    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    return (
        <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a onClick={handleOnClick} className="icon pageBack">Back</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">고객센터</h1>
                </div>
                {/* <!-- <div className="rightArea">
                    <a href="#" className="icon setting">
                        설정
                    </a>
                </div> --> */}
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="fullHeight">
                    <div className="arrowList typeNotice">
                        <ul>
                            <li>
                                <span className="listLine">
                                    <p>이메일 문의</p>
                                    <span className="moreInfo">mobile@kisvan.co.kr</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- <div id="nav">
            <div>
                <ul className="navList">
                    <li className="home active"><a href="#">홈</a></li>
                    <li className="map"><a href="#">주변지도</a></li>
                    <li className="myPage"><a href="#">my슬배생</a></li>
                    <li className="myOrder"><a href="#">주문내역</a></li>
                    <li className="myLike"><a href="#">마이찜</a></li>
                </ul>
            </div>
        </div> --> */}
    </div>
    )
};