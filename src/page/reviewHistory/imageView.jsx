import React, { useState } from 'react'
import Swiper from 'react-id-swiper';
// Version >= 2.4.0
import 'swiper/css/swiper.css';

export default function ImageView({history, location}) {
    const [imgData, setImgData] = useState(location.imgData)
    const onClickBackBtn = (e) => {
        //alert()
        e.preventDefault();
        history.goBack();
        //console.log(e)
    };
    //console.log(location.imgData)
    //console.log(location.idx)

    const params = {
        effect: 'fade',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
      }

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop bgBlack">
                    <div className="leftArea">
                        <a onClick={onClickBackBtn} className="icon viewerClose">CLOSE</a>
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="imgViewerWrap">
                            <a href="#" onClick={onClickBackBtn} className="icon viewerClose">CLOSE</a>
                            <div className="imgViewer swiper-container">
                                <Swiper {...params} activeSlideKey={location.idx}>
                                {imgData.map((v, i)=>{
                                    return <div key={i}><img src={"/common/images/tump/" + v.img} alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></div>
                                })}
                                </Swiper>
                            </div>
                            {/* <div className="imgViewer swiper-container">
                                {imgData.map((v)=>{
                                    return <div><img src={"/common/images/tump/" + v.img} alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></div>
                                })}
                                <ul className="swiper-wrapper">
                                    <li className="swiper-slide">
                                        <a href="#"><img src="../common/images/banner/img_tump_banner_01.png" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></a>
                                    </li>
                                    <li className="swiper-slide">
                                        <a href="#"><img src="../common/images/tump/img_product_main.png" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></a>
                                    </li>
                                    <li className="swiper-slide">
                                        <a href="#"><img src="../common/images/tump/bnr_tump_detail.jpg" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></a>
                                    </li>
                                    <li className="swiper-slide">
                                        <a href="#"><img src="../common/images/tump/img_product_detail.jpg" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></a>
                                    </li>
                                    <li className="swiper-slide">
                                        <a href="#"><img src="../common/images/banner/img_tump_banner_01.png" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></a>
                                    </li>
                                    <li className="swiper-slide">
                                        <a href="#"><img src="../common/images/tump/img_product_detail.jpg" alt="슬베생 찰떡 결제수단 제로페이 구매 천원 할일" /></a>
                                    </li>
                                </ul>
                                <div className="swiper-button-next"></div>
                                <div className="swiper-button-prev"></div>
                            </div> */}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
