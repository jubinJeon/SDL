import React from 'react';
import { Link } from 'react-router-dom';

import * as ACTION from '../common/ActionTypes'

const Joining_Header = (props) => {
    return (
        <div id="header">
            <div className="headerTop">
                <div className="leftArea">
                    <Link to={{pathname: ACTION.LINK_MY_SDL}} className="icon pageClose">CLOSE</Link>
                </div>            
                <div className="middleArea">
                    <h1 className="headerTitle">{props.headerTitle}</h1>
                </div>
            </div>
        </div>
    )
}

export default Joining_Header