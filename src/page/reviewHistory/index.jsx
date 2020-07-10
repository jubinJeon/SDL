import React, { useEffect, useState } from 'react';
import * as ACTION from '../../common/ActionTypes'

const imgData = [
    {id: 1, img: "img_product_detail.jpg",},
    {id: 2, img: "bnr_tump_detail.jpg",},
    {id: 3, img: "img_product_main.png",},
]

const msgLength = () => {
    const reviewTitle = document.querySelectorAll('.fnTextLength .fnTitleMsg')
    const reviewDesc = document.querySelectorAll('.fnTextLength .fnDescMsg')    
        
    reviewTitle.forEach((v) => {
        if (v.clientWidth > document.body.clientWidth) {
            v.classList.add('ellipsis')
            v.addEventListener("click", function(){
                this.classList.toggle('viewAllTitle')
            })
        }        
    })
    reviewDesc.forEach((v) => {
        const msgHeight = 34;
        if (v.clientHeight > msgHeight) {
            v.classList.add('ellipsis')
            v.previousSibling.classList.add('ellipsis')
            v.previousSibling.addEventListener("click", function(){
                //console.log(this)
                this.classList.toggle("viewAll")
                this.nextSibling.classList.toggle('viewAll')
            })
        }
    })
}

const imgViewer = (e, history) =>{
    e.preventDefault()
    //console.log(e.currentTarget.dataset.imgId)
    history.push(
        {
            pathname : ACTION.LINK_REVIEW_IMG,
            imgData : imgData,
            idx : e.currentTarget.dataset.imgId
        }
    )
}

export default ({history}) => {  
    const handleOnClick = (e) =>{
        e.preventDefault();
        history.goBack();
    }
    
    useEffect(() => {
        msgLength()
    }, [])

    return (
    <div id="wrap">
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <a onClick={handleOnClick} className="icon pageBack">Back</a>
                </div>
                <div className="middleArea">
                    <h1 className="headerTitle">리뷰 관리</h1>
                </div>
            </div>
        </div>
        <div id="container">
            <div id="content">
                <div className="">
                    
                    <div className="listWrap">
                        <p className="sortResult"><strong>총 <span className="num">3</span>개 매장</strong></p>
                        <div className="contentSection">
                            <div className="commentWrap">
                                {/* <!-- typeDeil(배달) OR typePcik(픽업) 클래스 추가 --> */}
                                <div className="commentRow typeDeil">
                                    <div className="commentUser">
                                        <div className="storeName">
                                            <div className="statusLabel">
                                                <span className="label deli">배달</span>
                                                {/* <!-- <span className="label pick">픽업</span> --> */}
                                            </div>
                                            <p className="name"><strong>카페 드롭탑 신도림점</strong><a href="#" className="btnMenu">메뉴</a></p>
                                        </div>
                                        <div className="ratingStar">
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span></span>
                                        </div>
                                        <span className="date">2020년 04월 1일</span>
                                    </div>
                                    <div className="commentBox">
                                        <div className="commentImg">
                                            <ul className="commentImgInner">
                                                {imgData.map((v, i)=>{
                                                    return (
                                                        <li>
                                                            <a href="#" key={i} onClick={(e)=>{imgViewer(e, history)}} data-img-id={i}>
                                                                <img src={"/common/images/tump/" + v.img} />
                                                            </a>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                        <div className="commnetMsg fnTextLength">
                                            <p className="title fnTitleMsg">쨈버터토스트쨈버터토스트쨈버터토스트쨈버터토스트/ 바베큐칠리버거쨈버터토스트/ 바베큐칠리버거</p>
                                            <div className="fnDescMsg">
                                                <p className="desc">
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    번창하세요~~~
                                                </p>
                                            </div>
                                        </div>
                                        <div className="commnetMsg owner">
                                            <p className="title">
                                                <strong>사장님</strong>
                                                <span className="date">2020년 04월 1일</span>
                                            </p>
                                            <p className="desc">
                                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                번창하세요~~~
                                            </p>
                                        </div>
                                    </div>
                                    <button type="button" className="rowDelete">삭제</button>
                                </div>


                                
                                <div className="commentRow typePick">
                                    <div className="commentUser">
                                        <div className="storeName">
                                            <div className="statusLabel">
                                                {/* <!-- <span className="label deli">배달</span> --> */}
                                                <span className="label pick">픽업</span>
                                            </div>
                                            <p className="name"><strong>카페 드롭탑 신도림점</strong><a href="#" className="btnMenu">메뉴</a></p>
                                        </div>
                                        <div className="ratingStar">
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span></span>
                                        </div>
                                        <span className="date">2020년 04월 1일</span>
                                    </div>
                                    <div className="commentBox">
                                        <div className="commentImg">
                                            <ul className="commentImgInner">
                                                <li>
                                                    <a href="#">
                                                        <img src="../common/images/tump/img_product_detail.jpg" alt="" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="commnetMsg fnTextLength">
                                            <p className="title fnTitleMsg">쨈버터토스트 /쨈버터토스트 /쨈버터토스트 /쨈버터</p>
                                            <div className="fnDescMsg">
                                                <p className="desc">
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    번창하세요~~~
                                                </p>
                                            </div>
                                        </div>
                                        <div className="commnetMsg owner">
                                            <p className="title">
                                                <strong>사장님</strong>
                                                <span className="date">2020년 04월 1일</span>
                                            </p>
                                            <p className="desc">
                                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                번창하세요~~~
                                            </p>
                                        </div>
                                    </div>
                                    <button type="button" className="rowDelete">삭제</button>
                                </div>
                                <div className="commentRow typePick">
                                    <div className="commentUser">
                                        <div className="storeName">
                                            <div className="statusLabel">
                                                {/* <!-- <span className="label deli">배달</span> --> */}
                                                <span className="label pick">픽업</span>
                                            </div>
                                            <p className="name"><strong>카페 드롭탑 신도림점</strong><a href="#" className="btnMenu">메뉴</a></p>
                                        </div>
                                        <div className="ratingStar">
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span className="on"></span>
                                            <span></span>
                                        </div>
                                        <span className="date">2020년 04월 1일</span>
                                    </div>
                                    <div className="commentBox">
                                        <div className="commentImg">
                                            <ul className="commentImgInner">
                                                <li>
                                                    <a href="#">
                                                        <img src="../common/images/tump/img_product_detail.jpg" alt="" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="../common/images/tump/img_product_detail.jpg" alt="" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="commnetMsg fnTextLength">
                                            <p className="title fnTitleMsg">쨈버터토스트</p>
                                            <div className="fnDescMsg">
                                                <p className="desc">
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                    번창하세요~~~
                                                </p>
                                            </div>
                                        </div>
                                        <div className="commnetMsg owner">
                                            <p className="title">
                                                <strong>사장님</strong>
                                                <span className="date">2020년 04월 1일</span>
                                            </p>
                                            <p className="desc">
                                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br/>
                                                번창하세요~~~
                                            </p>
                                        </div>
                                    </div>
                                    <button type="button" className="rowDelete">삭제</button>
                                </div>
                            </div>
                        </div>
                        
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
    );
}