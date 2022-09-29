import { Fragment, useCallback, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';

import { toast } from 'react-hot-toast';
import { getToken, setToken, convert } from '../../../common/utils';
import WalletBtn, { state } from '../wallet-btn';

import { refreshToken, getBaseInfo } from '../../../service';

import MeteInput from '../meta-input';
import JoinModalBuild from '../../join_builders_works';

import {
  req_bind_send_email,
  req_bind_ver_email_code,
  req_user_apply_become,
  req_userBuilder_apply_become,
} from '../../../service/z_api';


interface Props {
  show?: boolean;
  setClose: (x) => void;
  setEmail: (x) => void;
  setbuildState: (x) => void;
  setcreaterState: (x) => void;
  type: 'Creators' | 'Builders';
  isConnect?: boolean;
  address?: string;
  canSumbit?: boolean;
  email?: string;
  buildStateVal?;
  addressWearable?;
  emaileWearable?;
  emailState?;
}

export default function Modal({ show, setbuildState, addressWearable, emaileWearable, setcreaterState, setClose, setEmail, type, emailState, buildStateVal }: Props) {
  const router = useRouter();
  const profileData = state.useState('profile');
  const { profile } = profileData;

  const setOpen = useCallback(
    (showAble) => {
      setClose(showAble);
    },
    [setClose],
  );
  const [inputAddress, setInputAddress] = useState(profile?.address || '');
  const [connect, setConnect] = useState(profile?.address !== null);
  const [inputEmail, setInputEmail] = useState(profile?.email || '');
  const [verCode, setVerCode] = useState('');
  const [codeState, setCodeState] = useState('Get code');
  const [joinBuilders, setJoinBuilders] = useState(false);
  // const [buildStateVal, setBuildStateVal] = useState(1);
  const [tokenVal, setTokenState] = useState(null);
  const timeId = useRef(null);
  const timer = useRef(60);

  const refreshTK = useCallback(async () => {
    const rToken = getToken('rtk');
    if (rToken) {
      const res = await refreshToken(rToken);
      const { code, data, msg } = res;
      if (code === 100003) {
        toast.error('Token timeout');
        window.location.href = '/';
        return null;
      }
      if (code !== 100000) {
        toast.error(msg);
        return null;
      }
      const { accessToken, refreshToken: rtk } = convert(data);
      setToken('atk', accessToken);
      setToken('rtk', rtk);
      state.setState({ accessToken, refreshToken: rtk });
      return accessToken;
    }
    return null;
  }, [null]);

  const resultHandler = useCallback(
    (res, callback) => {
      const { code, msg, data } = res;
      if (code === 100000) {
        return convert(data);
      }
      if (code === 100003) {
        refreshTK().then((token) => {
          if (token && callback) {
            callback(token);
          }
        });
        return null;
      }

      toast.error(msg);

      return null;
    },
    [refreshTK],
  );

  const requestPersonal = useCallback(
    async (token: string) => {
      const res = await getBaseInfo(token);
      const data = resultHandler(res, requestPersonal);
      if (!data) {
        return;
      }
      const { profile: pro } = data;
      state.setState({ profile: pro });
      setInputAddress(profile.address);
      setInputEmail(profile.email);
      setConnect(true);
    },
    [resultHandler],
  );

  const getEmailCode = useCallback(() => {
    const t = getToken('atk');
    if (!inputEmail || timeId.current) return;
    toast.success('The verification code has been sent', {
      style: {
        zIndex: 100,
      },
    });
    timer.current = 60;
    timeId.current = setInterval(() => {
      timer.current -= 1;
      if (timer.current < 0) {
        clearInterval(timeId.current);
        timeId.current = null;
        setCodeState('reacquire');
      } else {
        setCodeState(`${timer.current.toString()}s`);
      }
    }, 1000);
    req_bind_send_email(inputEmail, t);
  }, [inputEmail]);

  const submit = useCallback(async () => {
    // console.log("是我需要的点击事件ma", profile, "lll", type);

    // if (profile?.creatorStatus === 2 || profile?.creatorStatus === 4) return;
    // if (!inputAddress && !profile?.address) {
    //   toast.error(`wallet address can't be empty`);
    //   return;
    // }
    // if (!inputEmail && !profile?.email) {
    //   toast.error(`email address can't be empty`);
    //   return;
    // }
    // if (!verCode) {
    //   toast.error(`code can't be empty`);
    //   return;
    // }
    const t = getToken('atk');
    if (profile?.email) {
      const res = await req_user_apply_become('creator', t);
      if (res.code === 100000) {
        toast.success('Submitted successfully');
        setOpen(false);
        requestPersonal(t);
      }
    } else {
      const res = await req_bind_ver_email_code(verCode, t, 'creator');
      if (res.code === 100000) {
        toast.success('Submitted successfully');
        setOpen(false);
        requestPersonal(t);
      } else {
        toast.error('Submitted error');
      }
    }
  }, [verCode, profile, inputEmail, verCode]);

  const submitBuilder = useCallback(async () => {
    // console.log(profile, 555555, profile.email);

    // if (profile?.builderStatus === 1 || profile?.builderStatus === 4) return;
    // if (!inputAddress && !profile?.address) {
    //   toast.error(`wallet address can't be empty`);
    //   return;
    // }

    // if (!inputEmail && !profile?.email) {
    //   toast.error(`email address can't be empty`);
    //   return;
    // }
    // if (!verCode) {
    //   toast.error(`code can't be empty`);
    //   return;
    // }
    // const t = getToken('atk');
    // if (profile?.email) {
    //   const res = await req_userBuilder_apply_become(tokenVal, 'builder', '');
    //   if (res.code) {
    //     // toast.success('Submitted successfully');
    //     // toast(res.msg);
    //     // if (res.code === 1000000) {
    //     // const rest = await req_userBuilder_apply_become(token, 'builder', '');
    //     // if (rest.code === 100000) {
    //     requestPersonal(t);
    //     const resGetBageInfo = await getBaseInfo(tokenVal)

    //     // console.log(resGetBageInfo.data.profile.builder_status, "就是你要的");

    //     if (resGetBageInfo.code === 100000) {
    //       // setBuildStateVal(resGetBageInfo.data.profile.builder_status)

    //       setEmail(resGetBageInfo.data.profile.email);
    //       setbuildState(resGetBageInfo.data.profile.builder_status);
    //       setcreaterState(resGetBageInfo.data.profile.creator_status);

    //       // console.log(resGetBageInfo.data.profile.builder_status, 555556666666);

    //     }
    //     setOpen(false);
    //   }
    // } else {
    //   const res = await req_bind_ver_email_code(verCode, t, 'builder');
    //   if (res.code === 100000) {
    //     toast.success('Submitted successfully');
    //     requestPersonal(t);
    //     if (res.code) {
    //       // toast.success('Submitted successfully');
    //       // toast(res.msg);
    //       if (res.code === 1000000) {
    //         const rest = await req_userBuilder_apply_become(t, 'builder', '');
    //         if (rest.code === 100000) {
    //           requestPersonal(t);
    //           const resGetBageInfo = await getBaseInfo(tokenVal)

    //           // console.log(resGetBageInfo.data.profile.builder_status, "就是你要的");

    //           if (resGetBageInfo.code === 100000) {
    //             // setBuildStateVal(resGetBageInfo.data.profile.builder_status)

    //             setEmail(resGetBageInfo.data.profile.email);
    //             setbuildState(resGetBageInfo.data.profile.builder_status);
    //             setcreaterState(resGetBageInfo.data.profile.creator_status);

    //             // console.log(resGetBageInfo.data.profile.builder_status, 555556666666);

    //           }
    //           setOpen(false);
    //         }
    //       }


    //     }
    //   } else {
    //     toast.error('Submitted error');
    //   }
    // }
  }, [verCode, profile, inputEmail, verCode]);


  const buttonSecond = useCallback(async () => {
    // console.log("第二步", profile?.email);

    // if (profile?.creatorStatus === 2 || profile?.creatorStatus === 4) return;
    // if (!inputAddress && !profile?.address) {
    //   toast.error(`wallet address can't be empty`);
    //   return;
    // }
    // if (!inputEmail && !profile?.email) {
    //   toast.error(`email address can't be empty`);
    //   return;
    // }
    // if (!verCode) {
    //   toast.error(`code can't be empty`);
    //   return;
    // }
    const t = getToken('atk');

    if (profile?.email) {

      const res = await req_userBuilder_apply_become(tokenVal, 'creator', '');
      if (res.code) {
        // toast.success('Submitted successfully');

        toast(res.msg);
        // if (res.code === 1000000) {
        // const rest = await req_userBuilder_apply_become(token, 'builder', '');
        // if (rest.code === 100000) {
        requestPersonal(t);
        const resGetBageInfo = await getBaseInfo(tokenVal)

        // console.log(resGetBageInfo.data.profile.builder_status, "就是你要的");

        if (resGetBageInfo.code === 100000) {
          // setBuildStateVal(resGetBageInfo.data.profile.builder_status)

          setEmail(resGetBageInfo.data.profile.email);
          setbuildState(resGetBageInfo.data.profile.builder_status);
          setcreaterState(resGetBageInfo.data.profile.creator_status);

          // console.log(resGetBageInfo.data.profile.builder_status, 555556666666);

        }
        setOpen(false);
      }
    } else {
      const res = await req_bind_ver_email_code(verCode, t, 'creator');
      if (res.code === 100000) {
        toast.success('Submitted successfully');
        requestPersonal(t);
        if (res.code) {
          // toast.success('Submitted successfully');
          // toast(res.msg);
          // if (res.code === 1000000) {
          // const rest = await req_userBuilder_apply_become(token, 'builder', '');
          // if (rest.code === 100000) {
          requestPersonal(t);
          const resGetBageInfo = await getBaseInfo(tokenVal)

          // console.log(resGetBageInfo.data.profile.builder_status, "就是你要的");

          if (resGetBageInfo.code === 100000) {
            // setBuildStateVal(resGetBageInfo.data.profile.builder_status)

            setEmail(resGetBageInfo.data.profile.email);
            setbuildState(resGetBageInfo.data.profile.builder_status);
            setcreaterState(resGetBageInfo.data.profile.creator_status);

            // console.log(resGetBageInfo.data.profile.builder_status, 555556666666);

          }
          setOpen(false);
          // }
          // }


        }
      } else {
        toast.error('Submitted error');
      }
    }
  }, [verCode, profile, inputEmail, verCode]);

  const turnOff = () => {
    setJoinBuilders(false)

  }



  const buttonSecondBuilder = useCallback(async () => {
    // console.log("第二步builder", profile.email);

    // if (profile?.creatorStatus === 2 || profile?.creatorStatus === 4) return;
    // if (!inputAddress && !profile?.address) {
    //   toast.error(`wallet address can't be empty`);
    //   return;
    // }
    // if (!inputEmail && !profile?.email) {
    //   toast.error(`email address can't be empty`);
    //   return;
    // }
    // if (!verCode) {
    //   toast.error(`code can't be empty`);
    //   return;
    // }

    // setJoinBuilders(true)
    const t = getToken('atk');
    if (profile?.email) {
      // console.log("you");
      router.replace(`/profile?type=building`)
      // setJoinBuilders(true)
      // const res = await req_userBuilder_apply_become(tokenVal, 'builder', '');
      // if (res.code === 100000) {
      //   // toast.success('Submitted successfully');
      //   // toast(res.msg);
      //   // if (res.code === 1000000) {
      //   // const rest = await req_userBuilder_apply_become(token, 'builder', '');
      //   // if (rest.code === 100000) {
      //   requestPersonal(t);
      //   const resGetBageInfo = await getBaseInfo(tokenVal)

      //   // console.log(resGetBageInfo.data.profile.builder_status, "就是你要的");

      //   if (resGetBageInfo.code === 100000) {
      //     // setBuildStateVal(resGetBageInfo.data.profile.builder_status)

      //     setEmail(resGetBageInfo.data.profile.email);
      //     setbuildState(resGetBageInfo.data.profile.builder_status);
      //     setcreaterState(resGetBageInfo.data.profile.creator_status);

      //     // console.log(resGetBageInfo.data.profile.builder_status, 555556666666);

      //   }
      //   router.replace(`/profile?type=building`)
      //   setOpen(false);
      // }
    } else {
      // console.log("meiyou");
      const res = await req_bind_ver_email_code(verCode, t, 'builder');
      if (res.code === 100000) {
        setOpen(false);
        toast.success('Submitted successfully');
        requestPersonal(t);
        // if (res.code) {
        // toast.success('Submitted successfully');
        // toast(res.msg);
        // if (res.code === 1000000) {
        //   const rest = await req_userBuilder_apply_become(t, 'builder', '');
        if (res.code === 100000) {
          requestPersonal(t);
          const resGetBageInfo = await getBaseInfo(tokenVal)

          // console.log(resGetBageInfo.data.profile.builder_status, "就是你要的");

          if (resGetBageInfo.code === 100000) {
            // setBuildStateVal(resGetBageInfo.data.profile.builder_status)

            setEmail(resGetBageInfo.data.profile.email);
            setbuildState(resGetBageInfo.data.profile.builder_status);
            setcreaterState(resGetBageInfo.data.profile.creator_status);

            // console.log(resGetBageInfo.data.profile.builder_status, 555556666666);

          }
          router.replace(`/profile?type=building`)
        }
        // }


        // }
      } else {
        toast.error('Submitted error');
      }
    }
  }, [verCode, profile, inputEmail, verCode, emailState]);

  const afterConnectToWallet = useCallback(() => {
    const t = getToken('atk');
    requestPersonal(t);
  }, [requestPersonal]);

  const retProps = useCallback(async (token: string, buildData: any) => {
    if (buildData.length === 0) {
      toast.error('Please fill in the link address');
      return false;
    }
    const showIndex = false
    buildData?.map((item) => {
      if (item !== '') {
        const reg = '^((https|http|ftp|rtsp|mms)?://)'
          + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?'
          + '(([0-9]{1,3}.){3}[0-9]{1,3}'
          + '|'
          + '([0-9a-z_!~*\'()-]+.)*'
          + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].'
          + '[a-z]{2,6})'
          + '(:[0-9]{1,4})?'
          + '((/?)|'
          + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        const re = new RegExp(reg)
        if (!re.test(item)) {
          toast.error("Not the correct URL, please pay attention to check");
          return false;
        }
      }
      return true;
    })
    if (showIndex) {
      return false;
    }
    const res = await req_userBuilder_apply_become(token, 'builder', buildData.toString());
    // toast(res.msg)
    if (res?.code === 100000) {
      router.replace('/profile?type=building')
      setJoinBuilders(false)
    } else {
      setJoinBuilders(false)
    }

    // res.then((resV) => {
    //   // setBuildState(2)
    //   console.log(resV.code);

    // setTabStateTR(false)
    // setEmailBuilders(false)
  }
    ,
    [],
  );
  useEffect(() => {
    const t = getToken('atk');
    setTokenState(t)

    console.log(addressWearable, "profile?.address");

    setConnect(profile?.address !== null || addressWearable !== null);


    return () => {
      if (timeId.current) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
    };
  }, [profile, buildStateVal, emailState,addressWearable]);



  const cancelButtonRef = useRef(null);

  return (
    <>
      <Transition.Root show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative text-white bg-black px-7 pt-5 pb-10 rounded-2xl overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                  <Dialog.Title className="text-xl leading-6 font-medium text-white flex items-center justify-between  pb-3 border-b border-mainDark02">
                    <span className=" text-xl font-medium">Join {type}</span>
                    <img
                      onClick={() => {
                        setOpen(false);
                      }}
                      className=" cursor-pointer w-4 h-4"
                      src="/images/close-pop.png"
                    ></img>
                  </Dialog.Title>

                  <div className=" pt-6 text-left">
                    <div className=" text-base font-medium text-gray-400">Wallet address</div>
                    {connect ? null : (
                      <div className=" text-xs font-normal text-gray-400">
                        This address works for personal information
                      </div>
                    )}
                    <div className="flex items-center  mt-2">
                      <MeteInput
                        require={true}
                        name={'address'}
                        disable={profile?.address !== null || addressWearable !== null}
                        bold={true}
                        value={inputAddress || profile?.address || '' || addressWearable}
                        classname={`${connect ? 'w-full' : 'flex-1 mr-3 max-w-sm'}`}
                        onChangeHandler={(val) => {
                          setInputAddress(val);
                        }}
                      ></MeteInput>
                      {connect ? null : (
                        // <div className="w-20 h-11 text-xs font-semibold rounded-lg flex justify-center items-center bg-gradient-to-r from-mainDark to-mainLight text-black">
                        //   Connect
                        // </div>
                        <WalletBtn
                          className="w-20 h-11 text-xs font-semibold "
                          quickBtn={true}
                          afterConnect={afterConnectToWallet}
                        ></WalletBtn>
                      )}
                    </div>
                  </div>
                  <div className=" mt-5  text-left">
                    <div className=" text-base font-medium text-gray-400">Email</div>
                    {profile?.email || emaileWearable ? null : (
                      <div className=" text-xs font-normal text-gray-400">
                        This mailbox works for personal information
                      </div>
                    )}
                    <MeteInput
                      require={true}
                      name={'email'}
                      bold={true}
                      disable={profile?.email !== null && profile?.email !== '' || emaileWearable !== null && emaileWearable !== ''}
                      value={inputEmail || profile?.email || '' || emaileWearable}
                      classname={'mt-2'}
                      onChangeHandler={(val) => {
                        setInputEmail(val);
                      }}
                    ></MeteInput>
                  </div>
                  {profile?.email ? null : (
                    <div className=" mt-5  text-left">
                      <div className=" text-base font-medium text-gray-400">Code</div>
                      <MeteInput
                        require={true}
                        name={'email'}
                        bold={true}
                        disable={profile?.email !== null || emaileWearable!==null}
                        value={verCode || ''}
                        classname={'mt-2'}
                        needSuffix={true}
                        onChangeHandler={(val) => {
                          setVerCode(val);
                        }}
                        suffixText={codeState}
                        suffixClickHandle={getEmailCode}
                      ></MeteInput>
                    </div>
                  )}
                  {/* {
                    profile?.email !== null || profile?.email !== '' ? */}
                  <>
                    <div onClick={type === 'Creators' ? buttonSecond : buttonSecondBuilder} className={`mt-7 h-10 rounded-lg flex justify-center items-center text-base font-semibold event-hand  bg-gradient-to-r from-mainDark to-mainLight text-black${(profile?.creatorStatus === 1 || profile?.creatorStatus === 3) &&
                      inputAddress &&
                      inputEmail &&
                      verCode
                      ? ''
                      : ' opacity50'
                      }`}>Submit</div>
                  </>
                  {/* :
                      <div
                        onClick={type === 'Creators' ? submit : submitBuilder}
                        // onClick={submit}
                        className={`mt-7 h-10 rounded-lg flex justify-center items-center text-base font-semibold event-hand  bg-gradient-to-r from-mainDark to-mainLight text-black${(profile?.creatorStatus === 1 || profile?.creatorStatus === 3) &&
                          inputAddress &&
                          inputEmail &&
                          verCode
                          ? ''
                          : ' opacity50'
                          }`}
                      >
                        Submit

                      </div>

                  } */}
                </Dialog.Panel>
              </Transition.Child>
            </div>

          </div>
          {
            joinBuilders === true ?
              <div>
                <JoinModalBuild
                  turnOff={turnOff}
                  retProps={retProps}
                  // clickHeader={dragJoin}
                  emailState={emailState}
                ></JoinModalBuild>
              </div>
              : null
          }
        </Dialog>

      </Transition.Root>

    </>
  );
}
