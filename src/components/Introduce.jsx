import React from 'react'
import Swiper from 'react-id-swiper'
import { pullIntroStatus, pushIntroStatus } from '../util/Utils';

const Introduce = ({history, location}) => {

    const params = {
        slidesPerView: 1,
        spaceBetween: 0,
        initialSlide:0,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    }

    let { from } = location.state || { from: { pathname: "/" } };

    const handleChangeNoMore = () => {
        console.log('handleChangeNoMore')
        const introStatus = pullIntroStatus();
        introStatus.noMore = true
        pushIntroStatus(introStatus)
        history.replace(from);
    }

    const handleChangeNoToday = () => {
        console.log('handleChangeNoToday')
        const today = new Date()
        const visitTime = today.getFullYear() + today.getMonth() + today.getDate()
        const introStatus = pullIntroStatus();
        introStatus.noToday = true
        introStatus.visitTime = visitTime
        pushIntroStatus(introStatus)
        history.replace(from);
    }

    return (
        <div className="introWrap">
            <div className="introListWrap">
                <div className="introList">
                    <Swiper {...params}>
                        <div className="swiper-slide intro_01">
                            <p className="introDesc">
                                <strong className="introLabel">배달</strong>
                                우리동네 맛집 이젠 집에서 편하게 즐겨 보세요.
                            </p>
                        </div>
                        <div className="swiper-slide intro_02">
                            <p className="introDesc">
                                <strong className="introLabel">픽업</strong>
                                매장에서 간편하게 주문하고 바로 픽업!
                            </p>
                        </div>
                        <div className="swiper-slide intro_03">
                            <p className="introDesc">
                                <strong className="introLabel">제로페이</strong>
                                온누리, 서울사랑 상품권 구매하고 결제까지!
                            </p>
                        </div>
                        <div className="swiper-slide intro_04">
                            <p className="introDesc">
                                <strong className="introLabel">휴게소</strong>
                                이제는 줄 서지 말고 이동하면서 주문!
                            </p>
                        </div>
                    </Swiper>
                </div>
                <div className="swiper-pagination"></div>
            </div>
            <div className="closePop">
                <span className="leftCheck">
                    <button type="button" onClick={()=>{handleChangeNoMore()}}>더 이상 보지 않기</button>
                </span>
                <span className="rightCheck">
                    <button type="button" onClick={()=>{handleChangeNoToday()}}>오늘 그만 보기</button>
                </span>
            </div>
        </div>
    )
}

export default Introduce;