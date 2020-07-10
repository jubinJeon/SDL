import React , {useEffect,useContext} from 'react';
import { Route,BrowserRouter,useHistory} from 'react-router-dom';

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


function App() {

  return (
    <SDLStore>
      <SDLContainer />
      <Portal/>
    </SDLStore>
  );
}

const SDLContainer = () => {

  const {dispatch,data} = useContext(SDLContext)


  const modalCallback = () => {
    dispatch({type : REDUCER_ACTION.HIDE_MODAL, payload : {show : false }})
  }

  const nativeEventCallback = (event) => {
    
    const type = event.detail.type;
    console.log('asdasdasdjasgdhagsjdgjsa')
    switch(type){
      case 'BACK' :
        console.log('nativeEventCallback',data)
        dispatch({type : 'HISTORY', payload : {action : 'BACK' }})
        break
        case 'PUSH' :
        // dispatch({type:REDUCER_ACTION.SHOW_ALERT, payload:{ data : { title: event.detail.data.title, desc : event.detail.data.body}, callback : modalCallback}})
        // dispatch({type : 'MODAL', payload : {show : true , data : {type : 'ALERT', title: event.detail.data.title, desc : event.detail.data.body} , callback : modalCallback}})
        dispatch({
          type: REDUCER_ACTION.SHOW_ALERT, 
          payload : {data : {title: event.detail.data.title , desc : event.detail.data.body, code : 100},
          callback : () => {
            dispatch({type : REDUCER_ACTION.HIDE_ALERT})
          }
      }})
        break;
        case REDUCER_ACTION.CLOSE_WIN_POP :
          console.log('asdasdasdjasgdhagsjdgjsa')
        dispatch({type : REDUCER_ACTION.CLOSE_WIN_POP})
        break;
        
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
              const { pathname } = location;
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
