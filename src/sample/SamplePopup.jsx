import React,{useState} from 'react'
import Alert from '../page/popup/Alert'

const SamplePopup = () =>{

    const [modal, setModal] = useState({
        showModal: false,
        dataModal: {
            type: "",
            title: "",
            desc: ""
        }
    })

    const handleClickOpen = (data) => {
        setModal({
            showModal: true,
            dataModal: data
        })
    };

    const handleClose = () => {
        setModal({ ...modal, showModal: false });
    };
    
    return (
        <>
            <div>
                <ul>
                    <li>
                        <button type="button" onClick={()=>{
                            handleClickOpen({
                                type : "LOGIN",
                                })
                            }}>
                            LOGIN
                        </button>
                    </li>
                    <li>
                        <button type="button" onClick={()=>{
                            handleClickOpen({
                                type : "CONFIRM",
                                title : "",
                                desc : "CONFIRM 컨텐츠"
                                })
                            }}>
                            CONFIRM
                        </button>
                    </li>
                    <li>
                        <button type="button" onClick={()=>{
                            handleClickOpen({
                                type : "ALERT",
                                title : "",
                                desc : "ALERT 컨텐츠"
                            })
                        }}>
                            ALERT
                        </button>
                    </li>
                    <li>
                        <button type="button" onClick={()=>{
                            handleClickOpen({
                                type : "MESSAGE",
                                title : "[슬배생] 내린천(양양방향)휴게소",
                                desc : "내린천(양양방향)휴게소에 오신걸 환영합니다."
                            })
                        }}>
                            MESSAGE
                        </button>
                    </li>
                </ul>
            </div>
            <Alert open={modal.showModal} data={modal.dataModal} handleClose={handleClose}></Alert>
        </>
    )
}



export default SamplePopup