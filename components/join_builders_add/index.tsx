import React from 'react';
import cn from 'classnames';

import { toast } from 'react-hot-toast';

import styles from './index.module.css';

interface Props {
  classname?: string;
  turnBuild?;
  nextBtnAdd?;
}

export default function JoinBuildersAdd({ turnBuild, nextBtnAdd }: Props) {
  const [show, switchShow] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [email, setEmail] = React.useState(null);
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeClear, setCodeClear] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [subLength, setSubLength] = React.useState(1);
  const [subArr, setSubArr] = React.useState([1]);

  //   React.useEffect(() => {
  //     const listener = () => {
  //       switchShow(window.scrollY > 300);
  //     };
  //     document.addEventListener('scroll', listener);
  //     return () => document.removeEventListener('scroll', listener);
  //   }, [show]);
  const setEmailValue = React.useCallback((e) => {

    const input = document.getElementById('input')
    input.oninput = function () {
      email.innerHTML = input;
    }


    // setEmail(e.target.value);
    // if (e.target.value) {
    //   setEmailClear(true);
    // } else {
    //   setEmailClear(false);
    // }

  }, []);
  const setCodeValue = React.useCallback((e) => {
    setCode(e.target.value);
    if (e.target.value) {
      setCodeClear(true);
    } else {
      setCodeClear(false);
    }
  }, []);

  const addBuild = () => {
    console.log(subLength,);
    if (subLength > 9) {
      toast.error('不得超过九条数据');
      return false;
    }

    let newNum = subLength;
    newNum += 1;
    const newArr = []
    for (let index = 0; index < newNum; index += 1) {
      newArr.push(index)

    }
    console.log(newArr, newNum);
    console.log(new Array(subLength), subLength);
    setSubLength(newNum)

    setSubArr(newArr)

  }

  const delBuild = () => {
    console.log(555555555);

    let newNum = subLength;
    newNum -= 1;
    const newArr = []
    for (let index = 0; index < newNum; index -= 1) {
      newArr.push(index)

    }
    console.log(newArr, newNum);
    console.log(new Array(subLength), subLength);
    setSubLength(newNum)

    setSubArr(newArr)
  }

  const codeBlue = React.useCallback(() => {
    setCodeClear(false);
  }, []);
  const emailBlue = React.useCallback(() => {
    setEmailClear(false);
  }, []);



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
            <div style={{}}>
              {
                subArr.map((item, index) =>
                (
                  <>
                    <input
                      id='input'
                      style={{ marginBottom: "10px" }}
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
                    {/* <>
                      <span className={styles.add} onClick={delBuild}><img src="/images/tianjia.png" alt="" style={{ transform: 'rotate(140deg)' }} /></span>
                    </> : '' */}
                  </>
                )
                )
              }
              {
                email !== '' ?
                  <>
                    <span className={styles.add} onClick={delBuild}><img src="/images/tianjia.png" alt="" style={{ transform: 'rotate(140deg)' }} /></span>
                  </> : ''

              }
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
