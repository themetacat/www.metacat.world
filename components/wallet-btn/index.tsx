import React from 'react';
import cn from 'classnames';

import Rekv from 'rekv';
import Link from 'next/link';

import { useRouter } from 'next/router';

import { toast } from 'react-toastify';

import { useWalletProvider } from '../web3modal';

import { getNonce, loginSignature, getBaseInfo } from '../../service';

import { convert, getToken, removeToken, setToken } from '../../common/utils';

import style from './index.module.css';

type Props = {
  name?: string;
  address?: string;
  onClickHandler?: () => void;
};

interface IProfileData {
  accessToken: string;
  refreshToken: string;
  profile: {
    name: string;
    address: string;
    avatar: string;
  };
}

const INITIAL_STATE: IProfileData = {
  accessToken: null,
  refreshToken: null,
  profile: {
    name: null,
    address: null,
    avatar: null,
  },
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

export const state = new Rekv<IProfileData>(INITIAL_STATE);

export default function WalletBtn({ name, address, onClickHandler }: Props) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const profileData = state.useState('accessToken', 'refreshToken', 'profile');
  const { accessToken, refreshToken, profile } = profileData;
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

  const checkLoginStatu = React.useCallback(
    (res) => {
      const data = resultHandler(res);
      if (data) {
        state.setState({
          accessToken: data.accessToken,
          profile: data.profile,
          refreshToken: data.refreshToken,
        });
        setToken(data.profile.address, 'atk', data.accessToken);
        setToken(data.profile.address, 'rtk', data.refreshToken);
      }
      setShowMenu(false);
      setLoading(false);
    },
    [resultHandler],
  );

  const requireNonce = React.useCallback(
    async (addr) => {
      const res = await getNonce(addr);
      return resultHandler(res);
    },
    [resultHandler],
  );

  const connect = React.useCallback(
    async (addr, provider) => {
      const nonceData = await requireNonce(addr);
      if (nonceData) {
        const { address: add, nonce } = nonceData;
        provider.request({ method: 'personal_sign', params: [nonce, add] }).then(
          async (signature) => {
            const result = await loginSignature(add, signature);
            checkLoginStatu(result);
          },
          (error: any) => {
            setLoading(false);
          },
        );
      }
    },
    [requireNonce, checkLoginStatu],
  );

  const connectToChain = React.useCallback(async () => {
    setLoading(true);
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        web3.connect().then(
          async (res) => {
            const { address: addr, provider } = res;
            connect(addr, provider);
          },
          (err) => {
            setLoading(false);
          },
        );
      } catch {
        setLoading(false);
      }
    } else {
      window.open('https://metamask.io/');
    }
  }, [web3]);

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
        if (!profile.address && item.value === 'metemask') {
          connectToChain();
        }
      }
    },
    [profile, connectToChain],
  );

  const clickOperationItem = React.useCallback(
    (item) => {
      if (item.value === 'resetApp') {
        removeToken(profile.address, 'atk');
        removeToken(profile.address, 'rtk');
        console.log(1);
        web3.resetApp();
        state.setState({
          accessToken: '',
          refreshToken: '',
          profile: { address: null, name: null, avatar: null },
        });
        window.location.href = '/';
      }
      setShowMenu(false);
    },
    [web3],
  );

  const render = React.useMemo(() => {
    if (profile?.address) {
      return MENU.map((item, idx) => {
        return (
          <li className={cn('flex justify-between  items-center', style.menuItem)} key={idx}>
            {item.value === 'resetApp' ? (
              <div
                className="w-full flex justify-between  items-center p-3 text-xs"
                onClick={() => {
                  clickOperationItem(item);
                }}
              >
                <div className="flex items-center justify-around">
                  <img src={item.icon} className={cn('mr-2', style.operation)}></img>
                  <span>{item.label}</span>
                </div>
                <img src="/images/v5/arrow-simple.png" className={style.activeOperation}></img>
              </div>
            ) : (
              <Link href={item.value}>
                <div className="w-full flex justify-between  items-center p-3 text-xs">
                  <div className="flex items-center justify-around">
                    <img src={item.icon} className={cn('mr-2', style.operation)}></img>
                    <span>{item.label}</span>
                  </div>
                  <img src="/images/v5/arrow-simple.png" className={style.activeOperation}></img>
                </div>
              </Link>
            )}
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
  }, [profile, clickItem, clickOperationItem, loading]);

  const getText = React.useMemo(() => {
    let text = 'Connect';
    if (profile.address) {
      if (profile.name) {
        text = profile.name;
      } else {
        text = clipName(profile.address);
      }
    }
    return (
      <>
        {profile.address ? (
          <img className={cn('mr-1', style.avatar)} src={profile.avatar || '/images/icon.png'} />
        ) : (
          <img className="mr-1" src="/images/v5/wallet.png" />
        )}
        <div className={cn('font-semibold', profile.address ? 'text-xs' : 'text-base')}>{text}</div>
      </>
    );
  }, [profile, clipName]);

  const requireBaseData = React.useCallback(
    async (tk) => {
      const res = await getBaseInfo(tk);
      const { data } = res;
      const { address: addr, avatar } = data;
      const newProfile = Object.assign({ address: addr, avatar }, profile);
      state.setState({ profile: newProfile });
    },
    [profile],
  );

  React.useEffect(() => {
    if (web3.data.address && !profile.address) {
      const tk = getToken(web3.data.address, 'atk');
      if (tk) {
        // requireBaseData(tk)
      }
    }
  }, [web3, getToken, requireBaseData]);

  return (
    <div className={cn('cursor-pointer', style.btn)}>
      <div
        className={cn('flex justify-center items-center w-full h-full text-xs', style.btnDiv)}
        onClick={onClick}
      >
        {getText}
      </div>
      <ul className={cn('list-none mt-2 z-20', style.menu)}>{showMenu && render}</ul>
      {/* <div className='z-10 absolute w-screen h-screen' onClick={()=>{setShowMenu(false)}}></div> */}
    </div>
  );
}
