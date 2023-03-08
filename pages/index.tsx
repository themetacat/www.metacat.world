/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import cn from "classnames";
import "tailwindcss/tailwind.css";
import { Web3AuthCore } from "@web3auth/core";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import Rekv from "rekv";
import Link from "next/link";

import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

import Router, { useRouter } from "next/router";

import { toast } from "react-hot-toast";
import RPC from "../components/web3RPC";
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import Web3Modal from 'web3modal';

// import { useWalletProvider } from '../web3moda2';
import { useWalletProvider } from "../components/web3modal";

import { getNonce, loginSignature, getBaseInfo } from "../service";
import { req_user_logout } from "../service/z_api";

import { convert, getToken, removeToken, setToken } from "../common/utils";

import style from "./index.module.css";

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
    label: "Setting",
    icon: "/images/v5/Settings.png",
    value: "/profile/setting",
    type: "operation",
  },
  {
    label: "My Parcels",
    icon: "/images/v5/MyParcels.png",
    value: "/profile?type=parcellist",
    type: "operation",
  },
  {
    label: "My Wearables",
    icon: "/images/icon/wearables.png",
    value: "/profile?type=wearablelist",
    type: "operation",
  },
  {
    label: "My Buildings",
    icon: "/images/icon/buildingIcon.png",
    value: "/profile?type=building",
    type: "operation",
  },
  {
    label: "Sign Out",
    icon: "/images/v5/Signout.png",
    value: "resetApp",
    type: "operation",
  },
  // {
  //   label: 'Sign Out',
  //   icon: '/images/v5/Signout.png',
  //   value: 'resetAppWeb3',
  //   type: 'operation',
  // },
];

const WALLET = [
  {
    label: "MetaMask",
    icon: "/images/v5/Maskgroup.png",
    value: "metamask",
    type: "wallet",
  },
  // {
  //   label: 'Wallet Connect',
  //   icon: '/images/walletconnect.png',
  //   value: 'walletconnect',
  //   type: 'wallet',
  // },
  {
    label: "Others(Meta,Twitter...)",
    icon: "/images/v5/login.jpg",
    value: "loginConnevt",
    type: "login",
  },
  // {
  //   label: 'Login Out',
  //   icon: '/images/walletconnect.png',
  //   value: 'loginOut',
  //   type: 'loginOut',
  // },
];

export const state = new Rekv<IProfileData>(INITIAL_STATE);

