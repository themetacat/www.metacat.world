import React from 'react';
import cn from 'classnames';


import { toast } from 'react-hot-toast';

import styles from './index.module.css';

import { getToken } from '../../common/utils';

import {
  req_bind_send_email,
  req_bind_ver_email_code,
  req_modify_send_email,
  req_modify_old_email_ver_code,
} from '../../service/z_api';

interface Props {
  classname?: string;
  turnOff?;
  nextBtn?;
  value?: string;
  modifyEmail?: boolean;
  nextBtnAdd?;
  addBuildOther?;
}



export default function JoinBuilders({ turnOff, value, nextBtn, nextBtnAdd, modifyEmail }: Props) {
  const [show, switchShow] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeClear, setCodeClear] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [codeState, setCodeState] = React.useState('getCode');
  const [subLength, setSubLength] = React.useState(1);
  const [subArr, setSubArr] = React.useState([1]);
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


  const emailBlue = React.useCallback(() => {
    setEmailClear(false);
  }, []);


  const addBuildOther = () => {
    console.log(subLength,);
    if(subLength>9){
      return false;
    }
    let newNum = subLength;
    newNum+=1;
    const newArr =[]
    for (let index = 0; index < newNum; index+=1) {
      newArr.push(index)
      
    }
    console.log(newArr,newNum);
    console.log(new Array(subLength),subLength);
    setSubLength(newNum)
    
    setSubArr(newArr)

  }

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

  React.useEffect(() => {
    setEmail(value);
    const t = getToken('atk');
    setToken(t);
  }, [value]);

  return (
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
            {/* <p className={styles.codeText}>Code</p>
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
              <div className={styles.n}> {sendCode}</div> */}
            <div className={styles.emailBoxCon}>
              <p>Links to representative works</p>
              <div style={{ }}>
                {
               subArr.map((item,index)=>
                    (
                    <input
                    style={{ width: "350px" }}
                    id="addBuilding"
                    type="text"
                    placeholder=""
                    value={code}
                    onInput={setCodeValue}
                    onFocus={() => {
                      if (code) {
                        setCodeClear(true);
                      }
                    }}
                    onBlur={codeBlue}
                  />
                   )
                 )
                }
               

               <span onClick={addBuildOther} className={styles.add}><img src="/images/tianjia.png" alt="" /></span>
              </div>
              <p className={styles.send}>You can also send your works to our：
                <img src="/images/youxiang.png" alt="" />
                <img src="/images/ttt.png" alt="" />

              </p>
              <div className={styles.next} onClick={nextBtnAdd}>Submit</div>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}
