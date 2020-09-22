import React, {useContext} from 'react'
import {REDUCER_ACTION} from '../context/SDLReducer'
import {SDLContext} from '../context/SDLStore'
import { Button } from '@material-ui/core'


const SampleModal = () => {

    const {data,dispatch} = useContext(SDLContext)

    const doA = ()=>{
        dispatch({type:REDUCER_ACTION.SHOW_CONFIRM, payload:{data : { title: 'test', desc : 'testtest'}, callback : modalCallback}})
    }
    
    const doB = ()=>{
    
    }

    return (
        <>
            <Button onClick = {doA} className = "">컨펌창</Button>
            <Button onClick = {doB} className = "">알럿창</Button>
        </>
    )
}

const modalCallback = (data)=>{
    data.dispatch({type : REDUCER_ACTION.HIDE_MODAL})
}

export default SampleModal