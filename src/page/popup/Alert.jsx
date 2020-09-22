import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

export default function AlertDialog(props) {

  const Modal = () => {
    switch(props.data.type){
      case "MESSAGE" : {
        return (
          <Dialog className="typeMessage" open={props.open} onClose={props.handleClose}>
            <DialogContent className="popInner">
            <div className="alertMsg">
                <p className="title"><strong>{props.data.title}</strong></p>
                <p className="desc">{props.data.desc}</p>
            </div>
            </DialogContent>
          </Dialog>
        )
      }
      case "DELIVERY" : {
        return (
          <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent className="popInner">
              <div className="deliveryTip">
                  <p className="title"><strong>배달팁?</strong></p>
                  <p className="desc">배달팁은 라이더에게 드리는 비용입니다.<br />
                      지역별, 요일/시간 등에 따라 달라질 수 있습니다.
                  </p>
                  <ul className="tipList">
                      <li>
                          <span className="leftArea">지역별 (신도림동)</span>
                          <span className="rightArea">2,500원</span>
                      </li>
                      <li>
                          <strong className="leftArea">총 배달팁</strong>
                          <strong className="rightArea">2,500원</strong>
                      </li>
                  </ul>
              </div>
            </DialogContent>
            <div className="popButton">
              <ul className="buttonArea">
                <li><button type="submit" onClick={props.handleClose}><strong>확인</strong></button></li>
              </ul>
            </div>
          </Dialog>
        )
      }
      case "LOGIN" : {
        return (
          <Dialog open={props.open} onClose={props.handleClose} className="loginAlert">
            <DialogContent className="popInner">
              <div className="">
                  <p className="desc">
                    비회원은 주류 구입이 불가합니다.<br />
                    주문하시려면 로그인 해주세요.
                  </p>
              </div>
            </DialogContent>
            <div className="popButton">
              <ul className="buttonArea">
                <li><button className="default" type="submit" onClick={props.handleClose}><strong>확인</strong></button></li>
                <li><button className="apply" type="submit" onClick={props.handleClose}><strong>로그인</strong></button></li>
              </ul>
            </div>
          </Dialog>
        )
      }
      case "CONFIRM" : {
        return (
          <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent className="popInner">
                <div className="">
                  <p className="title"><strong>{props.data.title}</strong></p>
                  <p className="desc">{props.data.desc}</p>
                </div>
            </DialogContent>
            <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={props.handleClose}><strong>취소</strong></button></li>
                  <li><button onClick={props.data.handleComfirm}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      case "ALERT_CONFIRM" : {
        return (
          <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent className="popInner">
                <div className="">
                  <p className="title"><strong>{props.data.title}</strong></p>
                  <p className="desc">{props.data.desc}</p>
                </div>
            </DialogContent>
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={props.data.handleComfirm}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      case "ALERT_POP" : {
        return (
          <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent className="popInner">
                <div className="">
                  <p className="title"><strong>{props.data.title}</strong></p>
                  <p className="desc">{props.data.desc}</p>
                </div>
            </DialogContent>
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={props.data.handleComfirm}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      case "CONFIRM_POP" : {
        return (
          <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent className="popInner">
                <div className="">
                  <p className="title"><strong>{props.data.title}</strong></p>
                  <p className="desc">{props.data.desc}</p>
                </div>
            </DialogContent>
            <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={() => props.callback(0)}><strong>취소</strong></button></li>
                  <li><button onClick={() => props.callback(1)}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      default: {
         return (
          <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent className="popInner">
                <div className="">
                  <p className="title"><strong>{props.data.title}</strong></p>
                  <p className="desc">{props.data.desc}</p>
                </div>
            </DialogContent>
            {props.data.type === "ALERT" ?
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={props.handleClose}><strong>확인</strong></button></li>
                </ul>
              </div>
              :
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={props.handleClose}><strong>취소</strong></button></li>
                  <li><button type="submit" onClick={props.handleClose}><strong>확인</strong></button></li>
                </ul>
              </div>
            }
          </Dialog>
        )
      }
    }
  }

  return (
    <div>
        <Modal />
    </div>
  );
}