import React from 'react';
import cn from 'classnames';

import Rekv from 'rekv';
import Link from 'next/link';

import Router, { useRouter } from 'next/router';

import { toast } from 'react-hot-toast';

import { useWalletProvider } from '../../web3modal';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import Web3Modal from 'web3modal';

import { getNonce, loginSignature, getBaseInfo } from '../../../service';
import { req_user_logout } from '../../../service/z_api';

import { convert, getToken, removeToken, setToken } from '../../../common/utils';

import style from './index.module.css';

type Props = {
  name?: string;
  address?: string;
  onClickHandler?: () => void;
  className?: string;
  quickBtn?: boolean;
  afterConnect?: (x) => void;
};

interface IProfileData {
  accessToken: string;
  refreshToken: string;
  profile: {
    nickName: string;
    address: string;
    avatar: string;
    email: string;
    creatorStatus: number;
  };
}

const INITIAL_STATE: IProfileData = {
  accessToken: null,
  refreshToken: null,
  profile: {
    nickName: null,
    address: null,
    avatar: null,
    email: null,
    creatorStatus: 0,
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
    value: '/profile?type=parcellist',
    type: 'operation',
  },
  {
    label: 'My Wearables',
    icon: '/images/icon/wearables.png',
    value: '/profile?type=wearablelist',
    type: 'operation',
  },
  {
    label: 'My Buildings',
    icon: '/images/icon/buildingIcon.png',
    value: '/profile?type=building',
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
    label: 'MetaMask',
    icon: '/images/v5/Maskgroup.png',
    value: 'metamask',
    type: 'wallet',
  },
  // {
  //   label: 'Wallet Connect',
  //   icon: '/images/walletconnect.png',
  //   value: 'walletconnect',
  //   type: 'wallet',
  // },
];

export const state = new Rekv<IProfileData>(INITIAL_STATE);

