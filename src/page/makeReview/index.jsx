import React from 'react';

export default ( {history}) => {
    
    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div onClick={handleOnClick} className="leftArea">
                        <a href="#" className="icon pageClose">CLOSE</a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">리뷰쓰기</h1>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="staticTitleView">
                            <div>
                                <div className="statusLabel">
                                    <span className="label deli">배달</span>
                                </div>
                                <span className="date">2020.04.01</span>
                            </div>
                            <div>
                                <p className="title"><strong>카페 드롭탑 신도림점</strong></p>
                                <p className="option">오곡라떼/아메리카노/치즈케이크/오곡라떼/아메리카</p>
                            </div>
                        </div>
                        <div className="sectionBlock"></div>
                        <div className="reviewRegister">
                            <div>
                                <p className="ratingMsg"><strong>별점을 평가해 주세요.</strong></p>
                                <div className="ratingStar big fnRating">
                                    <span className="star"></span>
                                    <span className="star"></span>
                                    <span className="star"></span>
                                    <span className="star"></span>
                                    <span className="star"></span>
                                </div>
                                <p className="reviewMsg">1점 (별로예요)</p>
                                <div className="wirteArea">
                                    <p className="title">어떤 점이 좋았나요?</p>

                                    <div className="textareaBox">
                                        <textarea title="리뷰 쓰기" placeholder="상품의 장,단점을 최소 10자 이상 작성해주세요."></textarea>
                                    </div>
                                    <div className="addPhotoWrap">
                                        <a href="#" className="btn icon detail addPhoto">사진첨부</a>
                                        <ul className="phtoList">
                                            <li>
                                                <img src="../common/images/tump/img_product_detail.jpg" alt="" />
                                                <button type="button" className="del">삭제</button>
                                            </li>
                                            <li>
                                                <img src="../common/images/tump/img_product_detail.jpg" alt="" />
                                                <button type="button" className="del">삭제</button>
                                            </li>
                                            <li>
                                                <img src="../common/images/tump/img_product_detail.jpg" alt="" />
                                                <button type="button" className="del">삭제</button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="btnWrap typeFlex">
                                <ul className="btnArea">
                                    <li><a href="#" className="btn register default"><strong>취소</strong></a></li>
                                    <li><a href="#" className="btn login apply"><strong>등록</strong></a></li>
                                </ul>
                            </div>
                        </div>
                        

                    </div>
                </div>
            </div>
        </div>
    )
}
