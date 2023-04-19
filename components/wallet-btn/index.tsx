/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import 'tailwindcss/tailwind.css';
import { Web3AuthCore } from '@web3auth/core';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnect from '@walletconnect/client';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from '@web3auth/base';
import Rekv from 'rekv';
import Link from 'next/link';

import Web3 from 'web3';

import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';

import Router, { useRouter } from 'next/router';

import { toast } from 'react-hot-toast';

import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

import { useWalletProvider } from '../web3modal';

import RPC from '../web3RPC';

import { getNonce, loginSignature, getBaseInfo, getCVEventList } from '../../service';

import { convert, getToken, removeToken, setToken } from '../../common/utils';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import style from './index.module.css';

type Props = {
  name?: string;
  address?: string;
  onClickHandler?: () => void;
};

interface IProfileData {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  profile: {
    nickName: string;
    address: string;
    avatar: string;
  };
}

const INITIAL_STATE: IProfileData = {
  accessToken: null,
  idToken: null,
  refreshToken: null,
  profile: {
    nickName: null,
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
    type: 'walletMetaMask',
  },
  {
    label: 'Wallet Connect',
    icon: '/images/walletconnect.png',
    value: 'walletconnect',
    type: 'wallet',
  },
  {
    label: 'Others(Meta,Twitter...)',
    icon: '/images/v5/login.jpg',
    value: 'loginConnevt',
    type: 'login',
  },
];

export const state = new Rekv<IProfileData>(INITIAL_STATE);
const meta = {
  title: ` ${SITE_NAME}`,
  description: META_DESCRIPTION,
};
export default function WalletBtn({ name, address, onClickHandler }: Props) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const profileData = state.useState('accessToken', 'idToken', 'refreshToken', 'profile');
  const { accessToken, idToken, refreshToken, profile } = profileData;
  const [showModal, setShowModal] = useState(false);
  const [showWall, setShowWall] = React.useState(null);
  const [providerWeb3auth, setProviderWeb3auth] = useState<SafeEventEmitterProvider | null>(null);

  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);

  const [web3AuthAddress, setWeb3AuthAddress] = React.useState(null);
  const [idTokenWeb3, setIdTokenWeb3] = React.useState(null);
  const [loginState, setLoginState] = React.useState('web3Auth');
  const [profileConcent, setProfileConcent] = React.useState(null);
  const [w3, setw3] = React.useState(null);

  const provider = new WalletConnectProvider({
    infuraId: 'f9d7d835ed864a299a13e841a1b654f8',
  });

  const [p1, setp1] = React.useState(provider);

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
      // const idToken =  web3auth.authenticateUser();
      if (data) {
        state.setState({
          accessToken: data.accessToken,
          profile: data.profile,
          refreshToken: data.refreshToken,
        });
        setToken('atk', data.accessToken);
        setToken('rtk', data.refreshToken);
        Router.push({
          pathname: '/profile',
          query: {
            type: 'parcellist',
          },
        });
      }
      setShowMenu(false);
      setLoading(false);
    },
    [resultHandler],
  );

  const requireNonce = React.useCallback(
    async (addr) => {
      const res = await getNonce(addr);
      // console.log(res, 'res');

      return resultHandler(res);
    },
    [resultHandler],
  );

  const connect = React.useCallback(
    async (addr, providerCon) => {
      // console.log(addr);

      const nonceData = await requireNonce(addr);
      // console.log(11111);

      // console.log(nonceData);

      if (nonceData) {
        const { address: add, nonce } = nonceData;
        providerCon.request({ method: 'personal_sign', params: [nonce, add] }).then(
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
      web3.connect().then(
        async (res) => {
          // console.log(res, 55555555);

          const { address: addr, provider: provid } = res;
          connect(addr, provid);
          window.localStorage.setItem('metaMaskAddress', res.address);
        },
        (err) => {
          setLoading(false);
        },
      );
      window.localStorage.setItem('LoginType', 'metaMask');
    } catch {
      setLoading(false);
    }
  }, [web3, connect]);

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
      if (idTokenWeb3 === null) {
        setShowMenu(false);
      }
      event.nativeEvent.stopImmediatePropagation();
      setShowMenu(!showMenu);
      if (onClickHandler) {
        onClickHandler();
      }
    },
    [showMenu, onClickHandler, idTokenWeb3],
  );

  const subscribeProvider = React.useCallback(
    async (providerDa, newWeb3, modal) => {
      // console.log(providerDa, newWeb3, modal);
      //  const nonce = window.localStorage.getItem('walletconnect')
      const { nonce, address: add } = await requireNonce(providerDa.accounts);

      providerDa.request({ method: 'personal_sign', params: [nonce, add] }).then(
        (resD) => {
          loginSignature(add, resD).then((resData) => {
            // console.log(5);

            checkLoginStatu(resData);
          });
        },
        (error) => {
          if (w3) {
            w3.resetApp();
          }
        },
      );

      if (!providerDa.on) {
        return;
      }

      //   //断开连接
      provider.on('close', async () => {
        removeToken('atk');
        removeToken('rtk');
        state.setState({
          accessToken: '',
          refreshToken: '',
          profile: { address: null, nickName: null, avatar: null },
        });
        if (pathname !== '/') {
          window.location.href = '/';
        } else {
          window.location.reload();
        }
        newWeb3.resetApp();
        await provider.killSession();
        await provider.clearCachedProvider();
      });
      provider.on('accountsChanged', async (accounts) => {
        const addressData = await accounts[0];
      });
    },
    [w3, requireNonce],
  );

  // const connector = new WalletConnect({
  //   bridge: "https://bridge.walletconnect.org",
  //   // qrcodeModal: WalletConnectQRCodeModal,
  // });

  const walletconnect = React.useCallback(async () => {
    setLoading(true);
try{
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '7b9fdfd5be844ea3b9f2988619123ced',
        // rpc: {
        //   56: 'https://mainnet.infura.io/v3',
        // },
        // network: 56,
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions,
  });
  // console.log(web3Modal, 'web3Modal');
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
    // qrcodeModal: WalletConnectQRCodeModal,
  });
  // console.log(WalletConnectQRCodeModal, 'WalletConnectQRCodeModal');

  await provider.enable();
  // console.log(provider);

 

  // console.log(walletconnect, 'walletconnect');
  // console.log(web3Modal, ',web3Modal');

  // 现有
  connector.createSession().then((response) => {
    // eslint-disable-next-line prefer-destructuring
    const uri = connector.uri;
    // display QR Code modal
    WalletConnectQRCodeModal.open(uri, () => {
      console.log('QR Code Modal closed');
    });
  });
  provider.enable().then((result) => {
    const resultAddress = result[0];
    // console.log(resultAddress, 'resultAddress');
    window.localStorage.setItem('walletconnectAdd', resultAddress);
    connect(resultAddress, provider);

    const accessToken = getToken('atk');
    // console.log(accessToken);
  });
