import React, { useEffect, useState, useContext, useCallback } from 'react';

import * as ACTION from '../../common/ActionTypes'
import * as API from '../../Api'
import useAsync from '../../hook/useAcync'
import {SDLContext} from '../../context/SDLStore'
import {REDUCER_ACTION} from '../../context/SDLReducer'

import Alert from '../popup/Alert'
import { unescapehtmlcode } from '../../util/Utils'

var fullImgData = [
    
]

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

const htmlData = (data) => {
    var formated = data.replace(/(?:\r\n|\r|\n)/g, '<br />'); 
    formated = {__html : '<p>' + data + '</p>'}
    return formated
}

export default ({history}) => {  

    const {dispatch} = useContext(SDLContext);

    const handleOnClick = (e) =>{
        e.preventDefault();
        dispatch({type:REDUCER_ACTION.HISTORY_BACK})
    }
    
    useEffect(() => {
        msgLength()
    }, [])
    
    
    
    // alert
    const [modal, setModal] = useState({
        showModal: false,
        dataModal: {
            type: "",
            title: "",
            desc: "",
            handleComfirm: ''
        }
    })
    const handleClickOpen = (data) => {
        setModal({
            showModal: true,
            dataModal: data
        })
    };
    const handleClose_modal = () => {
        setModal({ ...modal, showModal: false });
    };

    // 팝업
    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    const [state, refetch] = useAsync(() => 
        API.getMemberReview()
    )
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
        } else setfullImg(fullImgData)
    }, [state])

    
    const imgViewer = (e, history, i, i2) => {
        e.preventDefault()
        console.log(fullImg)

        console.log('selected:'+ fullImg[i][i2])
        //console.log(e.currentTarget.dataset.imgId)
        history.push(
            {
                pathname : ACTION.LINK_REVIEW_IMG,
                imgData : fullImg[i],
                idx : e.currentTarget.dataset.imgId
            }
        )
    }

    useEffect(() => {
        console.log(fullImg)
    }, [fullImg])


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
    <div id="wrap">
        <Alert open={modal.showModal} data={modal.dataModal} handleClose={handleClose_modal}></Alert>
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
                    { data.data.length < 1 ?
                        <>
                            {/* <div className="sectionLine"></div> */}
                            <div className="contentSection">
                                <div className="emptyWrap">
                                    <div className="empty">
                                        <p className="emptyMsg_1">리뷰가 없습니다.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <p className="sortResult"><strong>총 <span className="num">{ data ? data.data.length : 0}</span>개 리뷰</strong></p>
                            { data.data &&
                            <div className="contentSection">
                                <div className="commentWrap">
                                {data.data.map((review, i) => 
                                    <div key={i} className={review.ordrKindCd.indexOf("9") !== -1? "commentRow typeDeil":"commentRow typePick"}>
                                        <div className="commentUser">
                                            <div className="storeName">
                                                <div className="statusLabel">
                                                    <span className={review.ordrKindCd.indexOf("9") !== -1?
                                                        "label deli" : "label pick"}/>
                                                </div>
                                                <p className="name"><strong>{review.strNm}</strong>
                                                    <a className="btnMenu" 
                                                        onClick={()=> history.push({pathname:ACTION.LINK_MARKET_DETAIL+`${review.strId}`
                                                        , state: {
                                                            strId: review.strId,
                                                            bizCtgGrp: review.bizCtgGrp
                                                    }})}>매장</a>
                                                </p>
                                            </div>
                                            <div className="ratingStar">
                                                <span className="on"></span>
                                                <span className={review.rvwPoint < 2 ? "" :"on"}></span>
                                                <span className={review.rvwPoint < 3 ? "" :"on"}></span>
                                                <span className={review.rvwPoint < 4 ? "" :"on"}></span>
                                                <span className={review.rvwPoint < 5 ? "" :"on"}></span>
                                            </div>
                                            <span className="date">{review.ordrDt.toString().split('.')[0]+'년 '
                                            + review.ordrDt.toString().split('.')[1]+'월 '
                                            + review.ordrDt.toString().split('.')[2]+'일'}</span>
                                        </div>
                                        <div className="commentBox">
                                            <div className="commentImg">
                                                <ul className="commentImgInner">
                                                    { review.imgInfo.map((img, i2) => {
                                                            return (
                                                                <li key={i2} >
                                                                    <a href="#" onClick={(e)=>{imgViewer(e, history, i, i2)}} data-img-id={i2}>
                                                                        {/* <img src={'http://192.168.23.130:8080' + img.imgPath} /> */}
                                                                        <img src={img.imgPath} />
                                                                    </a>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div className="commnetMsg fnTextLength">
                                                <p className="title fnTitleMsg">
                                                    {review.prdInfo.map((prd, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                {index !== review.prdInfo.length -1  ?
                                                                    unescapehtmlcode(prd.prdNm+'/') : unescapehtmlcode(prd.prdNm)}
                                                            </React.Fragment>)
                                                    })}
                                                </p>
                                                <div className="fnDescMsg">
                                                    <p className="desc" dangerouslySetInnerHTML={htmlData(review.rvwMsg)}>
                                                        
                                                    </p>
                                                </div>
                                            </div>
                                            { review.cmntInfo.length > 0 &&
                                            <div className="commnetMsg owner">
                                                <p className="title">
                                                    <strong>사장님</strong>
                                                    <span className="date">{' '+review.cmntInfo[0].regDt.toString().split('.')[0]+'년 '
                                                    + review.cmntInfo[0].regDt.toString().split('.')[1]+'월 '
                                                    + review.cmntInfo[0].regDt.toString().split('.')[2]+'일'}</span>
                                                </p>
                                                <p className="desc" dangerouslySetInnerHTML={htmlData(review.cmntInfo[0].rvwMsg)}>
                                                </p>
                                            </div> }
                                        </div>
                                        <button type="button" className="rowDelete" onClick={(e)=> {
                                                e.preventDefault();
                                        
                                                handleClickOpen({
                                                    type: 'CONFIRM',
                                                    desc: '작성하신 리뷰가 삭제됩니다. 정말 삭제하시겠습니까?',
                                                    handleComfirm: (() => {
                                                        API.deleteMemberReview(Number(review.rvwId))
                                                        .then((data) => {
                                                            if(data.code == "1") {
                                                                dispatch({type: 'TOAST', payload: {show : true, 
                                                                            data: {msg: '작성하신 리뷰가 삭제되었습니다.', code : '', dispatch : dispatch},
                                                                            callback : toastCallback}})
                                                            }
                                                            refetch()
                                                        })
                                                        .catch((err) => { 
                                                            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '처리 실패.', code : '', dispatch : dispatch} , callback : toastCallback}})
                                                        })
                                                        handleClose_modal()
                                                    })
                                                })
                                            }}>삭제</button>
                                    </div>
                                )}
                                    
                                </div>
                            </div>
                            }
                        </>
                    }
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
