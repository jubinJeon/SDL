import React , {useEffect,useContext} from 'react';
import { Route,BrowserRouter} from 'react-router-dom';

import './App.css';

import './styles/css/lib/swiper.css'
import './styles/css/style.css'
import './styles/css/test.css'
import Routes from './routes'

import SDLStore,{SDLContext} from './context/SDLStore'
import Modal from './page/popup/Modal'
import ToastPopUp from './page/popup/Toast';
import TermsPopUp from './page/popup/TermsPopUp';
import {REDUCER_ACTION} from './context/SDLReducer'
import withClearCache from "./ClearCache";

const ClearCacheComponent = withClearCache(SDLStore);

function App() {

  return (
    <SDLStore>
      <ClearCacheComponent />
      <SDLContainer />
      <Portal/>
    </SDLStore>
  );
}

const SDLContainer = () => {

  const {dispatch} = useContext(SDLContext)

  const nativeEventCallback = (event) => {
    
    console.log('nativeEventCallback',event)
    const type = event.detail.type
    const data = event.detail.data
    
    switch(type) {
      case 'BACK' :
        dispatch({type : 'HISTORY', payload : {action : 'BACK' }})
      break
      case REDUCER_ACTION.CLOSE_WIN_POP :
        dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})
      break;
      case 'QRCODE' :
      console.log('nativeEventCallback QRCODE',data.storeId)
      break
      case 'NOTIFICATION_WHEN_IN_BACKGROUND' :
        console.log('nativeEventCallback NOTIFICATION_WHEN_IN_BACKGROUND!!!',event.detail.data)
        dispatch({type : REDUCER_ACTION.SAVE_NOTIFICATION, payload : {status : 'NOTIFICATION_WHEN_IN_BACKGROUND', data: event.detail.data }})
      break
      case 'NOTIFICATION_WHEN_IN_FOREGROUND' :
        console.log('nativeEventCallback NOTIFICATION_WHEN_IN_FOREGROUND!!!',event.detail.data)
        dispatch({type : REDUCER_ACTION.SAVE_NOTIFICATION, payload : {status : 'NOTIFICATION_WHEN_IN_FOREGROUND', data: event.detail.data }})
      break
      default:
    }
  }

  useEffect(()=>{
    window.addEventListener('SDL_nativeEvent',nativeEventCallback)

    return () =>{
      window.removeEventListener('SDL_nativeEvent',nativeEventCallback)
    }
  },[])

  return (
    <>
      <BrowserRouter>
        <Route render={
          ({ location }) => {
              return (
                <Routes location = {location}/>
              );
            }
          }
          />
      </BrowserRouter>
    </>
  )
}

const Portal = () => {

  const {data} = useContext(SDLContext)

  return (
    <>
      <Modal show={data.modal.show} data={data.modal.data} callback={data.modal.callback}></Modal>
      <ToastPopUp show={data.toast.show} callback={data.toast.callback} data={data.toast.data} />
      <TermsPopUp show={data.terms.show} callback={data.terms.callback} data={data.terms.data} />
    </>
  )
}

export default App;
