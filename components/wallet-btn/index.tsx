import React from 'react';
import cn from 'classnames';

import { toast } from 'react-toastify';

import { useWalletProvider } from '../web3modal';

import { getNonce, loginSignature } from '../../service';

import { convert } from '../../common/utils';

import style from './index.module.css';

type Props = {
  name?: string;
  address?: string;
  onClickHandler?: () => void;
};

const MENU = [
  {
    label: 'Setting',
    icon: '/images/v5/Settings.png',
    value: '/profile/setting',
    type: 'operation',
  },
  {
    label: 'My Parcels',
    icon: '/images/v5/MyParcels.png',
    value: '/profile',
    type: 'operation',
  },
  {
    label: 'Sign Out',
    icon: '/images/v5/Signout.png',
    value: 'resetApp',
    type: 'operation',
  },
];

const WALLET = [
  {
    label: 'MeteMask',
    icon: '/images/v5/Maskgroup.png',
    value: 'metemask',
    type: 'wallet',
  },
];

export default function WalletBtn({ name, address, onClickHandler }: Props) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [profileData, setrProfileData] = React.useState({
    accessToken: null,
    refreshToken: null,
    profile: {
      name: null,
      address: null,
      avatar: null,
    },
  });
  const web3 = useWalletProvider();

  const resultHandler = React.useCallback(
    (res) => {
      const { code, msg, data } = res;
      if (code === 100000) {
        return convert(data);
      }
      toast.error(msg, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'dark',
        className: style.toast,
      });

      return null;
    },
    [null],
  );

  const updateLocal = React.useCallback(
    (key, value) => {
      localStorage.setItem(key, value);
    },
    [null],
  );

  const getLocal = React.useCallback(
    (key) => {
      return localStorage.getItem(key);
    },
    [null],
  );

  const checkLoginStatu = React.useCallback(
    (res) => {
      const data = resultHandler(res);
      if (data) {
        setrProfileData(data);
        updateLocal('accessToken', data.accessToken);
        updateLocal('refreshToken', data.refreshToken);
      }
      setLoading(false);
    },
    [resultHandler, updateLocal],
  );

  const requireNonce = React.useCallback(
    async (addr) => {
      const res = await getNonce(addr);
      return resultHandler(res);
    },
    [resultHandler],
  );

  const connectToChain = React.useCallback(async () => {
    setLoading(true);
    if (typeof (window as any).ethereum !== 'undefined') {
      web3.connect().then(async (res) => {
        const { address: addr, provider } = res;
        const nonceData = await requireNonce(addr);
        if (nonceData) {
          const { address: add, nonce } = nonceData;
          provider.request({ method: 'personal_sign', params: [nonce, add] }).then(
            async (signature) => {
              const result = await loginSignature(add, signature);
              checkLoginStatu(result);
            },
            (error: any) => {
              throw error;
            },
          );
        }
      });
    } else {
      window.open('https://metamask.io/');
    }
  }, [web3, checkLoginStatu, requireNonce]);

  const clipName = React.useCallback(
    (addres) => {
      if (addres?.length > 8) {
        const end = addres.length - 4;
        const all = addres.slice(4, end);
        return addres.replace(all, '***');
      }
      return addres;
    },
    [null],
  );

  const onClick = React.useCallback(() => {
    setShowMenu(!showMenu);
    if (onClickHandler) {
      onClickHandler();
    }
  }, [showMenu, onClickHandler]);

  const clickItem = React.useCallback(
    (item) => {
      if (item.type === 'wallet') {
        if (!profileData.profile?.address && item.value === 'metemask') {
          connectToChain();
        }
      }
    },
    [profileData.profile, connectToChain],
  );

  const clickOperationItem = React.useCallback(
    (item) => {
      if (item.value !== 'resetApp') {
        window.location.href = item.value;
      }

      if (item.value === 'resetApp') {
        web3.resetApp();
      }
      setShowMenu(false);
    },
    [web3],
  );

  const render = React.useMemo(() => {
    if (profileData.profile?.address) {
      return MENU.map((item, idx) => {
        return (
          <li
            className={cn('flex justify-between  items-center', style.menuItem)}
            key={idx}
            onClick={() => {
              clickOperationItem(item);
            }}
          >
            <div className="w-full flex justify-between  items-center p-3 text-xs">
              <div className="flex items-center justify-around">
                <img src={item.icon} className={cn('mr-2', style.operation)}></img>
                <span>{item.label}</span>
              </div>
              <img src="/images/v5/arrow-simple.png" className={style.activeOperation}></img>
            </div>
          </li>
        );
      });
    }
    return WALLET.map((item, idx) => {
      return (
        <li
          className={cn('flex justify-around items-center text-xs', style.walletItem)}
          key={idx}
          onClick={() => {
            clickItem(item);
          }}
        >
          <div
            className={cn('flex justify-between items-center w-full h-full', style.walletContent)}
          >
            <div className="flex items-center justify-around">
              <img src={item.icon} className={cn('mr-2', style.walletLogo)}></img>
              <span>{item.label}</span>
            </div>
            {loading ? (
              <img src="/images/loading.png" className={cn('animate-spin', style.loading)} />
            ) : (
              <img src="/images/v5/arrow.png" className={style.activeWallet}></img>
            )}
          </div>
        </li>
      );
    });
  }, [profileData, clickItem, clickOperationItem, loading]);

  const getText = React.useCallback(() => {
    if (profileData.profile) {
      if (profileData.profile.name) {
        return profileData.profile.name;
      }
      return clipName(profileData.profile.address);
    }
    return 'Connect';
  }, [profileData, clipName]);

  return (
    <div className={cn('cursor-pointer', style.btn)}>
      <div
        className={cn('flex justify-center items-center w-full h-full text-xs', style.btnDiv)}
        onClick={onClick}
      >
        <img className="mr-1" src="/images/v5/wallet.png" />
        <div className={cn('font-semibold', profileData.profile.address ? 'text-xs' : 'text-base')}>
          {getText()}
        </div>
      </div>
      <ul className={cn('list-none mt-2 z-20', style.menu)}>{showMenu && render}</ul>
      {/* <div className='z-10 absolute w-screen h-screen' onClick={()=>{setShowMenu(false)}}></div> */}
    </div>
  );
}
