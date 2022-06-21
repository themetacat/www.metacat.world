import React from 'react';
import cn from 'classnames';
import { toast } from 'react-hot-toast';
import style from './index.module.css';

import {
  req_bind_send_email,
  req_bind_ver_email_code,
  req_modify_send_email,
  req_modify_old_email_ver_code,
  req_user_apply_become,
} from '../../service/z_api';

type Props = {
  onClick?;
  email?: string;
  address?: string;
  token?;
};

export default function Creator({ onClick, email, address, token }: Props) {
  const [elamilValue, setEmailValue] = React.useState(email || '');
  const [value, setValue] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeState, setCodeState] = React.useState('getCode');
  const [code, setCode] = React.useState('');
  const [codeClear, setCodeClear] = React.useState(false);
  const time = React.useRef(60);
  const timeId = React.useRef(null);

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
    if (!value) return;
    toast.success('The verification code has been sent');
    setCodeState('time');
    const t = timeOut();
    timeId.current = t;
    await req_bind_send_email(value, await token);
  }, [time, value, value, timeOut]);

  const changeEmailValue = React.useCallback((event) => {
    setValue(event.target.value);
    if (event.target.value) {
      setEmailClear(true);
    } else {
      setEmailClear(false);
    }
  }, []);

  const sendCode = React.useMemo(() => {
    return (
      <>
        {codeState === 'getCode' ? (
          <div className={cn(value ? style.getCode : style.getCode2)} onClick={sendCodeTime}>
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
  }, [sendCodeTime, codeState, elamilValue, value]);

  const setCodeValue = React.useCallback((e) => {
    setCode(e.target.value);
    if (e.target.value) {
      setCodeClear(true);
    } else {
      setCodeClear(false);
    }
  }, []);

  const submit = React.useCallback(async () => {
    if (value && code) {
      const res = await req_bind_ver_email_code(code, await token, 'creator');
      if (res.code === 100000) {
        onClick(true);
        toast.success('Submitted successfully');
      }
    } else {
      const res = await req_user_apply_become('creator', await token);
      if (res.code === 100000) {
        onClick(true);
        toast.success('Submitted successfully');
      }
    }
  }, [address, value, code]);

  // React.useEffect(() => {
  // }, [null])
  return (
    <>
      <div className={style.container}>
        <div
          className={style.bg}
          onClick={() => {
            onClick(false);
          }}
        ></div>
        <div
          className={cn(style.requestCard)}
          style={{ height: `${elamilValue ? '350px' : '460px'}` }}
        >
          <div className={style.header}>
            Creator Display
            <img
              src="/images/guanbi.png"
              onClick={() => {
                onClick(false);
              }}
            />
          </div>
          <div className={style.detail}>
            <div className={style.address}>Wallet address</div>
            <div className={style.text}>{address}</div>

            <div className={!elamilValue ? style.email : style.address}>Email</div>
            {elamilValue ? (
              <>
                <div className={style.text}>{email}</div>
              </>
            ) : (
              <>
                <div className={style.hint}>This mailbox also works for personal information</div>
                <div className={style.emailInput}>
                  <input
                    placeholder="email"
                    type="text"
                    value={value}
                    onInput={changeEmailValue}
                    onFocus={() => {
                      if (value) {
                        setEmailClear(true);
                      }
                    }}
                    onBlur={() => {
                      setEmailClear(false);
                    }}
                  />
                  <span
                    className={cn('inline-flex items-center ml-5', style.emailClear)}
                    onMouseDown={() => {
                      setValue('');
                    }}
                  >
                    <img
                      src="/images/close.png"
                      className={cn(emailClear ? 'inline-flex' : ' hidden', style.icon)}
                    />
                  </span>
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
                      onBlur={() => {
                        setCodeClear(false);
                      }}
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
              </>
            )}

            <div className={style.submit} onClick={submit}>
              Submit
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
