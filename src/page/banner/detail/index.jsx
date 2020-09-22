import React, {useContext} from 'react'
import {Link} from 'react-router-dom';
import {SDLContext} from '../../../context/SDLStore'

import * as ACTION from '../../../common/ActionTypes'

const BannerDetail = ({ history, location}) => {

    const {dispatch,data} = useContext(SDLContext);

    return (
        <div id="wrap">
            <div id="header">
                <div className="headerTop">
                    <div className="leftArea">
                        <Link to={{pathname: ACTION.LINK_HOME,state : {from : data.mainLocation}}} className="icon pageClose"></Link>
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

export default BannerDetail