export default function WalletBtn({
  name,
  address,
  onClickHandler,
  className,
  quickBtn = false,
  afterConnect,
}: Props) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const profileData = state.useState('accessToken', 'refreshToken', 'profile');
  const { accessToken, refreshToken, profile } = profileData;

  const [showWall, setShowWall] = React.useState(null);

  // const [w3, setw3] = React.useState(null)

  // const provider = new WalletConnectProvider({
  //   infuraId: "f9d7d835ed864a299a13e841a1b654f8",
  // });

  // const [p1, setp1] = React.useState(provider)

  const web3 = useWalletProvider();
  const router = useRouter();

  const { pathname } = router;

  const resultHandler = React.useCallback(
    (res) => {
      const { code, msg, data } = res;
      if (code === 100000) {
        return convert(data);
      }
      toast.error(msg);

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
        setToken('atk', data.accessToken);
        setToken('rtk', data.refreshToken);
        if (!quickBtn) {
          Router.push({
            pathname: '/profile',
            query: {
              type: 'parcellist',
            },
          });
        }
        if (afterConnect) {
          afterConnect(data.profile);
        }
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
    if (typeof (window as any).ethereum === 'undefined' || !(window as any).ethereum.isMetaMask) {
      setLoading(false);
      setShowMenu(false);
      window.open('https://metamask.io/');
      return;
    }
    try {
      // removeToken(profile.address, 'atk');
      // removeToken(profile.address, 'rtk');
      // state.setState({
      //   accessToken: '',
      //   refreshToken: '',
      //   profile: { address: null, nickName: null, avatar: null },
      // });

      web3.connect().then(
        async (res) => {
          try {
            const { address: addr, provider } = res;
            connect(addr, provider);
          } catch (ex) {
            toast.error('Please check you metamask plugin');
          }
        },
        (err) => {
          setLoading(false);
        },
      );
    } catch {
      setLoading(false);
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

  const onClick = React.useCallback(
    (event) => {
      event.nativeEvent.stopImmediatePropagation();
      if (quickBtn) {
        connectToChain();
      } else {
        setShowMenu(!showMenu);
        if (onClickHandler) {
          onClickHandler();
        }
      }
    },
    [showMenu, onClickHandler],
  );

  // const closeApp = async (newWeb3) => {
  //   if (newWeb3 && newWeb3.currentProvider && newWeb3.currentProvider.close) {
  //     await newWeb3.currentProvider.close();
  //   }
  //   await newWeb3.clearCachedProvider();
  // };

  // const subscribeProvider = React.useCallback(async (provider, newWeb3, modal) => {
  //   const { nonce, address: add } = await requireNonce(provider.accounts[0]);
  //   provider.request({ method: 'personal_sign', params: [nonce, add] }).then((res) => {
  //     loginSignature(add, res).then((res) => {
  //       checkLoginStatu(res);
  //     }, () => { })
  //   }, (error) => {
  //     if (w3) {
  //       w3.resetApp()
  //     }
  //   })

  //   if (!provider.on) {
  //     return;
  //   }

  //   //断开连接
  //   provider.on('close', async () => {
  //     removeToken('atk');
  //     removeToken('rtk');
  //     state.setState({
  //       accessToken: '',
  //       refreshToken: '',
  //       profile: { address: null, nickName: null, avatar: null },
  //     });
  //     window.location.href = '/';
  //     newWeb3.resetApp()
  //     await provider.killSession()
  //     // await provider.clearCachedProvider();
  //   });

  //   //切换账号
  //   // provider.on('accountsChanged', async (accounts) => {
  //   //   let address = await accounts[0];
  //   //   console.log('切换账号')
  //   // });
  // }, [w3])

  // const walletconnect = React.useCallback(async () => {

  //   const providerOptions = {
  //     walletconnect: {
  //       package: WalletConnectProvider,
  //       options: {
  //         infuraId: '7b9fdfd5be844ea3b9f2988619123ced',//以太坊连接必填
  //         // rpc: {
  //         //   56: 'https://mainnet.infura.io/v3',
  //         // },
  //         // network: 56,
  //       },
  //     },
  //   };
  //   const web3Modal = new Web3Modal({
  //     network: 'mainnet',
  //     cacheProvider: true,
  //     providerOptions,
  //   });
  //   const provider = await web3Modal.connect()
  //   await web3Modal.toggleModal()
  //   const web_3 = new WalletConnectProvider(provider)

  //   setw3(web_3)
  //   await subscribeProvider(provider, web_3, web3Modal)
  //   return web_3
  // }, [subscribeProvider])

  const clickItem = React.useCallback(
    (item) => {
      setShowWall(item.value);
      if (item.type === 'wallet') {
        if (!profile.address && item.value === 'metamask') {
          connectToChain();
        }
        if (!profile.address && item.value === 'walletconnect') {
          // walletconnect()
        }
      }
    },
    [profile, connectToChain],
    // walletconnect
  );
  // const demo = React.useCallback(async () => {
  //   console.log(await p1.enable())
  //   const i = await p1.enable();

  //
  // provider.on("accountsChanged", (accounts: string[]) => {
  //   console.log(accounts);
  // });

  // // Subscribe to chainId change
  // provider.on("chainChanged", (chainId: number) => {
  //   console.log(chainId);
  // });

  // // Subscribe to session disconnection
  // provider.on("disconnect", (code: number, reason: string) => {
  //   console.log(code, reason);
  // });
  //   return await i
  // }, [p1])

  const clickOperationItem = React.useCallback(
    async (item) => {
      if (item.value === 'resetApp') {
        removeToken('atk');
        removeToken('rtk');
        removeToken('address');
        // if (w3) {
        //   w3.resetApp()
        // }
        if (web3) {
          web3.resetApp();
        }
        state.setState({
          accessToken: '',
          refreshToken: '',
          profile: { address: null, nickName: null, avatar: null, email: '', creatorStatus: 1 },
        });
        // const res = await req_user_logout(accessToken);
        // console.log(res)
        if (pathname !== '/') {
          window.location.href = '/';
        }
      }
      setShowMenu(false);
    },
    [pathname, web3, profile, state, accessToken],
    // w3
  );

  const render = React.useMemo(() => {
    if (profile?.address) {
      return MENU.map((item, idx) => {
        return (
          <li
            className={cn(
              'flex justify-between  items-center',
              style.menuItem,
              idx === MENU.length - 1 ? style.last : null,
            )}
            key={idx}
          >
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
            <img
              src="/images/loading.png"
              className={cn(
                'animate-spin',
                style.loading,
                loading && item.value === showWall ? null : ' hidden',
              )}
            />
            <img
              src="/images/v5/arrow.png"
              className={cn(style.activeWallet, loading ? ' hidden' : null)}
            ></img>
            {/* {loading ? (
              <img src="/images/loading.png" className={cn('animate-spin', style.loading)} />
            ) : (
              <img src="/images/v5/arrow.png" className={style.activeWallet}></img>
            )} */}
          </div>
        </li>
      );
    });
  }, [profile, clickItem, clickOperationItem, loading, showWall]);

  const getText = React.useMemo(() => {
    let text = 'Connect';
    if (profile.address) {
      if (profile.nickName) {
        text = profile.nickName;
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
        <div
          title={text}
          className={cn(
            'font-semibold truncate',
            style.walletText,
            profile.address ? 'text-xs' : 'text-base',
          )}
        >
          {text}
        </div>
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

  // React.useEffect(() => {
  //   if (web3.data.address && !profile.address) {
  //     const tk = getToken(web3.data.address, 'atk');
  //     if (tk) {
  //       // requireBaseData(tk)
  //     }
  //   }
  // }, [web3, getToken, requireBaseData]);

  const close = React.useCallback(() => {
    if (profile?.address) {
      setShowMenu(false);
    }
  }, [profile]);

  React.useEffect(() => {
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  }, [close]);

  return (
    <div
      className={cn(
        'event-hand bg-gradient-to-r from-mainDark to-mainLight rounded-lg relative text-black flex justify-center items-center',
        style.btn,
        className,
      )}
    >
      <div
        className={cn('flex justify-center items-center w-full h-full text-xs', style.btnDiv)}
        onClick={onClick}
      >
        {getText}
      </div>
      <ul className={cn('list-none mt-2 z-20', style.menu)}>{showMenu && render}</ul>
    </div>
  );
}
