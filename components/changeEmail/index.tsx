import React from 'react';
import cn from 'classnames';
import { toast } from 'react-hot-toast';
import style from './index.module.css';
import { getToken } from '../../common/utils';
import {
  req_bind_send_email,
  req_bind_ver_email_code,
  req_modify_send_email,
  req_modify_old_email_ver_code,
} from '../../service/z_api';

type Props = {
  state: boolean;
  closeEmail?;
  value?: string;
  modifyEmail?: boolean;
};
export default function ChangeEmail({ state, closeEmail, value, modifyEmail }: Props) {
  const [email, setEmail] = React.useState(value);
  const [code, setCode] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeClear, setCodeClear] = React.useState(false);
  const time = React.useRef(60);
  const [codeState, setCodeState] = React.useState('getCode');
  const [token, setToken] = React.useState('');

  const timeId = React.useRef(null);

  React.useEffect(() => {
    setEmail(value);
    const t = getToken('atk');
    setToken(t);
  }, [value]);

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

  const emailBlue = React.useCallback(() => {
    setEmailClear(false);
  }, []);

  const codeBlue = React.useCallback(() => {
    setCodeClear(false);
  }, []);

  const deleteCode = React.useCallback(() => {
    setCode('');
    setCodeClear(false);
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
      await req_modify_send_email(token);
    } else {
      await req_bind_send_email(email, token);
    }
  }, [time, email, modifyEmail, timeOut]);

  const sendCode = React.useMemo(() => {
    return (
      <>
        {codeState === 'getCode' ? (
          <div className={cn(email ? style.getCode : style.getCode2)} onClick={sendCodeTime}>
            Get Code
          </div>
        ) : null}
        {codeState === 'time' ? <div className={style.time}>{time.current} s</div> : null}
        {codeState === 'reacquire' ? (
          <div className={style.reacquire} onClick={sendCodeTime}>
            reacquire
          </div>
        ) : null}
      </>
    );
  }, [sendCodeTime, codeState, email]);

  const bindOrChangeEmail = React.useCallback(async () => {
    closeEmail();
    setCodeState('getCode');
    setCode('');
    if (!email && !code) return;
    let result = null;

    if (modifyEmail) {
      result = await req_modify_old_email_ver_code(code.toString(), token);
      if (result.code === 100000) {
        closeEmail('modify');
      } else if (result.code === 100013) {
        toast.error('Invalid verification code');
      } else {
        toast.error('Verification code error');
      }
    } else {
      result = await req_bind_ver_email_code(code.toString(), token);
      if (result.code === 100000) {
        closeEmail('bind');
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
  }, [email, code, modifyEmail]);

  if (state && !modifyEmail) {
    return (
      <div className={cn('w-full,h-full', style.container)}>
        <div className={style.bg}></div>
        <div className={style.popup}>
          <div className={style.header}>
            <img
              src="/images/guanbi.png"
              onClick={() => {
                closeEmail();
                setCodeState('getCode');
                setCode('');
              }}
            />
            <div className={style.title}>Binding email</div>
          </div>
          <div className={style.body}>
            <div className={style.email}>
              <div className={style.title}>Email</div>
              <div className={style.emailInput}>
                <input
                  type="text"
                  placeholder="Email address"
                  value={email}
                  onInput={setEmailValue}
                  onFocus={() => {
                    if (email) {
                      setEmailClear(true);
                    }
                  }}
                  onBlur={emailBlue}
                />
                <span
                  className={cn('inline-flex items-center ml-5', style.icon)}
                  onMouseDown={() => {
                    setEmail('');
                  }}
                >
                  <img
                    src="/images/close.png"
                    className={cn(emailClear ? 'inline-flex' : ' hidden', style.icon)}
                  />
                </span>
              </div>
            </div>
            <div className={style.code}>
              <div className={style.title}>Code</div>
              <div className={style.inputContainer}>
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
                <span
                  className={cn(' items-center ', style.icon)}
                  onMouseDown={() => {
                    setCode('');
                  }}
                >
                  <img
                    src="/images/close.png"
                    className={cn(codeClear ? null : ' hidden', style.icon)}
                  />
                </span>
                {sendCode}
              </div>
            </div>
            <div
              className={cn(style.save, code && email ? style.high : null)}
              onClick={bindOrChangeEmail}
              style={{
                width: '120px',
                textAlign: 'center',
                height: '42px',
                lineHeight: '42px',
                marginLeft: '120px',
                color: 'black',
                backgroundColor: 'rgba(0,208,236,1)',
              }}
            >
              Save
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state && modifyEmail) {
    return (
      <div className={cn('w-full,h-full', style.container)}>
        <div className={style.bg}></div>
        <div className={style.popup}>
          <div className={style.header}>
            <img
              src="/images/guanbi.png"
              onClick={() => {
                closeEmail();
                setCodeState('getCode');
                setCode('');
              }}
            />
            <div className={style.title}>Modify email</div>
          </div>
          <div className={style.body}>
            <div className={style.email}>
              <div className={style.title}>Original email address</div>
              <div className={style.emailInput}>
                <input
                  type="text"
                  className={style.modifyEmailInput}
                  placeholder={modifyEmail ? '' : 'Email address'}
                  disabled={modifyEmail}
                  value={email}
                  onInput={setEmailValue}
                  onFocus={() => {
                    if (email) {
                      setEmailClear(true);
                    }
                  }}
                  onBlur={emailBlue}
                />
              </div>
            </div>
            <div className={style.code}>
              <div className={style.title}>Code</div>
              <div className={style.inputContainer}>
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
                <span
                  className={cn(' items-center ', style.icon)}
                  onMouseDown={() => {
                    setCode('');
                  }}
                >
                  <img
                    src="/images/close.png"
                    className={cn(codeClear ? null : ' hidden', style.icon)}
                  />
                </span>

                {sendCode}
              </div>
            </div>
            <div
              className={cn(style.save, code && email ? style.high : null)}
              onClick={bindOrChangeEmail}
            >
              Next
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
