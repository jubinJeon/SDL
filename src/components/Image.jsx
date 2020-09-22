import React from 'react'


function Image({src,alt,local = false}){
    return <img src={local ? src : src} alt={alt} onError={(e)=>{e.target.onerror = null; e.target.src="/common/images/no_image.png"}}/>
}

export default Image