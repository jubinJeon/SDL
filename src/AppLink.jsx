import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {getOS,getQueryStringParams} from './util/Utils'

const QRCode = () => {

  const location = useLocation();

  useEffect(()=>{

    console.log('qrcode location',location)

    const os = getOS()

    const search = getQueryStringParams(location.search)

    if(os === 'Android'){
      // const domain = `${process.env.REACT_APP_DOMAIN}` + '?strId=ST00000332&storeCd=S'
      const domain = `${process.env.REACT_APP_DOMAIN}?strId=${search.strId}&storeCd=${search.storeCd}`
      const uri = `intent://${domain}#Intent;scheme=${process.env.REACT_APP_SCHEMA};package=${process.env.REACT_APP_PACKAGE};end`
      console.log('qrcode uri',uri)
      window.location.href = uri

    }else if(os === 'IOS'){

      const domain = `${process.env.REACT_APP_DOMAIN}?strId=${search.strId}&storeCd=${search.storeCd}`
      const uri = `${process.env.REACT_APP_SCHEMA}://${domain}`
      const appStoreUrl = `${process.env.REACT_APP_APPLE_APP_STORE_URL}`

      var visiteTm = new Date().getTime();
      setTimeout( function () { if ( ( new Date() ).getTime() - visiteTm < 3000 ) { // 앱스토어 이동 
        window.location.href = appStoreUrl } 
      } ,2500 ); 

      setTimeout( function () { // 앱실행 
        window.location.href = uri
      } ,0 );

    }

  },[])
  return <></>
}

export default QRCode
