import React,{useCallback} from 'react';
import cn from 'classnames';

import { toast } from 'react-hot-toast';

import styles from './index.module.css';

import { getToken } from '../../common/utils';

import JoinBuildersAdd from '../join_builders_add';

import {
  req_bind_send_email,
  req_bind_ver_email_code,
  req_modify_send_email,
  req_modify_old_email_ver_code,
  req_userBuilder_apply_become,
  req_building_list,
} from '../../service/z_api';
import { getBaseInfo, refreshToken, getParcelList2 } from '../../service';

interface Props {
  classname?: string;
  turnOff?;
  nextBtn?;
  stateVal?;
  editStateVal?;
  value?: string;
  modifyEmail?: boolean;
  clickHeader?;
}

export default function JoinBuilders({ turnOff, stateVal,editStateVal,clickHeader, value, modifyEmail }: Props) {
  const [showState, setShow] = React.useState('');
  const [code, setCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeClear, setCodeClear] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [tokenVal, setTokenVal] = React.useState('');
  const [codeState, setCodeState] = React.useState('getCode');
  const [tabStateTR, setTabStateTR] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');
  const time = React.useRef(60);
  const timeId = React.useRef(null);

  //   React.useEffect(() => {
  //     const listener = () => {
  //       switchShow(window.scrollY > 300);
  //     };
  //     document.addEventListener('scroll', listener);
  //     return () => document.removeEventListener('scroll', listener);
  //   }, [show]);
  const dragJoin = function (evt, dbele?) {
    dbele = document.querySelector('.join_builders_add_container__JytZM' || '')
    // ele.onmousedown = function (evt) {
    const oEvent = evt;
    const disX = oEvent.clientX - dbele.offsetLeft;
    const disY = oEvent.clientY - dbele.offsetTop;
    document.onmousemove = function (evts) {
      // console.log(evts);
      const evtUp = evts;
      let leftX = evtUp.clientX - disX;
      let topY = evtUp.clientY - disY;

      if (
        leftX >
        document.querySelector("#container").clientWidth - dbele.offsetWidth
      ) {
        leftX =
          document.body.clientWidth -
          dbele.offsetWidth;
      }
      if (leftX < 0) {
        leftX = 0;
      }
      if (
        topY >
        document.querySelector("#container").clientHeight -
        dbele.offsetHeight
      ) {
        topY =
          document.body.clientHeight -
          dbele.offsetHeight;
      }
      if (topY < 0) {
        topY = 0;
      }
      // if (dbele) {
      //   dbele.style.left = leftX + "px";
      //   dbele.style.marginLeft = 0 + "px";
      //   dbele.style.marginTop = 0 + "px";
      //   // dbele.style.marginBottom = 50 + "px";
      //   dbele.style.top = topY + "px";
      //   dbele.style.zIndex = "999999";
      // } else {
      //   return false;
      // }
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
  const setEmailValue = React.useCallback((e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setEmailClear(true);
    } else {
      setEmailClear(false);
    }
  }, []);
  const setCodeValue = React.useCallback((e) => {
    setCode(e.target.value);
    if (e.target.value) {
      setCodeClear(true);
    } else {
      setCodeClear(false);
    }
  }, []);

  const codeBlue = React.useCallback(() => {
    setCodeClear(false);
  }, []);
  const emailBlue = React.useCallback(() => {
    setEmailClear(false);
  }, []);


  const timeOut = () => {
    return setInterval(function () {
      if (time.current === 0) {
        setCodeState('reacquire');
        clearInterval(timeId.current);
        time.current = 60;
      } else {
        setCodeState('');
        setCodeState('time');
        time.current = time.current - 1;
      }
    }, 1000);
  };
  const sendCodeTime = React.useCallback(async () => {
    if (!email) return;
    toast.success('The verification code has been sent');
    setCodeState('time');
    const t = timeOut();
    timeId.current = t;
    if (modifyEmail) {
      await req_modify_send_email(tokenVal);
    } else {
      await req_bind_send_email(email, tokenVal);
    }
  }, [time, email, modifyEmail, timeOut]);
  const sendCode = React.useMemo(() => {
    return (
      <>
        {codeState === 'getCode' ? (
          <div className={cn(email ? styles.getCode : styles.getCode2)} onClick={sendCodeTime}>
            Get Code
          </div>
        ) : null}
        {codeState === 'time' ? <div className={styles.time}>{time.current} s</div> : null}
        {codeState === 'reacquire' ? (
          <div className={styles.reacquire} onClick={sendCodeTime}>
            reacquire
          </div>
        ) : null}
      </>
    );
  }, [sendCodeTime, codeState, email]);

  const nextBtn = React.useCallback(async () => {
    setJoinBuilders(false)
    if (!email && !code) return;
    let result = null;

    if (modifyEmail) {
      // result = await req_modify_old_email_ver_code(code.toString(), token);
      // if (result.code === 100000) {
      //   closeEmail('modify');
      // } else if (result.code === 100013) {
      //   toast.error('Invalid verification code');
      // } else {
      //   toast.error('Verification code error');
      // }
    } else {
      result = await req_bind_ver_email_code(code.toString(), tokenVal);
      if (result.code === 100000) {
        // closeEmail('bind');
      } else if (result.code === 100013) {
        toast.error('Invalid verification code');
      } else {
        toast.error('Verification code error');
      }
    }
    setCode('');
    setCodeClear(false);
    setCodeState('getCode');
    clearInterval(timeId.current);
    time.current = 60;
    setJoinBuilders(false)
    setTabStateTR(true)

  }, [email, code, modifyEmail]);

  const turnBuild = () => {
    setTabStateTR(false)
  }

  // const nextBtnAdd = () => {
  //   // setTabStateTR(false)
  //   //   console.log(token);

  //   //    const res =  req_userBuilder_apply_become(token,'builder',buildData.toString());

  //   //    setTabStateTR(false)
  //   //  }
  //   // setTabStateTR(false)
  // }
  const nextBtnAdd = useCallback((token: string, buildData: any) => {


    const res = req_userBuilder_apply_become(token, 'builder', buildData.toString());

    setTabStateTR(false)
    res.then((resM) => {
      if (resM.code === 100000) {
        const resbui = getBaseInfo(token);
        resbui.then((resbuiCon) => {
          if(resM.code === 100000){
          
            const buildNum = resbuiCon.data.profile.builder_status
            editStateVal(buildNum)
            
            // resBuil.then(()=>{
            // })
            // console.log(buildNum);
          }
         

        })
      }

    })

  }, [])
  React.useEffect(() => {
    setEmail(value);
    setJoinBuilders(true)
    const t = getToken('atk');
    setTokenVal(t);
    const a = getToken('address');
    if (a) {
      setWalletAddress(a);
    }
    
  }, [value,walletAddress]);

  return (
    <>
      {joinBuilders === true ?
        <>
          <div className={styles.containerBox}>
            <div className={styles.container}>
              <div className={styles.topBox}   onMouseDown={clickHeader}>
                <span>Join Builders</span>
                <span onClick={turnOff}><img src="/images/guanbi.png" alt="" /></span>
              </div>
              <div className={styles.emailBox}>
                <p>Email</p>
                <p>This mailbox also works for personal information</p>
                <input
                  type="text"
                  placeholder="email"
                  value={email}
                  onInput={setEmailValue}
                  onFocus={() => {
                    if (email) {
                      setEmailClear(true);
                    }
                  }}
                  onBlur={emailBlue}
                />
                <p className={styles.codeText}>Code</p>
                <div className={styles.getCodeBox}>
                  <input
                    type="text"
                    placeholder="Code"
                    value={code}
                    onInput={setCodeValue}
                    onFocus={() => {
                      if (code) {
                        setCodeClear(true);
                      }
                    }}
                    onBlur={codeBlue}
                  />
                  <span className={styles.a}></span>
                  {/* <div className={styles.n} onClick={GetCode}>Get code</div> */}
                  <div className={styles.n}> {sendCode}</div>

                </div>
                <div className={styles.next} onClick={nextBtn}>Next</div>
              </div>
            </div>
          </div>
        </>
        : ''}

      {tabStateTR === true ? <>
        <JoinBuildersAdd
          turnBuild={turnBuild}
          nextBtnAdd={nextBtnAdd}
          clickHeader={dragJoin}
        />
      </> : ''}
    </>
  )
}
