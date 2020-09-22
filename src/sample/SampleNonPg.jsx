import React from 'react'
import { useCallback } from 'react'
import * as appbridge from '../appBridge'

const SampleNonPg = () => {

    const btnClick = useCallback(()=>{
        const json = {
            ordrId : '',
            partnerId : '',
            merchantCd : '',
            vanId : '',
            partnerCd : '',
            payPrice : ''



        }
        appbridge.SDL_dispatchCallPayment(json)
    },[])

    return (
        <>
            <button onClick={btnClick} > pg 결재 </button>
        </>
    )

}

export default SampleNonPg;