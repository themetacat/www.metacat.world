import React from 'react';
import cn from 'classnames';

import { toast } from 'react-hot-toast';

import styles from './index.module.css';

import { getToken } from '../../common/utils';

import JoinBuildersAdd from '../../components/join_builders_add';

import {
  req_bind_send_email,
  req_bind_ver_email_code,
  req_modify_send_email,
  req_modify_old_email_ver_code,
  req_userBuilder_apply_become,
} from '../../service/z_api';

interface Props {
  classname?: string;
  turnOff?;
  nextBtn?;
  value?: string;
  modifyEmail?: boolean;
}

export default function JoinBuilders({ turnOff, value ,modifyEmail}: Props) {
  const [show, switchShow] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeClear, setCodeClear] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [codeState, setCodeState] = React.useState('getCode');
  const [tabStateTR, setTabStateTR] = React.useState(false);
  const time = React.useRef(60);
  const timeId = React.useRef(null);

  //   React.useEffect(() => {
  //     const listener = () => {
  //       switchShow(window.scrollY > 300);
  //     };
  //     document.addEventListener('scroll', listener);
  //     return () => document.removeEventListener('scroll', listener);
  //   }, [show]);
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

  const GetCode = () => {

  }
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
      await req_modify_send_email(token);
    } else {
      await req_bind_send_email(email, token);
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
      result = await req_bind_ver_email_code(code.toString(), token);
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
  const nextBtnAdd = (token: string, buildData: any) => {
    console.log(token);

    const res = req_userBuilder_apply_become(token, 'builder', buildData.toString());

    setTabStateTR(false)
  }
  React.useEffect(() => {
    setEmail(value);
    setJoinBuilders(true)
    const t = getToken('atk');
    setToken(t);
  }, [value]);

  return (
    <>
    {joinBuilders===true?
    <>
<div className={styles.containerBox}>
        <div className={styles.container}>
          <div className={styles.topBox}>
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
    :''}
      
      {tabStateTR === true ? <>
        <JoinBuildersAdd
          turnBuild={turnBuild}
          nextBtnAdd={nextBtnAdd}
        />
      </> : ''}
    </>
  )
}
