import React, {useEffect} from 'react'
import {Link} from 'react-router-dom';

import * as ACTION from '../../../common/ActionTypes'

export default ({ history, location}) => {

    const onClickBackBtn = (e) => {
        e.preventDefault();
        history.replace(ACTION.LINK_HOME);
    };
    
    useEffect(()=>console.log(location))
    
    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <Link to={{
                            pathname : "/"
                        }} className="icon pageClose">CLOSE</Link>
                        {/* <a href="#" onClick={onClickBackBtn} className="icon pageClose">CLOSE</a> */}
                    </div>
                </div>
            </div>
            <div id="container">
                <div id="content">
                    <div className="">
                        <div className="bannerWrap">
                            <div className="bannerDetail" onClick={location.imgOnClickfunc}>
                                <img src={location.img} alt="이벤트" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
