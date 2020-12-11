import axios from 'axios'
import React, {useEffect, useState, useRef, useContext} from 'react';
import Resizer from 'react-image-file-resizer';
import {REDUCER_ACTION} from '../../context/SDLReducer'
import * as ACTION from '../../common/ActionTypes'
import {unescapehtmlcode} from '../../util/Utils'
import {SDLContext} from '../../context/SDLStore'
/**
 * **************************MAIN***********************************************************
 */
export default ( {history, location}) => {

    const {dispatch} = useContext(SDLContext);
    const textRef = useRef();
    const photoRef = useRef();
    // 화면, 별점
    const [rating, setRating] = useState(0);
    // 팝업
    const [modal, setModal] = useState({  
        showModal: false,
        dataModal: {
            type: "",
            title: "",
            desc: "",
            handleComfirm: ''
        }
    });
    // 등록 (10자 갯수)
    const [appliable, setAble] = useState(false);
    // 이미지 세팅
    const [imgSrc, setImgSrc] = useState([]);
    // 미리보기 이미지
    const [imgPreview, setPrev] = useState([]);
    // 이미지 붙이기
    const [attachable, setAttachable] = useState(true)

    //////////////////////hook//////////////////////////////////// 
    useEffect(() => {
        if(location.ordrKindCd == null) history.goBack()
    })
    // 10자 등록 갯수 
    useEffect(() => {
        checkAppliable()
    }, [rating])
    // 이미지 붙이기 
    useEffect(() => {
        if( imgSrc.length > 2)
            setAttachable(false)
        else
            setAttachable(true)
    }, [imgSrc]);
    // 이미지 프리뷰
    useEffect(() => {
        console.log(imgPreview)
    }, [imgPreview]);

     //////////////////////hook//////////////////////////////////// 
    
    // function 안쓰임
    const handleClickOpen = (data) => {
        setModal({
            showModal: true,
            dataModal: data
        })
    };

    // function 안쓰임
    const handleClose_modal = () => {
        setModal({ ...modal, showModal: false });
    };
    
    // function 토스트
    const toastCallback = (data) => {
        data.dispatch({type : 'TOAST', payload : {show : false }})
    }

    // 파일 아이디 생성
    const guid = () => {
        const s4 = () => {
          return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    // function (사진 첨부) 
    const readFile = (e) => {
        if(e.target.files.length > 0) {
            const file = e.target.files[0];
            if(file) {
                if(file.size === 0) {
                    dispatch({
                        type: REDUCER_ACTION.SHOW_ALERT, 
                        payload : {
                            data : {
                                title: '카메라 사진첨부 미지원' , 
                                desc : '카메라 사진 첨부를 지원하지 않는 휴대폰 입니다.\n휴대폰에 저장된 사진으로 첨부하세요.', 
                                code : 100
                            },
                            callback : () => {
                                dispatch({type : REDUCER_ACTION.HIDE_ALERT});
                            }
                        }
                    });
                } else {
                    const fileId = guid();
    
                    Resizer.imageFileResizer(
                        file, 
                        600, 
                        600, 
                        'JPEG', 
                        100, 0,
                        uri => {
                            setImgSrc([...imgSrc, {id: fileId, name: file.name, data: uri}]);
                            setPrev([...imgPreview, {id: fileId, file: uri}]);  
                        }, 
                        'base64' 
                    );
                // }          
            }
        }

        e.target.value = '';
    }

    // 이벤트 헨들러 (뒤로가기)
    const handleBackBtn = (e) => {
        e.preventDefault();

        if(textRef.current.value.length < 1)
            history.goBack()
        else dispatch({ type: REDUCER_ACTION.SHOW_CONFIRM,
                payload: {data: {title: '알림', desc: '입력하신 정보가 저장되지 않습니다. 정말 다음에 작성하시겠습니까?'},
            callback: (res) => {
                if(res == 1) {
                    history.goBack()
                    dispatch({type : REDUCER_ACTION.HIDE_CONFIRM})
                } else dispatch({type : REDUCER_ACTION.HIDE_CONFIRM})
            }
        }})
        
    }
    
    // 이벤트 헨들러 (별점주기)
    const onClickStar = (e) => {
        setRating( e.target.dataset.rate )
    }

     // 이벤트 헨들러 (10자이상 검사)
     const checkAppliable = () => {
        if(textRef.current.value.length > 9 && rating > 0)
            setAble(true)
        else setAble(false)
    }

    // 이벤트 헨들러 (사진 삭제 x버튼)
    const deleteImg = (key) => {
        setImgSrc(imgSrc.filter( img => img.id != key ))
        setPrev(imgPreview.filter( img => img.id != key ))
    }

    // 이벤트 헨들러 (리뷰 등록 
    async function sendReview () {        
        axios.defaults.baseURL = process.env.REACT_APP_SDL_API_DOMAIN + '/api/v1'
        axios.defaults.headers['Pragma'] = 'no-cache';

        let config = {
            withCredentials : true,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*",
            }
        }

        axios.interceptors.request.use(function (config) {
            const token = localStorage.getItem('accessId');
            config.headers.Authorization =  token ? `Bearer ${token}` : ''
            return config;
        });

        const url = 'members/reviews?'
        let files = [];
        imgSrc.map((img) => {
            files.push( JSON.stringify({'name': img.name, 'data': img.data}) )
        });

        await axios.post(
            url,
            {
                ordrId: location.ordrId.toString(),
                rvwPoint: Number(rating),
                rvwMsg: textRef.current.value.toString(),
                files: files
            },
            config
        )
        .then((data) => {
            if(data.data.code == "1") {
                history.replace({pathname: ACTION.LINK_ORDER_HISTORY})
            }
        })
        .catch((err) => {
            console.log(err)
            dispatch({type: 'TOAST', payload: {show : true, 
                        data: {msg: '처리에 실패하였습니다.', code : '', dispatch : dispatch},
                        callback : toastCallback}})
        });


        // const formData = new FormData()

        // formData.append('ordrId', location.ordrId.toString())
        // formData.append('rvwPoint', Number(rating))
        // formData.append('rvwMsg', textRef.current.value.toString())
        // imgSrc.map((img) => {
        //     formData.append('files', JSON.stringify({'name': img.name, 'data': img.data}))
        // })
        
        // await axios.post(
        //     url,
        //     formData,
        //     config
        // )
        // .then((data) => {
        //     // console.log(data)
        //     if(data.data.code == "1") {
        //         // history.replace({pathname: ACTION.LINK_ORDER_HISTORY})
        //     }
        // })
        // .catch((err) => {
        //     console.log(err)
        //     dispatch({type: 'TOAST', payload: {show : true, 
        //                 data: {msg: '처리에 실패하였습니다.', code : '', dispatch : dispatch},
        //                 callback : toastCallback}})
        //     // console.log(err.response.data)
        //     // console.log(err.response.status)
        // })

    }

    // 이벤트 헨들러 (10자 이하 토스트로 뿌리기)
    // => 2020.11.23 NEW 신규추가
    const toastReview = () => {
        let reviewData = textRef.current.value;
        if(reviewData.length <= 9 || rating < 1){
            dispatch({type : 'TOAST', payload : {show : true , data : {msg: '리뷰 등록을 위해 별점 및 10자 이상의 리뷰를 작성해주세요', code : '', dispatch : dispatch} , callback : toastCallback}});
        }
    };
    
    return (
        <div id="wrap">
            {/* <Alert open={modal.showModal} data={modal.dataModal} handleClose={handleClose_modal}></Alert> */}
            {/**
             * HEADER 부분
             */}
            <div id="header">
                <div className="headerTop">
                    <div onClick={handleBackBtn} className="leftArea">
                        <a className="icon pageClose">CLOSE</a>
                    </div>            
                    <div className="middleArea">
                        <h1 className="headerTitle">리뷰쓰기</h1>
                    </div>
                </div>
            </div>
             {/**
             * HEADER 부분
             */}
            {/**
             * BODY 부분
             */}
            <div id="container">
                <div id="content">
                    <div className="">
                         {/**
                         * TITLE SECTION
                         */}
                        <div className="staticTitleView">
                            <div>
                                <div className="statusLabel">
                                {location.ordrKindCd.indexOf("9") != -1?
                                    <span className="label deli">배달</span>
                                    : <span className="label pick">픽업</span>
                                }
                                </div>
                                <span className="date">{location.ordrDtm.substring(0, 10)}</span>
                            </div>
                            <div>
                                <p className="title"><strong>{location.brdNm}</strong></p>
                                <p className="option">{unescapehtmlcode(location.ordrPrdNm)}</p>
                            </div>
                        </div>
                        <div className="sectionBlock"></div>
                        
                         {/**
                         * 별점, 사진, 등록, 취소 SECTION
                         */}
                        <div className="reviewRegister">
                             {/**
                             * 별점, 사진 
                             */}
                            <div>
                                <p className="ratingMsg"><strong>별점을 평가해 주세요.</strong></p>
                                <div className="ratingStar big fnRating">
                                    <span className={rating < 1 ? "star": "star on"} data-rate={1} onClick={onClickStar}></span>
                                    <span className={rating < 2 ? "star": "star on"} data-rate={2} onClick={onClickStar}></span>
                                    <span className={rating < 3 ? "star": "star on"} data-rate={3} onClick={onClickStar}></span>
                                    <span className={rating < 4 ? "star": "star on"} data-rate={4} onClick={onClickStar}></span>
                                    <span className={rating < 5 ? "star": "star on"} data-rate={5} onClick={onClickStar}></span>
                                </div>
                                <p className="reviewMsg">
                                    {rating == 0 && "선택하세요"}
                                    {rating == 1 && "1점 (별로에요)"}
                                    {rating == 2 && "2점 (그저그래요)"}
                                    {rating == 3 && "3점 (괜찮아요)"}
                                    {rating == 4 && "4점 (좋아요)"}
                                    {rating == 5 && "5점 (최고에요)"}
                                </p>
                                <div className="wirteArea">
                                    <p className="title">어떤 점이 좋았나요?</p>

                                    <div className="textareaBox">
                                        <textarea /* defaultValue="내용내용내용내영앤요요냉뇬" */ ref={textRef} onChange={checkAppliable} title="리뷰 쓰기" placeholder="상품의 장,단점을 최소 10자 이상 작성해주세요."></textarea>
                                    </div>
                                    <div className={attachable ? "addPhotoWrap" : "addPhotoWrap disable"}>
                                        <label className="btn icon detail addPhoto">
                                            <input type='file' onChange={readFile} accept="image/*" />
                                            <span className="label">사진첨부</span>
                                        </label>
                                        <ul className="phtoList" ref={photoRef}>
                                            { imgPreview.length > 0 && 
                                                imgPreview.map((img, i) => 
                                                    <AttachedImg key={i} img={img} deleteImg={deleteImg} index={i}/>
                                                )
                                             }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/**
                             * 등록, 취소 
                             */}
                            <div className="btnWrap typeFlex">
                                <ul className="btnArea">
                                    <li><a onClick={handleBackBtn} className="btn register default"><strong>취소</strong></a></li>
                                    <li>
                                        {appliable ? <a onClick={sendReview} className={ "btn login apply" }><strong>등록</strong></a>
                                        : <a className={ "btn login apply disable"} onClick={toastReview} ><strong>등록</strong></a> }
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {/**
             * BODY 부분
             */}
        </div>
    )
}

//  컴포넌트 (이미지)
const AttachedImg = ({img, deleteImg, index}) => {

    return (
        <li>
            <img src={img.file} alt="" />
            <button type="button" className="del"
                onClick={ e => {
                    // e.target.parentElement.setAttribute("style", "display: none")
                    deleteImg(img.id)
                }
            }>삭제</button>
        </li>
    )
}