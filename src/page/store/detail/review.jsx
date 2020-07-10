import React, { useEffect } from 'react'
import * as ACTION from '../../../common/ActionTypes'
import Swiper from 'react-id-swiper';
// Version >= 2.4.0
import 'swiper/css/swiper.css';
import { useState } from 'react';

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


export default ({history}) => {
    const [isViewer ,setIsViewer] =useState({
        isView : false,
        idx : 0
    })
    useEffect(() => {
        msgLength()
    }, [])
    return (
        <>
            <div className="sectionLine"></div>
            <div className="contentSection">
                <div className="emptyWrap">
                    <div className="empty">
                        <p className="emptyMsg_1">리뷰가 없습니다.</p>
                    </div>
                </div>
                {/* <div className="ratingWrap">
                    <div className="ratingBox">
                        <strong className="ratingNumber">0.0</strong>
                        <div className="ratingStar">
                            <span className="on"></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className="ratingInfo">
                        <div className="infoCheck">
                            <label className="checkSelect">
                                <input type="checkbox" /> <span className="dCheckBox">사진리뷰만</span>
                                <!-- <span className="checkmark"></span> -->
                            </label>
                        </div>
                        <div className="infoTxt">
                            <p>리뷰 0  |  사장님 댓글  0</p>
                        </div>
                    </div>
                </div> */}
            </div>
            {/* <div className="sectionLine"></div> */}
            {/* <div className="contentSection">
                <div className="commentWrap">
                    <div className="commentRow">
                        <div className="commentUser">
                            <p className="userInfo">
                                <strong className="user">AB***님</strong>
                                <span className="date">2020년 04월 1일</span>
                            </p>
                            <div className="ratingStar">
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="commentBox">
                            <div className="commentImg">                                
                                <ul className="commentImgInner">
                                    {imgData.map((v, i)=>{
                                        return (
                                            <li key={i}>
                                                <a href="#" onClick={(e)=>{
                                                    e.preventDefault()
                                                    setIsViewer({
                                                        isView: true,
                                                        idx : i
                                                    })
                                                    //console.log(isViewer)
                                                }} data-img-id={i}>
                                                    <img src={"/common/images/tump/" + v.img} />
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                                {isViewer.isView && <ImgViewerPage idx={isViewer.idx} setIsViewer={setIsViewer} ></ImgViewerPage>}
                            </div>
                            <div className="commnetMsg fnTextLength">
                                <p className="title fnTitleMsg testTitle">1쨈버터토스트/ 바베큐칠리버거 / 쨈버터토스트/ 바베큐칠리버거</p>
                                <div className="fnDescMsg">
                                    <p className="desc">
                                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
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
                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                                번창하세요~~~
                                            </p>
                            </div>
                        </div>
                    </div>

                    <div className="commentRow">
                        <div className="commentUser">
                            <p className="userInfo">
                                <strong className="user">AB***님</strong>
                                <span className="date">2020년 04월 1일</span>
                            </p>
                            <div className="ratingStar">
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span></span>
                            </div>
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
                                <p className="title fnTitleMsg">쨈버터토스트/ 바베큐칠리버거</p>
                                <div className="fnDescMsg">
                                    <p className="desc">
                                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
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
                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                    번창하세요~~~
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="commentRow">
                        <div className="commentUser">
                            <p className="userInfo">
                                <strong className="user">AB***님</strong>
                                <span className="date">2020년 04월 1일</span>
                            </p>
                            <div className="ratingStar">
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span></span>
                            </div>
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
                                <p className="title fnTitleMsg">쨈버터토스트/ 바베큐칠리버거쨈버터토스트/ 바베큐칠리버거쨈버터토스트/ 바베큐칠리버거쨈버터토스트/ 바베큐칠리버거</p>
                                <div className="fnDescMsg">
                                    <p className="desc">
                                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                        최고에요~ 서비스 너무 감사
                                    </p>
                                </div>
                            </div>
                            <div className="commnetMsg owner">
                                <p className="title">
                                    <strong>사장님</strong>
                                    <span className="date">2020년 04월 1일</span>
                                </p>
                                <p className="desc">
                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                    번창하세요~~~
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="commentRow">
                        <div className="commentUser">
                            <p className="userInfo">
                                <strong className="user">AB***님</strong>
                                <span className="date">2020년 04월 1일</span>
                            </p>
                            <div className="ratingStar">
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span className="on"></span>
                                <span></span>
                            </div>
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
                                <p className="title fnTitleMsg">쨈버터토스트/ 바베큐칠리버거</p>
                                <div className="fnDescMsg">
                                    <p className="desc">
                                        최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                        최고에요~ 서비스 너무 감사
                                    </p>
                                </div>
                            </div>
                            <div className="commnetMsg owner">
                                <p className="title">
                                    <strong>사장님</strong>
                                    <span className="date">2020년 04월 1일</span>
                                </p>
                                <p className="desc">
                                    최고에요~ 서비스 너무 감사하고 잘먹었습니다.<br />
                                    번창하세요~~~
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div> */}
            {/* <div className="sectionBg whiteBg"></div> */}
        </>
    )
}

const ImgViewerPage = (props) => {
    
    const params = {
        effect: 'fade',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    }
    return (
        <div className="imgViewerWrap">
            <a href="#" onClick={(e)=>{
                e.preventDefault()
                props.setIsViewer({
                    isView: false,
                    idx : 0
                })
            }} className="icon viewerClose">CLOSE</a>
            <div className="imgViewer swiper-container">
                <Swiper {...params} activeSlideKey={String(props.idx)}>
                {imgData.map((v, i)=>{
                    return <div key={i}><img src={"/common/images/tump/" + v.img} alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></div>
                })}
                </Swiper>
            </div>
        </div>
    )
}
