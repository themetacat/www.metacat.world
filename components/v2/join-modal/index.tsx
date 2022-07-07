import { Fragment, useCallback, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import MeteInput from '../meta-input';

interface Props {
  show?: boolean;
  setClose: (x) => void;
  type: 'Creators' | 'Builders';
  isConnect?: boolean;
}

export default function Modal({ show, setClose, type, isConnect }: Props) {
  const setOpen = useCallback(
    (showAble) => {
      setClose(showAble);
    },
    [setClose],
  );

  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  const cancelButtonRef = useRef(null);

  return (
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
                  {isConnect ? null : (
                    <div className=" text-xs font-normal text-gray-400">
                      This mailbox also works for personal information
                    </div>
                  )}
                  <div className="flex items-center  mt-2">
                    <MeteInput
                      require={true}
                      name={'address'}
                      bold={true}
                      value={address}
                      classname={'flex-1 mr-3 max-w-sm'}
                      onChangeHandler={(val) => {
                        setAddress(val);
                      }}
                    ></MeteInput>
                    {isConnect ? null : (
                      <div className="w-20 h-11 text-xs font-semibold rounded-lg flex justify-center items-center bg-gradient-to-r from-mainDark to-mainLight text-black">
                        Connect
                      </div>
                    )}
                  </div>
                </div>
                <div className=" mt-5  text-left">
                  <div className=" text-base font-medium text-gray-400">Email</div>
                  {isConnect ? null : (
                    <div className=" text-xs font-normal text-gray-400">
                      This mailbox also works for personal information
                    </div>
                  )}
                  <MeteInput
                    require={true}
                    name={'email'}
                    bold={true}
                    value={email}
                    classname={'mt-2'}
                    onChangeHandler={(val) => {
                      setEmail(val);
                    }}
                  ></MeteInput>
                </div>
                <div className=" mt-5  text-left">
                  <div className=" text-base font-medium text-gray-400">验证码</div>
                  <MeteInput
                    require={true}
                    name={'email'}
                    bold={true}
                    disable={true}
                    value={email}
                    classname={'mt-2'}
                    needSuffix={true}
                    onChangeHandler={(val) => {
                      setEmail(val);
                    }}
                  ></MeteInput>
                </div>
                <div className=" mt-7 h-10 rounded-lg bg-gradient-to-r from-mainDark to-mainLight text-black flex justify-center items-center text-base font-semibold">
                  Submit
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
