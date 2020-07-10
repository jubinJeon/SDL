import React from 'react'


function Image({src,art,local = false}){
    return <img src={local ? src : 'http://images.kisvan.co.kr/smartorder/' +  src} art={art}/>
}

export default Image