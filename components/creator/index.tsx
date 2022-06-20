import React from 'react';
import cn from 'classnames';
import style from './index.module.css';

type Props = {
  onClick?;
  email?: string;
  address?: string;
};

export default function Creator({ onClick, email, address }: Props) {
  const [elamilValue, setEmailValue] = React.useState(email || '');
  const [value, setValue] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);

  const changeEmailValue = React.useCallback((event) => {
    setValue(event.target.value);
    if (event.target.value) {
      setEmailClear(true);
    } else {
      setEmailClear(false);
    }
  }, []);
  return (
    <>
      <div className={style.container}>
        <div className={style.bg} onClick={onClick}></div>
        <div className={cn(style.requestCard)} style={{ height: `${email ? '350px' : '460px'}` }}>
          <div className={style.header}>
            Creator Display
            <img src="/images/guanbi.png" onClick={onClick} />
          </div>
          <div className={style.detail}>
            <div className={style.address}>Wallet address</div>
            <div className={style.text}>{address}</div>

            <div className={elamilValue ? style.email : style.address}>Email</div>
            {!elamilValue ? (
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
                  />
                  <span
                    className={cn('inline-flex items-center ml-5', style.icon)}
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
              </>
            )}
            <div className={style.submit}>Submit</div>
          </div>
        </div>
      </div>
    </>
  );
}