setTimeout(()=>{
  WalletConnectQRCodeModal.close();
},2000)
}catch(error){
window.location.reload()

}


    // 原来的
    // const provider = await web3Modal.connect();

    // setShowModal(true);
    // console.log(1,provider);

    // await web3Modal.toggleModal();
    // console.log(2,web3Modal);
    // const web_3 = new WalletConnectProvider(provider);
    // setw3(web_3);
    // console.log(3,web_3);

    // await subscribeProvider(provider, web_3, web3Modal);

    // 截止
    window.localStorage.setItem('LoginType', 'wallextConnect');
    setLoading(false);
    // return web_3;
  }, [subscribeProvider]);
  // console.log(window.localStorage.getItem('walletconnect'))
 

  const clientId =
    'BMZn0DvGmTwd5z8riV1hiTES5s0IUai_BXKuvhiCJxRQeVFmY6pGAFnP4ZLp8wYa69jh1oVhDxXpGm8DH4_etQs';

  useEffect(() => {
    const init = async () => {
      try {
        const coreWeb3auth = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x1',
            rpcTarget: 'https://mainnet.infura.io/v3/04e6d8eadecd41d68beb8f5e1a57dd7e', // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(coreWeb3auth);
        const torusWalletAdapter = new TorusWalletAdapter({
          adapterSettings: {
            buttonSize: 0,
          },
          clientId,
          initParams: {
            whiteLabel: {
              theme: {
                isDark: window.localStorage.getItem('darkLight') === 'false',
                colors: { primary: '#00a8ff' },
              },
              logoDark: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
              logoLight: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
              defaultLanguage: 'en',
            },
          },
          sessionTime: 3600 * 24 * 7, // 1 hour in seconds
        });

        coreWeb3auth.configureAdapter(torusWalletAdapter);

        await coreWeb3auth.init();

        if (coreWeb3auth.provider) {
          setProviderWeb3auth(coreWeb3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const logout = React.useCallback(() => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }

    window.localStorage.setItem('LoginType', null);
    window.localStorage.setItem('addressGetAccounts', null);
    web3auth.logout();
    window.localStorage.clear();
    setWeb3AuthAddress(null);

    setProviderWeb3auth(null);

    if (pathname !== '/') {
      window.location.href = '/';
      window.localStorage.setItem('LoginType', null);
      window.localStorage.setItem('addressGetAccounts', null);
      window.localStorage.clear();
    } else {
      window.location.reload();
      window.localStorage.setItem('LoginType', null);
      window.localStorage.setItem('addressGetAccounts', null);
      window.localStorage.clear();
    }
    removeToken('atk');
    setIdTokenWeb3(null);
  }, [web3auth, idTokenWeb3, web3AuthAddress, pathname]);
  const getAccounts = React.useCallback(async () => {
    if (!providerWeb3auth) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(providerWeb3auth);

    const addressGetAccounts = await rpc.getAccounts();
    window.localStorage.setItem('addressGetAccounts', addressGetAccounts);

    setWeb3AuthAddress(addressGetAccounts);

    if (idTokenWeb3 && web3AuthAddress) {
      setToken('atk', `${idTokenWeb3}-.-${web3AuthAddress}`);
      const webGetBase = getBaseInfo(getToken('atk'));
      Router.push({
        pathname: '/profile',
        query: {
          type: 'parcellist',
        },
      });
      webGetBase.then((webGetBase1) => {
        state.setState({
          profile: {
            address: webGetBase1?.data?.profile?.address,
            nickName: webGetBase1?.data?.profile?.nick_name,
            avatar: webGetBase1?.data?.profile?.avatar,
          },
        });
      });
    }
  }, [providerWeb3auth, idTokenWeb3, web3AuthAddress]);

  const authenticateUser = React.useCallback(async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    const idTokenAuthenticateUser = await web3auth.authenticateUser();
    setIdTokenWeb3(idTokenAuthenticateUser.idToken);
    window.localStorage.setItem('idTokenAuthenticateUser', idTokenAuthenticateUser.idToken);

    setShowMenu(true);
  }, [idTokenWeb3, web3AuthAddress, showMenu, providerWeb3auth, idTokenWeb3, web3auth]);
  const profilConent = React.useCallback(async () => {
    const profilemetaMask = window.localStorage.getItem('metaMaskAddress');
    if (profilemetaMask !== null) {
      const metaCatAtk = window.localStorage.getItem('METACAT_atk');
      if (metaCatAtk) {
        const renConcent = getBaseInfo(metaCatAtk);
        Router.push({
          pathname: '/profile',
          query: {
            type: 'parcellist',
          },
        });
        renConcent.then((renConcent1) => {
          setProfileConcent(renConcent1.profile?.address);
          state.setState({
            profile: {
              address: renConcent1?.data?.profile?.address,
              nickName: renConcent1?.data?.profile?.nick_name,
              avatar: renConcent1?.data?.profile?.avatar,
            },
          });
        });
      }
    }
  }, [profileData]);

  useEffect(() => {
    const metaCatAtk = window.localStorage.getItem('METACAT_atk');

    if (!metaCatAtk) {
      setTimeout(() => {
        profilConent();
      }, 2000);
    } else {
      const renConcent = getBaseInfo(metaCatAtk);

      renConcent.then((renConcent1) => {
        setProfileConcent(renConcent1.profile?.address);
        state.setState({
          profile: {
            address: renConcent1?.data?.profile?.address,
            nickName: renConcent1?.data?.profile?.nick_name,
            avatar: renConcent1?.data?.profile?.avatar,
          },
        });
      });
    }

    const loginCon = window.localStorage.getItem('LoginType');
    setLoginState(loginCon);
    if (idTokenWeb3 && web3AuthAddress) {
      setToken('atk', `${idTokenWeb3}-.-${web3AuthAddress}`);
    }
  }, [loginState]);

  const login = React.useCallback(async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }

    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.TORUS_EVM);

      setProviderWeb3auth(web3authProvider);
      const idtoken = authenticateUser();
      // idtoken.then((res) => {});
      if (idtoken !== null) {
        const address3 = getAccounts();
        // address3.then((res) => {});
      }
    } catch (error) {
      if (error.message === 'Failed to connect with wallet. Already connected') {
        getAccounts();
        const idtoken = authenticateUser();
        idtoken.then((res) => {
          console.log(res);
        });
        if (idtoken !== null) {
          const address3 = getAccounts();
          address3.then((res) => {
            console.log(res);
          });
        }
      }
    }

    window.localStorage.setItem('LoginType', 'web3Auth');
  }, [providerWeb3auth, web3auth, showMenu, web3AuthAddress, idTokenWeb3]);

  const clickItem = React.useCallback(
    (item) => {
      if (!profile?.address) {
        window.localStorage.clear();
      }

      setShowWall(item.value);
      // if (item.type === "wallet") {
      if (!profile?.address && item?.value === 'metamask') {
        connectToChain();
      }
      if (!profile.address && item.value === 'walletconnect') {
        walletconnect();
      }
      // }
      if (item.type === 'login') {
        login();
      }
      if (item.type === 'loginOut') {
        logout();
      }
    },
    [profile, connectToChain, login],
  );

  const clickOperationItem = React.useCallback(
    async (item) => {
      if (window.localStorage.getItem('LoginType') === 'web3Auth') {
        if (item.value === 'resetApp') {
          setProviderWeb3auth(null);
          setWeb3AuthAddress(null);

          logout();

          removeToken('atk');
        }
        setShowMenu(false);
      } else if (window.localStorage.getItem('LoginType') === 'metaMask' && profile?.address) {
        if (item.value === 'resetApp') {
          removeToken('atk');
          removeToken('rtk');
          removeToken('address');
          // if (w3) {
          //   w3.resetApp()
          // }
          if (web3) {
            web3?.resetApp();
          }
          window.localStorage.clear();

          state.setState({
            accessToken: '',
            refreshToken: '',
            profile: { address: null, nickName: null, avatar: null },
          });

          if (pathname !== '/') {
            window.location.href = '/';
          } else {
            window.location.reload();
          }
        }
        setShowMenu(false);
      } else if (window.localStorage.getItem('LoginType') === 'wallextConnect') {
        if (item.value === 'resetApp') {
          // provider.close().then(()=>{
          //   console.log('Wallet disconnected!');
          // })
          removeToken('atk');
          removeToken('rtk');
          removeToken('address');
          state.setState({
            accessToken: '',
            refreshToken: '',
            profile: { address: null, nickName: null, avatar: null },
          });
          if (pathname !== '/') {
            window.location.href = '/';
          } else {
            window.location.reload();
          }
          window.localStorage.setItem('LoginType', null);
          window.localStorage.setItem('METACAT_atk', null);
          window.localStorage.clear();
        }
      }
    },
    [logout, pathname, web3, loginState, profile],
    // w3
  );

  const render = React.useMemo(() => {
    if (profile?.address || (web3AuthAddress && idTokenWeb3)) {
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
                className={style.wordCon}
                onClick={() => {
                  clickOperationItem(item);
                }}
              >
                <div className={cn('flex items-center justify-around', style.li2)}>
                  <img src={item.icon} className={cn('mr-2', style.operation)}></img>
                  <span>{item.label}</span>
                </div>
                <img src="/images/v5/arrow-simple.png" className={style.activeOperation}></img>
              </div>
            ) : (
              <Link href={item.value}>
                <div className={style.wordCon}>
                  <div className={cn('flex items-center justify-around', style.li2)}>
                    <img src={item.icon} className={cn('mr-2', style.operation)}></img>
                    <span>{item.label}</span>
                  </div>
                  <img src="/images/v5/arrow-simple.png" className={style.activeOperation}></img>
                </div>
                {/* <div className="grid">{provider ? loggedInView : unloggedInView}</div> */}
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
            <img src="/images/v5/arrow.png" className={style.activeWallet}></img>
            {/* {showModal && (
       <QRCodeModal
         size={256}
           onClose={() => setShowModal(false)}
           URI={web3Modal.cachedProvider}
         />
         )}  */}
            {/* {loading === true ? (
              <img
                src="/images/loading.png"
                className={cn("animate-spin", style.loading)}
              />
            ) : (
              <img
                src="/images/v5/arrow.png"
                className={style.activeWallet}
              ></img>
            )} */}
          </div>
        </li>
      );
    });
  }, [profile, clickItem, web3AuthAddress, clickOperationItem, idTokenWeb3, loading, showWall]);

  const getText = React.useMemo(() => {
    let text = 'Connect';
    if (profile?.address) {
      if (profile?.nickName && profile?.address) {
        // console.log(profile);
        text = profile?.nickName;
      } else {
        text = clipName(profile?.address);
        setShowMenu(!showMenu);
      }
    } else if (!profile?.address) {
      getAccounts();
      if (web3AuthAddress && idTokenWeb3) {
        text = web3AuthAddress;
        setShowMenu(!showMenu);
      } else {
        text = 'Connect';
        // setShowMenu(true);
      }
    }

    return (
      <>
        <div style={{ display: 'flex' }}>
          {profile?.address || (web3AuthAddress && providerWeb3auth !== null && idTokenWeb3) ? (
            <img className={cn('mr-1 ', style.avatar)} src={profile.avatar || '/images/icon.png'} />
          ) : (
            <img className={cn('mr-1 ', style.avatar)} src="/images/v5/wallet.png" />
          )}
          <div
            title={text}
            className={cn(
              'font-semibold truncate',
              style.walletText,
              profile?.address ? 'text-xs' : 'text-base',
            )}
          >
            {text}
          </div>
        </div>
      </>
    );
  }, [profile, clipName, web3AuthAddress, providerWeb3auth, idTokenWeb3, logout]);

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
    <div className={cn('cursor-pointer', style.btn)}>
      <div
        className={cn('flex justify-center items-center w-full h-full text-xs', style.btnDiv)}
        onClick={onClick}
      >
        {getText}
      </div>
      <div style={{ borderRadius: '6px' }}>
        <ul className={cn('list-none mt-2 z-20', style.menu)}>{showMenu && render}</ul>
      </div>
    </div>
  );
}
