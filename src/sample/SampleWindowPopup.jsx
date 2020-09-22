import React from 'react'
import { useEffect } from 'react'
import { useCallback,useState } from 'react'

const SampleWindowPopup = () => {

    // const url = 'http://192.168.23.97:8080/api/v1/members/check/join'
    const url = process.env.REACT_APP_SDL_CERT_USER_URL
    const userInfo = {id: 'manmanyi@naver.com'}

    const callback = useCallback((event) => {

        if (event.origin !== "http://example.org:8080"){

        }
        console.log('aaaaaaaaaaaaaaaa',event)
        const data = JSON.parse(event.data)
    })

    const handleBtnClick = useCallback(()=>{
        console.log('process.env.SDL_CERT_USER_URL',process.env.REACT_APP_SDL_CERT_USER_URL)
        window.open(process.env.REACT_APP_SDL_CERT_USER_URL, '_blank', 'height=' + Screen.height + ',width=' + Screen.width);
    },[])

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
    },[])

    useEffect(()=>{
        // window 이벤트 리스너를 등록한다.
        window.addEventListener("message", callback, false);
    },[])

    return(
        <>
            {/* <form method='get' name= 'aaa' target='_blank' action={url} onSubmit={handleSubmit}>
                <input type='hidden' value={userInfo.id} name='mbrId'></input>
                <button onClick={handleBtnClick} className="btn login default"><strong>휴대폰 본인 인증하기</strong></button>
            </form> */}
            <button onClick={handleBtnClick} className="btn login default"><strong>휴대폰 본인 인증하기</strong></button>
        </>
    )
}

export default SampleWindowPopup;