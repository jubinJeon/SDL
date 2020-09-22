import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {numberFormat} from '../../util/Utils'

export default function AlertDialog({show,data,callback}) {

  const Modal = () => {
    switch(data.type){
      case "MESSAGE" : {
        return (
          <Dialog className="typeMessage" open={show} onClose={callback}>
            <DialogContent className="popInner">
            <div className="alertMsg">
                <p className="title"><strong>{data.title}</strong></p>
                <p className="desc">{data.desc}</p>
            </div>
            </DialogContent>
          </Dialog>
        )
      }
      case "DELIVERY" : {
        return (
          <Dialog open={show}>
            <DialogContent className="popInner" onClose={callback}>
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
                <li><button type="submit" onClick={callback}><strong>확인</strong></button></li>
              </ul>
            </div>
          </Dialog>
        )
      }
      case "LOGIN" : {
        return (
          <Dialog open={show} className="loginAlert">
            <DialogContent className="popInner" onClose={callback}>
              <div className="">
                  <p className="desc">
                    비회원은 주류 구입이 불가합니다.<br />
                    주문하시려면 로그인 해주세요.
                  </p>
              </div>
            </DialogContent>
            <div className="popButton">
              <ul className="buttonArea">
                <li><button className="default" type="submit" onClick={() => callback(1)}><strong>취소</strong></button></li>
                <li><button className="apply" type="submit" onClick={() => callback(0)}><strong>로그인</strong></button></li>
              </ul>
            </div>
          </Dialog>
        )
      }
      case "CONFIRM" : {
        return (
          <Dialog open={show}>
            <DialogContent className="popInner" onClose={callback}>
                <div className="">
                  <p className="title"><strong>{data.title}</strong></p>
                  <p className="desc">{data.desc}</p>
                </div>
            </DialogContent>
            <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={callback}><strong>취소</strong></button></li>
                  <li><button onClick={data.handleComfirm}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      case "ALERT_CONFIRM" : {
        return (
          <Dialog open={show}>
            <DialogContent className="popInner" onClose={callback}>
                <div className="alertMsg">
                  <p className="title"><strong>{data.title}</strong></p>
                  <p className="desc">{data.desc}</p>
                </div>
            </DialogContent>
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={data.handleComfirm}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      case "ALERT_POP" : {
        return (
          <Dialog open={show}>
            <DialogContent className="popInner" onClose={callback}>
                <div className="alertMsg">
                  <p className="title"><strong>{data.title}</strong></p>
                  <p className="desc">
                    {data.desc}
                  </p>
                </div>
            </DialogContent>
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={() => callback(data)}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      case "CONFIRM_POP" : {
        return (
          <Dialog open={show}>
            <DialogContent className="popInner" onClose={callback}>
                <div className="alertMsg">
                  <p className="title"><strong>{data.title}</strong></p>
                  <p className="desc">{data.desc}</p>
                </div>
            </DialogContent>
            <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={() => callback(0)}><strong>취소</strong></button></li>
                  <li><button onClick={() => callback(1)}><strong>확인</strong></button></li>
                </ul>
              </div>
          </Dialog>
        )
      }
      case "DELI_TIP_POP" : {
        return (
          <Dialog open={show}>
            <DialogContent className="popInner" onClose={callback}>
              <div class="popBody">
                      <div class="deliveryTip">
                          <p class="title"><strong>배달팁?</strong></p>
                          <p class="desc">배달팁은 라이더에게 드리는 비용입니다.<br />
                              지역별, 요일/시간 등에 따라 달라질 수 있습니다.
                          </p>
                          <ul class="tipList">
                            {
                              
                              data.tips.map((data) =>{
                                return (
                                  <li>
                                    <span class="leftArea">{data.reason}</span>
                                    <span class="rightArea">{data.prc} 원</span>
                                </li>
                                )
                                
                              })
                            }
                              
                              <li>
                                  <strong class="leftArea">총 배달팁</strong>
                                  <strong class="rightArea">{data.totalTip} 원</strong>
                              </li>
                          </ul>
                      </div>
                  </div>
            </DialogContent>
            <div className="popButton">
                <div class="popButton">
                    <ul class="buttonArea">
                    <li><button type="submit" onClick={() => callback(data)}><strong>확인</strong></button></li>
                    </ul>
                </div>
            </div>
          </Dialog>
        )
      }
      default: {
         return (
          <Dialog open={show}>
            <DialogContent className="popInner" onClose={callback}>
                <div className="alertMsg">
                  <p className="title"><strong>{data.title}</strong></p>
                  <p className="desc">{data.desc}</p>
                </div>
            </DialogContent>
            {data.type === "ALERT" ?
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={callback}><strong>확인</strong></button></li>
                </ul>
              </div>
              :
              <div className="popButton">
                <ul className="buttonArea">
                  <li><button type="submit" onClick={callback}><strong>취소</strong></button></li>
                  <li><button type="submit" onClick={callback}><strong>확인</strong></button></li>
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