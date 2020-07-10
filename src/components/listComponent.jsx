import React , { useState, useEffect}from 'react';
import LazyLoad from 'react-lazyload';
import useAsync from '../hook/useAcync'
import * as API from '../Api'

import SingleMarketCmpnt from './SingleMarketCmpnt'

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const handleClickOpen = (setOpen) => {
    setOpen(true)
};

const handleClose = (setOpen) => {
    setOpen(false);
};

const ListComponent = ({data, bizCtgDtl, callback}) => {
    
    const [open, setOpen] = useState(false)
    const [state, setState] = useState("all")
    const [filter, setFilter] = useState(null);

    useEffect (() => {
        setFilter("distance")
    }, []);

    return (
        bizCtgDtl === "2029" ?
        <MakeStation/>
        :
        <MakeOther open = {open} state = {state} setState = {setState} setOpen = {setOpen} filter = {filter}
            setFilter = {setFilter} callback = {callback} data = {data}/>
    )
}

const MakeStation = () => {

    const [resultData, setResultData] = useState(null);

    useEffect (() => {
        API.getHighways()
        .then((data)=>{
            setResultData(data.data)
        })
        .catch((error) => {
            setResultData([]);
        })
    }, []);

    if(resultData === null) return null

    return (
        
        <div className="listSort withSelect">
            <div className="selectWrap leftCol">
                <select className="designSelect">
                    <option key="all">전국 고속도로</option>
                    {
                        resultData.map((hiway) => {
                            return (
                                <option key={hiway.cdDtl}>{hiway.hiwayNm}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
}

const MakeOther = ({open, state, setState, setOpen, filter, setFilter, callback, data}) => {
    return (
        <>
        <div className="listSort">
            <div className="btnWrap leftCol">
                <button type="button" onClick={(e) => {stateClicked(setState, e.currentTarget.value)}} value="all"
                    className={state === "all" ? "btn icon star active" : "btn icon star"}>전체</button>
                <button type="button" onClick={(e) => {stateClicked(setState, e.currentTarget.value)}} value="dlv"
                    className={state === "dlv" ? "btn active" : "btn"}>배달</button>
                <button type="button" onClick={(e) => {stateClicked(setState, e.currentTarget.value)}} value="pic"
                    className={state === "pic" ? "btn active" : "btn"}>픽업</button>
            </div>
            {/* <div className="btnWrap righttCol">
                <button type="button" onClick={() => {handleClickOpen(setOpen)}} className="btn icon filter">필터</button>
            </div> */}
            <Dialog open={open} className="loginAlert">
                <DialogContent className="popInner" onClose={() => {handleClose(setOpen)}}>
                <div className="fillterCheck">
                    <ul>
                        <li>
                            <span className="infoItem">
                                <label className="checkSelect">
                                    <input type="radio" name="filter" onChange={(e) => {radioButtonOnChange(setFilter, e.currentTarget.id)}}
                                        id="distance" checked={"distance" === filter}/>
                                    <span className="dCheckBox">거리순</span>
                                </label>
                            </span>
                        </li>
                        <li>
                            <span className="infoItem">
                                <label className="checkSelect">
                                    <input type="radio" name="filter" onChange={(e) => {radioButtonOnChange(setFilter, e.currentTarget.id)}}
                                        id="rvwCnt" checked={"rvwCnt" === filter}/>
                                    <span className="dCheckBox">리뷰순</span>
                                </label>
                            </span>
                        </li>
                        <li>
                            <span className="infoItem">
                                <label className="checkSelect">
                                    <input type="radio" name="filter" onChange={(e) => {radioButtonOnChange(setFilter, e.currentTarget.id)}}
                                        id="avrgStarPnt" checked={"avrgStarPnt" === filter}/>
                                    <span className="dCheckBox">별점순</span>
                                </label>
                            </span>
                        </li>
                    </ul>
                </div>
                </DialogContent>
                <div className="popButton">
                    <ul className="buttonArea">
                        <li>
                            <button className="default" type="submit" onClick={() => {changeFilterClicked(setOpen, callback, filter)}}>
                                <strong>확인</strong>
                            </button>
                        </li>
                    </ul>
                </div>
            </Dialog>
        </div>
        <div className="listWrap">
            <ul className="listContent">
                {data.map((market) => function () {
                    if(state === "pic" && market.pickYn === "Y") {
                        return (
                            <MakeStore key={market.strId} market={market}/>
                        )
                    }
                    else if(state === "dlv" && market.dlvYn === "Y") {
                        return (
                            <MakeStore key={market.strId} market={market}/>
                        )
                    }
                    else if(state === "all") {
                        return (
                            <MakeStore key={market.strId} market={market}/>
                        )
                    }
                    else {
                        return null
                    }
                } ()
                )}
            </ul>
        </div>
        </>
    )
}

const MakeStore = ({market}) => {
    return (
        <li key={market.strId} >
            {market && 
                <LazyLoad height={100} once >
                    <SingleMarketCmpnt market={market} />
                </LazyLoad>
            }
        </li>
    )
}

function stateClicked(setState, value) {
    setState(value)
}

function radioButtonOnChange(setFilter, id) {
    setFilter(id)
}

function changeFilterClicked(setOpen, callback, filter) {
    setOpen(false);
    callback(filter)
}

export default ListComponent