export default function WalletBtn({ name, address, onClickHandler }: Props) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const profileData = state.useState(
    "accessToken",
    "idToken",
    "refreshToken",
    "profile"
  );
  const { accessToken, idToken, refreshToken, profile } = profileData;

  const [showWall, setShowWall] = React.useState(null);
  const [providerWeb3auth, setProviderWeb3auth] =
    useState<SafeEventEmitterProvider | null>(null);

  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);

  const [web3AuthAddress, setWeb3AuthAddress] = React.useState(null);
  const [idTokenWeb3, setIdTokenWeb3] = React.useState(null);
  const [loginState, setLoginState] = React.useState("web3Auth");
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
    [null]
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
        setToken("atk", data.accessToken);
        setToken("rtk", data.refreshToken);
        Router.push({
          pathname: "/profile",
          query: {
            type: "parcellist",
          },
        });
      }
      setShowMenu(false);
      setLoading(false);
    },
    [resultHandler]
  );

  const requireNonce = React.useCallback(
    async (addr) => {
      const res = await getNonce(addr);
      return resultHandler(res);
    },
    [resultHandler]
  );

  const connect = React.useCallback(
    async (addr, providerCon) => {
      const nonceData = await requireNonce(addr);
      if (nonceData) {
        const { address: add, nonce } = nonceData;
        providerCon
          .request({ method: "personal_sign", params: [nonce, add] })
          .then(
            async (signature) => {
              const result = await loginSignature(add, signature);
              checkLoginStatu(result);
            },
            (error: any) => {
              setLoading(false);
            }
          );
      }
    },
    [requireNonce, checkLoginStatu]
  );

  const connectToChain = React.useCallback(async () => {
    setLoading(true);

    if (
      typeof (window as any).ethereum === "undefined" ||
      !(window as any).ethereum.isMetaMask
    ) {
      setLoading(false);
      setShowMenu(false);
      window.open("https://metamask.io/");
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
      console.log(web3, 6666);

      web3.connect().then(
        async (res) => {
          console.log(244);
          const { address: addr, provider } = res;
          connect(addr, provider);
        },
        (err) => {
          setLoading(false);
        }
      );
      window.localStorage.setItem("LoginType", "metaMask");
    } catch {
      setLoading(false);
    }
  }, [web3, connect]);

  const clipName = React.useCallback(
    (addres) => {
      if (addres?.length > 8) {
        const end = addres.length - 4;
        const all = addres.slice(4, end);
        return addres.replace(all, "***");
      }
      return addres;
    },
    [null]
  );

  const onClick = React.useCallback(
    (event) => {
      console.log(showMenu, idTokenWeb3, 888888888888);
      if (idTokenWeb3 === null) {
        setShowMenu(false);
      }
      event.nativeEvent.stopImmediatePropagation();
      setShowMenu(!showMenu);
      if (onClickHandler) {
        onClickHandler();
      }
    },
    [showMenu, onClickHandler, idTokenWeb3]
  );

  const closeApp = async (newWeb3) => {
    if (newWeb3 && newWeb3.currentProvider && newWeb3.currentProvider.close) {
      await newWeb3.currentProvider.close();
    }
    await newWeb3.clearCachedProvider();
  };

  // const subscribeProvider = React.useCallback(async (providerDa, newWeb3, modal) => {
  //   const { nonce, address: add } = await requireNonce(providerDa.accounts[0]);
  //   providerDa.request({ method: 'personal_sign', params: [nonce, add] }).then((resD) => {
  //     loginSignature(add, resD).then((resData) => {
  //       checkLoginStatu(resData);
  //     }, (res1) => {

  //     })
  //   }, (error) => {
  //     if (w3) {
  //       w3.resetApp()
  //     }
  //   })

  //   if (!providerDa.on) {
  //     return;
  //   }

  //   //   //断开连接
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
  //     await provider.clearCachedProvider();
  //   });
  //   provider.on('accountsChanged', async (accounts) => {
  //     const addressData = await accounts[0];
  //   });
  // }, [w3])

  // const walletconnect = React.useCallback(async () => {

  //   const providerOptions = {
  //     walletconnect: {
  //       package: WalletConnectProvider,
  //       options: {
  //         infuraId: '7b9fdfd5be844ea3b9f2988619123ced',
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
  //   const providerDataText = await web3Modal.connect()
  //   await web3Modal.toggleModal()
  //   const web_3 = new WalletConnectProvider(providerDataText)

  //   setw3(web_3)
  //   await subscribeProvider(providerDataText, web_3, web3Modal)
  //   return web_3
  // }, [subscribeProvider])
  const clientId =
    "BMZn0DvGmTwd5z8riV1hiTES5s0IUai_BXKuvhiCJxRQeVFmY6pGAFnP4ZLp8wYa69jh1oVhDxXpGm8DH4_etQs";

  useEffect(() => {
    const init = async () => {
      try {
        const coreWeb3auth = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget:
              "https://mainnet.infura.io/v3/04e6d8eadecd41d68beb8f5e1a57dd7e", // This is the public RPC we have added, please pass on your own endpoint while creating an app
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
                isDark: window.localStorage.getItem("darkLight") === "false",
                colors: { primary: "#00a8ff" },
              },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
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
    console.log("退出");
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    window.localStorage.setItem("LoginType", null);
    window.localStorage.setItem("addressGetAccounts", null);
    web3auth.logout();
    window.localStorage.clear();
    setWeb3AuthAddress(null);

    setProviderWeb3auth(null);
    console.log(idTokenWeb3, web3AuthAddress);

    if (pathname !== "/") {
      window.location.href = "/";
      window.localStorage.setItem("LoginType", null);
      window.localStorage.setItem("addressGetAccounts", null);
      window.localStorage.clear();
    } else {
      window.location.reload();
      window.localStorage.setItem("LoginType", null);
      window.localStorage.setItem("addressGetAccounts", null);
      window.localStorage.clear();
    }
    removeToken("atk");
    setIdTokenWeb3(null);
    // console.log(getToken('atk'),555555555555);

    // setShowMenu(false);
  }, [web3auth, idTokenWeb3, web3AuthAddress, pathname]);
  const getAccounts = React.useCallback(async () => {
    // setGetAccountsState(true)
    // const promise = new Promise(async (resolve, reject) => {
    if (!providerWeb3auth) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(providerWeb3auth);

    const addressGetAccounts = await rpc.getAccounts();
    // setGetAccountsState(false)
    window.localStorage.setItem("addressGetAccounts", addressGetAccounts);
    console.log(window.localStorage.getItem("addressGetAccounts"), 6666666);

    setWeb3AuthAddress(addressGetAccounts);
    // resolve(address)
    // reject(address)
    // })

    // return promise
  }, [providerWeb3auth]);

  const authenticateUser = React.useCallback(async () => {
    // console.log(web3AuthAddress,888888888888)

    // const promise = new Promise(async (resolve, reject) => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    const idTokenAuthenticateUser = await web3auth.authenticateUser();
    setIdTokenWeb3(idTokenAuthenticateUser.idToken);
    window.localStorage.setItem(
      "idTokenAuthenticateUser",
      idTokenAuthenticateUser.idToken
    );
    // resolve(idToken)
    // })
    // if(idToken||idTokenWeb3){
    setShowMenu(true);
    // }
    //  const address1= getAccounts()
    //  setToken('atk',idToken+'-'+address1)

    // setToken('atk',idToken.idToken+'-.-'+'0x60d136A10c67D534BB7822c175a44C855b2D9B57')

    // return promise
  }, [
    idTokenWeb3,
    web3AuthAddress,
    showMenu,
    providerWeb3auth,
    idTokenWeb3,
    web3auth,
  ]);
  useEffect(() => {
    // const LoginType = window.localStorage.getItem("LoginType") === "web3Auth";
    // console.log(window.localStorage.getItem("LoginType"));
    const idTokenAuthenticateUser = window.localStorage.getItem(
      "idTokenAuthenticateUser"
    );
    const addressGetAccounts =
      window.localStorage.getItem("addressGetAccounts");
    setIdTokenWeb3(idTokenAuthenticateUser);
    setWeb3AuthAddress(addressGetAccounts);

    setLoginState(window.localStorage.getItem("LoginType"));
    // console.log(LoginType,666666666666);
  }, [loginState, web3AuthAddress, idTokenWeb3]);
  useEffect(() => {
    if (idTokenWeb3 && web3AuthAddress) {
      setToken("atk", `${idTokenWeb3}-.-${web3AuthAddress}`);
      // setToken('atk',idTokenWeb3+'-.-'+web3AuthAddress)

      // window.location.href = '/profile?type=parcellist'
    }
    // setShowWall(false)

    // console.log(web3AuthAddress,idTokenWeb3,2222);
  }, [web3AuthAddress, loginState, idTokenWeb3, showMenu]);

  const login = React.useCallback(async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.TORUS_EVM
      );

      setProviderWeb3auth(web3authProvider);
      const idtoken = authenticateUser();
      idtoken.then((res) => {
        // console.log(res,web3AuthAddress, 2222);
      });
      if (idtoken !== null) {
        const address3 = getAccounts();
        address3.then((res) => {
          // WalletLoginError: Failed to connect with wallet. Already connected
        });
        // }else{
        //   setWeb3AuthAddress(null)
      }
    } catch (error) {
      if (
        error.message === "Failed to connect with wallet. Already connected"
      ) {
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

    // setLoginState('web3Auth')
    window.localStorage.setItem("LoginType", "web3Auth");
  }, [providerWeb3auth, web3auth, showMenu, web3AuthAddress, idTokenWeb3]);

  const clickItem = React.useCallback(
    (item) => {
      // console.log(!profile.address,item.value === 'metamask');

      setShowWall(item.value);
      if (item.type === "wallet") {
        if (!profile.address && item.value === "metamask") {
          connectToChain();
        }
        // if (!profile.address && item.value === 'walletconnect') {
        //   console.log(444444444);

        //   walletconnect()
        // }
      }
      if (item.type === "login") {
        // if (!web3auth) {
        //   console.log("web3auth not initialized yet");
        //   return;
        // }
        // const web3authProvider = await web3auth.connectTo(
        //   WALLET_ADAPTERS.TORUS_EVM,
        // );
        // setProvider(web3authProvider);
        // init()
        login();
        // authenticateUser()
        // getAccounts()
      }
      if (item.type === "loginOut") {
        logout();
      }
    },
    [profile, connectToChain, login]
    // walletconnect
  );

  // const demo = React.useCallback(async () => {
  //   console.log(await p1.enable())
  //   const i = await p1.enable();

  //   provider.on("accountsChanged", (accounts: string[]) => {
  //     console.log(accounts);
  //   });

  //   // Subscribe to chainId change
  //   provider.on("chainChanged", (chainId: number) => {
  //     console.log(chainId);
  //   });

  //   // Subscribe to session disconnection
  //   provider.on("disconnect", (code: number, reason: string) => {
  //     console.log(code, reason);
  //   });
  //   return await i
  //   // return  i
  // }, [p1])

  const clickOperationItem = React.useCallback(
    async (item) => {
      // console.log(loginState);

      // console.log(idTokenWeb3,web3AuthAddress,profile?.address,);
      // return;
      if (loginState === "web3Auth") {
        if (item.value === "resetApp") {
          setProviderWeb3auth(null);
          setWeb3AuthAddress(null);
          // console.log(11111);

          logout();

          removeToken("atk");
        }
        setShowMenu(false);
      } else if (profile?.address && loginState === "metaMask") {
        if (item.value === "resetApp") {
          removeToken("atk");
          removeToken("rtk");
          removeToken("address");
          // if (w3) {
          //   w3.resetApp()
          // }
          if (web3) {
            web3?.resetApp();
          }
          state.setState({
            accessToken: "",
            refreshToken: "",
            profile: { address: null, nickName: null, avatar: null },
          });
          // const res = await req_user_logout(accessToken);
          // console.log(res)
          if (pathname !== "/") {
            window.location.href = "/";
          }
        }
        setShowMenu(false);
      }
    },
    [logout, pathname, web3, loginState, profile]
    // w3
  );

  const render = React.useMemo(() => {
    // console.log(web3AuthAddress,idTokenWeb3,1111);

    if (profile?.address || (web3AuthAddress && idTokenWeb3)) {
      return MENU.map((item, idx) => {
        return (
          <li
            className={cn(
              "flex justify-between  items-center",
              style.menuItem,
              idx === MENU.length - 1 ? style.last : null
            )}
            key={idx}
          >
            {item.value === "resetApp" ? (
              <div
                className="w-full flex justify-between  items-center p-3 text-xs"
                onClick={() => {
                  clickOperationItem(item);
                }}
              >
                <div className="flex items-center justify-around">
                  <img
                    src={item.icon}
                    className={cn("mr-2", style.operation)}
                  ></img>
                  <span>{item.label}</span>
                </div>
                <img
                  src="/images/v5/arrow-simple.png"
                  className={style.activeOperation}
                ></img>
              </div>
            ) : (
              <Link href={item.value}>
                <div className="w-full flex justify-between  items-center p-3 text-xs">
                  <div className="flex items-center justify-around">
                    <img
                      src={item.icon}
                      className={cn("mr-2", style.operation)}
                    ></img>
                    <span>{item.label}</span>
                  </div>
                  <img
                    src="/images/v5/arrow-simple.png"
                    className={style.activeOperation}
                  ></img>
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
          className={cn(
            "flex justify-around items-center text-xs",
            style.walletItem
          )}
          key={idx}
          onClick={() => {
            clickItem(item);
          }}
        >
          <div
            className={cn(
              "flex justify-between items-center w-full h-full",
              style.walletContent
            )}
          >
            <div className="flex items-center justify-around">
              <img
                src={item.icon}
                className={cn("mr-2", style.walletLogo)}
              ></img>
              <span>{item.label}</span>
            </div>
            {loading === true ? (
              <img
                alt="/"
                src="/images/loading.png"
                className={cn(
                  "animate-spin",
                  style.loading,
                  loading && item.value === showWall ? null : " hidden"
                )}
              />
            ) : (
              <img
                alt=""
                src="/images/v5/arrow.png"
                className={cn(style.activeWallet, loading ? " hidden" : null)}
              ></img>
            )}

            {/* {loading ? (
              <img src="/images/loading.png" className={cn('animate-spin', style.loading)} />
            ) : (
              <img src="/images/v5/arrow.png" className={style.activeWallet}></img>
            )} */}
          </div>
        </li>
      );
    });
  }, [profile, clickItem, clickOperationItem, idTokenWeb3, loading, showWall]);

  const getText = React.useMemo(() => {
    let text = "Connect";
    if (profile.address) {
      if (profile.nickName) {
        text = profile.nickName;
      } else {
        text = clipName(profile.address);
      }
    } else if (!profile.address) {
      getAccounts();
      // console.log(web3AuthAddress,idTokenWeb3);

      if (web3AuthAddress && idTokenWeb3) {
        // console.log(web3AuthAddress&&idTokenWeb3);

        text = web3AuthAddress;
        // setShowWall(false)
        setShowMenu(!showMenu);
        // setLoading(false)
      } else {
        text = "Connect";
        setShowMenu(true);
      }
    }

    return (
      <>
        <div style={{ display: "flex" }}>
          {profile.address ||
          (web3AuthAddress && providerWeb3auth !== null && idTokenWeb3) ? (
            <img
              className={cn("mr-1 ", style.avatar)}
              src={profile.avatar || "/images/icon.png"}
            />
          ) : (
            <img className="mr-1" src="/images/v5/wallet.png" />
          )}
          <div
            title={text}
            className={cn(
              "font-semibold truncate",
              style.walletText,
              profile.address ? "text-xs" : "text-base"
            )}
          >
            {/* {provider===null?'Connect':text} */}
            {text}
          </div>
        </div>
      </>
    );
  }, [
    profile,
    clipName,
    web3AuthAddress,
    providerWeb3auth,
    idTokenWeb3,
    logout,
  ]);

  const requireBaseData = React.useCallback(
    async (tk) => {
      const res = await getBaseInfo(tk);
      const { data } = res;
      const { address: addr, avatar } = data;
      const newProfile = Object.assign({ address: addr, avatar }, profile);
      state.setState({ profile: newProfile });
    },
    [profile]
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
    document.addEventListener("click", close);
    return () => {
      document.removeEventListener("click", close);
    };
  }, [close]);
  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );
  const loggedInView = (
    <button onClick={logout} className="card">
      LogOut
    </button>
  );

  return (
    <div className={cn("cursor-pointer", style.btn)}>
      <div
        className={cn(
          "flex justify-center items-center w-full h-full text-xs",
          style.btnDiv
        )}
        onClick={onClick}
      >
        {getText}
      </div>
      <div style={{ borderRadius: "6px" }}>
        <ul className={cn("list-none mt-2 z-20")}>{showMenu && render}</ul>
      </div>
    </div>
  );
}
