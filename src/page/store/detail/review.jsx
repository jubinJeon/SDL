import React, { useEffect, useState, useRef } from 'react'

import Swiper from 'react-id-swiper';
// Version >= 2.4.0
import 'swiper/css/swiper.css';

import * as ACTION from '../../../common/ActionTypes'
import * as API from '../../../Api'
import useAsync from '../../../hook/useAcync'

import { numberFormat, unescapehtmlcode } from '../../../util/Utils';

var fullImgData = []

var imgData = [
    // {id: 1, img: "img_product_detail.jpg",},
    // {id: 2, img: "bnr_tump_detail.jpg",},
    // {id: 3, img: "img_product_main.png",},
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


export default ({strId}) => {

    const [isViewer ,setIsViewer] = useState({
        isView : false,
        idx : 0
    })

    const [currentIndex, setCurrentIndex] = useState(0)
    const photoOnlyRef = useRef()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        msgLength()
    }, [])

    const [state, refetch] = useAsync(() => {
        return API.getStoreReview(strId, checked ? 'Y':'N')
    }, [checked])

    const { loading, data, error } = state;
    
    const [fullImg, setfullImg] = useState()

    useEffect(() => {

        if( !loading && data && fullImgData.length < 1) {
            console.log(data.data)

            data.data.map((review, i) => {
                imgData = []
                review.imgInfo.map((img) => {
                    imgData.push({id: i, img: img.imgPath})
                })
                fullImgData.push(imgData)
            })
            setfullImg(fullImgData)
        }
        else
        {
//          setfullImg(fullImgData)
        }
    }, [state])

    // useEffect(() => {
    //     console.log(fullImg)
    // }, [fullImg])

    // if(true) return null
    if(loading) return (
        <>
            <div className="pageLoding">
                <div className="stateWrap">
                    <div className='loading'>로딩중..</div>
                </div>
            </div>
        </>
    )
    else if(error) return (
        <div className="">
            <div className="stateWrap">
                <div className="error">에러가 발생했습니다</div>
            </div>
        </div>
    )
    else if(!data)
        return null
    

    else return (
        <>
            <div className="sectionLine"></div>
            {data.data.length < 1 ?
                <div className="contentSection">
                    <div className="emptyWrap">
                        <div className="empty">
                            <p className="emptyMsg_1">리뷰가 없습니다.</p>
                        </div>
                    </div>
                </div>
                :
                <>
                <div className="contentSection">
                    <div className="ratingWrap">
                        <div className="ratingBox">
                            <strong className="ratingNumber">{data.data[0].avrPoints}</strong>
                            <div className="ratingStar">
                                    <span className={Math.round(data.data[0].avrPoints) < 1 ? "" :"on"}></span>
                                    <span className={Math.round(data.data[0].avrPoints) < 2 ? "" :"on"}></span>
                                    <span className={Math.round(data.data[0].avrPoints) < 3 ? "" :"on"}></span>
                                    <span className={Math.round(data.data[0].avrPoints) < 4 ? "" :"on"}></span>
                                    <span className={Math.round(data.data[0].avrPoints) < 5 ? "" :"on"}></span>
                            </div>
                        </div>
                        <div className="ratingInfo">
                            <div className="infoCheck">
                                <label className="checkSelect">
                                    <input type="checkbox" checked={checked} ref={photoOnlyRef} onClick={(e) => {
                                            e.preventDefault()
                                            if( e.target.checked )
                                                setChecked(true)
                                            else
                                                setChecked(false)
                                            }}/> <span className="dCheckBox">사진리뷰만</span>
                                    {/* <!-- <span className="checkmark"></span> --> */}
                                </label>
                            </div>
                            <div className="infoTxt">
                                <p>리뷰 {data.data[0].userRvwCnt}  |  사장님 댓글  {data.data[0].ownRvwCnt}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sectionLine"></div>

                <div className="contentSection">
                    <div className="commentWrap">
                    {data.data.map((review, i) => 
                        <div key={i} className={review.ordrKindCd.indexOf("9") != -1? "commentRow typeDeil":"commentRow typePick"}>
                            <div className="commentUser">
                                <p className="userInfo">
                                    <strong className="user">{review.mbrNick}님</strong>
                                    <span className="date">
                                        {review.regDtm.indexOf('2') != 0 ?
                                         review.regDtm  // 어제 or 오늘
                                        :
                                         review.regDtm.split('.')[0]+'년 '+   // ex) 2020.07.31
                                         review.regDtm.split('.')[1]+'월 '+
                                         review.regDtm.split('.')[2]+'일'}</span>
                                </p>
                                <div className="ratingStar">
                                    <span className={Math.round(review.rvwPoint) < 1 ? "" :"on"}></span>
                                    <span className={Math.round(review.rvwPoint) < 2 ? "" :"on"}></span>
                                    <span className={Math.round(review.rvwPoint) < 3 ? "" :"on"}></span>
                                    <span className={Math.round(review.rvwPoint) < 4 ? "" :"on"}></span>
                                    <span className={Math.round(review.rvwPoint) < 5 ? "" :"on"}></span>
                                </div>
                            </div>
                            <div className="commentBox">
                                <div className="commentImg">                                
                                    <ul className="commentImgInner">
                                        { review.imgInfo.map((img, i2) => {
                                            return (
                                                <li key={i2}>
                                                    <a onClick={(e) => {
                                                        e.preventDefault()
                                                        setCurrentIndex(i)
                                                        setIsViewer({
                                                            isView: true,
                                                            idx : i2
                                                        })
                                                        //console.log(isViewer)
                                                    }} data-img-id={i2}>
                                                        <img src={img.imgPath} />
                                                    </a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    {isViewer.isView && currentIndex == i && <ImgViewerPage i={i} idx={isViewer.idx} setIsViewer={setIsViewer} fullImg={fullImg} />}
                                </div>
                                <div className="commnetMsg fnTextLength">
                                    <p className="title fnTitleMsg testTitle">{unescapehtmlcode(review.ordNm)}</p>
                                    <div className="fnDescMsg">
                                        <p className="desc">
                                            {unescapehtmlcode(review.rvwMsg)}
                                        </p>
                                    </div>
                                </div>
                                { review.dtlVo != "" &&
                                    <div className="commnetMsg owner">
                                        <p className="title">
                                            <strong>사장님 </strong>
                                            <span className="date">{
                                                review.dtlVo.modDtm.split('.')[0]+'년 '+   // ex) 2020.07.31
                                                review.dtlVo.modDtm.split('.')[1]+'월 '+
                                                review.dtlVo.modDtm.split('.')[2]+'일'
                                            }</span>
                                        </p>
                                        <p className="desc">
                                            {unescapehtmlcode(review.dtlVo.rvwMsg)}
                                        </p>
                                    </div>
                                }
                            </div>
                        </div>

                    )}
                    </div>
                </div>
                <div className="sectionBg whiteBg"></div>
                </>
            }
        </>
    )
}

const ImgViewerPage = ({i, idx, setIsViewer, fullImg}) => {

    useEffect(() => {
        console.log(fullImg[i])
    }, [])
    
    const params = {
        effect: 'fade',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    }
    return (
        <div className="imgViewerWrap">
            <a onClick={(e)=>{
                e.preventDefault()
                setIsViewer({
                    isView: false,
                    idx : 0
                })
            }} className="icon viewerClose">CLOSE</a>
            <div className="imgViewer swiper-container">
                <Swiper {...params} activeSlideKey={String(idx)}>
                {fullImg[i].map((imgData, index)=>{
                    console.log(imgData.img)
                    return <div key={index}><img src={imgData.img} alt={"이미지 " +index} /></div>
                })}
                </Swiper>
            </div>
        </div>
    )
}
