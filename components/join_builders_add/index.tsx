import React from 'react';
import cn from 'classnames';

interface Props {
  classname?: string;
  turnBuild?;
  nextBtnAdd?;
}

import styles from './index.module.css';



export default function JoinBuildersAdd({ turnBuild, nextBtnAdd }: Props) {
  const [show, switchShow] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeClear, setCodeClear] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);

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

  const addBuild = () => {
    console.log(555555555);

  }

  return (
    <>
      <div className={styles.containerBox}>
        <div className={styles.container}>
          <div className={styles.topBox}>
            <span>Join Builders</span>
            <span onClick={turnBuild}><img src="/images/guanbi.png" alt="" /></span>
          </div>
          <div className={styles.emailBox}>
            <p>Links to representative works</p>
            <div style={{display:"flex"}}>
            <input
              type="text"
              placeholder=""
              value={email}
              onInput={setEmailValue}
              onFocus={() => {
                if (email) {
                  setEmailClear(true);
                }
              }}
              onBlur={emailBlue}
            />
           
             <span onClick={addBuild} className={styles.add}><img src="/images/tianjia.png" alt="" /></span>
             </div>
           <p className={styles.send}>You can also send your works to our：
           <img src="/images/youxiang.png" alt="" />
           <img src="/images/ttt.png" alt="" />
           
           </p>
            <div className={styles.next} onClick={nextBtnAdd}>Submit</div>
          </div>
        </div>
      </div>
    </>
  )
}
