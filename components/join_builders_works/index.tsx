import React from 'react';
import cn from 'classnames';


import { toast } from 'react-hot-toast';

import styles from './index.module.css';


import { getToken } from '../../common/utils';


import { req_userBuilder_apply_become } from '../../service/z_api';

interface Props {
  classname?: string;
  turnOff?;
  nextBtn?;
  value?: string;
  modifyEmail?: boolean;
  retProps?;
  addBuildOther?;
  emailState?;
  dataBuild?;
  buildData?;
  clickHeader?;
}



export default function JoinBuilders({ turnOff, value, clickHeader, nextBtn, buildData, dataBuild, retProps, modifyEmail, emailState, }: Props) {
  console.log(dataBuild);

  const [show, switchShow] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [infoMsgLink, setInfoMsgLink] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailClear, setEmailClear] = React.useState(false);
  const [codeClear, setCodeClear] = React.useState(false);
  const [joinBuilders, setJoinBuilders] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [infoMsgPlatform, setInfoMsgPlatform] = React.useState(false);
  // const [buildData, setBuildState] = React.useState([]);
  const [subLength, setSubLength] = React.useState(1);
  const [infoMsgFiles, setInfoMsgFiles] = React.useState(false);
  const [subArr, setSubArr] = React.useState([]);
  const time = React.useRef(60);
  const timeId = React.useRef(null);

  //   React.useEffect(() => {
  //     const listener = () => {
  //       switchShow(window.scrollY > 300);
  //     };
  //     document.addEventListener('scroll', listener);
  //     return () => document.removeEventListener('scroll', listener);
  //   }, [show]);

  const setCodeValue = React.useCallback((index, e, item) => {
    // setCode(e.target.value);
    // if (e.target.value) {
    //   setCodeClear(true);
    // } else {
    //   setCodeClear(false);
    // }

    subArr[index] = e.target.value
    // let buildData = null;
    // buildData = subArr;
    // const buildData=this.status'
    console.log([...subArr], '66');

    setSubArr([...subArr])
  }, []);

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
    console.log(subLength, subArr.length);
    if (subArr.length > 2) {
      toast.error('不得超过三条数据');
      return false;
    }
    // let newNum = subLength;
    // newNum+=1;
    // const newArr =[]
    // for (let index = 0; index < newNum; index+=1) {
    //   newArr.push(index)

    // }
    // console.log(newArr,newNum);
    // console.log(new Array(subLength),subLength);
    // setSubLength(newNum)

    // setSubArr(newArr)
    subArr.push([])
    // this.props.subArr
    // buildData([...subArr])
    setSubArr([...subArr])

  }

  const delBuild = (index) => {
    // if (subLength < 1) {
    //   toast.error('不得小于一条数据');
    //   return false;
    // }
    console.log(555555555, subLength);

    // let newNumDel = subLength;
    // newNumDel - 1;
    console.log(subArr, "dddddddddd", index);

    subArr.splice(index, 1)

    setSubLength(subArr.length)


  }




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
        <div className={styles.container2}>
          <div className={styles.topBox} onMouseDown={clickHeader}>
            <span>Join Builders</span>
            <span onClick={turnOff}><img src="/images/guanbi.png" alt="" /></span>
          </div>
          <div className={styles.emailBox}>
            <p>Email</p>
            <p>This mailbox also works for personal information</p>
            <input
              style={{ marginBottom: "10px" }}
              type="text"
              placeholder={emailState ? emailState : "email"}
              disabled={emailState ? true : false}
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
              <div style={{}}>
                {
                  subArr.map((item, index) =>
                  (
                    <>
                      <input
                        style={{ width: "350px" }}
                        id="addBuilding"
                        type="text"
                        placeholder=""
                        value={item}
                        onInput={(e) => { setCodeValue(index, e, item) }}
                        // onFocus={() => {
                        //   if (code) {
                        //     setCodeClear(true);
                        //   }
                        // }}
                        // onBlur={() => {

                        //   const linkBuildIndex = item.indexOf('http://')
                        //   const linkBuildCom = item.indexOf('.com')
                        //   if (linkBuildIndex === -1 || linkBuildCom === -1) {
                        //     toast.error('请填写正确的link地址');
                        //     return false;
                        //   }
                        // }}

                        onBlur={(index) => {
                          if (item === '') {
                            setInfoMsgLink(true)
                            setInfoMsgFiles(false)
                          } else if (item !== '') {
                            setInfoMsgLink(false)
                            const linkBuildIndex = item.indexOf('http://')
                            const linkBuildCom = item.indexOf('.com')
                            if (linkBuildIndex === -1 || linkBuildCom === -1) {
                              console.log(
                                linkBuildIndex, 1, linkBuildCom
                              );
                              setInfoMsgFiles(true)
                            } else {
                              setInfoMsgFiles(false)
                            }
                          } else {
                            setInfoMsgLink(false)
                            setInfoMsgFiles(false)
                          }

                        }}
                      />
                      <>
                        <span className={styles.add} onClick={() => { delBuild(index) }}><img src="/images/tianjia.png" alt="" style={{ transform: 'rotate(140deg)' }} /></span>
                      </>
                      <div className={cn('flex items-center text-xs mt-1 mb-2', styles.warnContent)}>
                        {
                          infoMsgLink === true ? <span className={styles.warn}>Please input building link</span> : null
                        }
                        {
                          infoMsgFiles === true ? <span className={styles.warn}>Please fill in the correct link address</span> : null
                        }
                      </div>

                    </>
                  )
                  )
                }


                <span onClick={addBuildOther} className={styles.add}><img src="/images/tianjia.png" alt="" /></span>
              </div>
              <p className={styles.send}>You can also send your works to our：
                <img src="/images/youxiang.png" alt="" />
                <img src="/images/ttt.png" alt="" />

              </p>
              <div className={cn(styles.next, infoMsgLink === true ? styles.sub : null, infoMsgFiles === true ? styles.sub : null)} onClick={() => { retProps(token, subArr) }}>Submit</div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
