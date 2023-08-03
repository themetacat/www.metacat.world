import React, { useCallback, useEffect, forwardRef,useState,useRef,useImperativeHandle} from "react";
import cn from "classnames";
import style from "./index.module.css";
import Rekv from "rekv";
import Link from "next/link";
import Web3 from "web3";
import { toast } from "react-hot-toast";
import { useWalletProvider } from "../web3modal";
import { Web3AuthCore } from "@web3auth/core";
import RPC from "../web3RPC";
import Router, { useRouter } from "next/router";
import {
    CHAIN_NAMESPACES,
    SafeEventEmitterProvider,
    WALLET_ADAPTERS,
  } from "@web3auth/base";

import {
    getNonce,
    loginSignature,
    getBaseInfo,
    getCVEventList,
  } from "../../service";
  import { convert, getToken, removeToken, setToken } from "../../common/utils";

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
  type Props = {
    name?: string;
    address?: string;
    ref?;
    onClickHandler?: () => void;
  };
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
  const WALLET = [
    {
      label: "MetaMask",
      icon: "/images/v5/Maskgroup.png",
      value: "metamask",
      type: "walletMetaMask",
    },
    // {
    //   label: "Wallet Connect",
    //   icon: "/images/walletconnect.png",
    //   value: "walletconnect",
    //   type: "wallet",
    // },
    // {
    //   label: "Others(Meta,Twitter...)",
    //   icon: "/images/v5/login.jpg",
    //   value: "loginConnevt",
    //   type: "login",
    // },
    // {
    //   label: "Mint",
    //   icon: "/images/PicLogo.jpg",
    //   value: "mintConnevt",
    //   type: "mint",
    // },
  ];
  const MENU = [
    // {
    //   label: "Setting",
    //   icon: "/images/v5/Settings.png",
    //   value: "/profile/setting",
    //   type: "operation",
    // },
    // {
    //   label: "My Parcels",
    //   icon: "/images/v5/MyParcels.png",
    //   value: "/profile?type=parcellist",
    //   type: "operation",
    // },
    // {
    //   label: "My Wearables",
    //   icon: "/images/icon/wearables.png",
    //   value: "/profile?type=wearablelist",
    //   type: "operation",
    // },
    // {
    //   label: "My Buildings",
    //   icon: "/images/icon/buildingIcon.png",
    //   value: "/profile?type=building",
    //   type: "operation",
    // },
    {
      label: "Disconnect",
      icon: "/images/v5/Signout.png",
      value: "resetApp",
      type: "operation",
    },
    // {
    //   label: "Mint",
    //   icon: "/images/PicLogo.jpg",
    //   value: "mintConnevt",
    //   type: "mint",
    // },
  ];
  export const state = new Rekv<IProfileData>(INITIAL_STATE);
export default function HomePage({ onClickHandler }: Props,ref) {
    const router = useRouter();
    const funRef = useRef()
    const { pathname } = router;
    const [showWall, setShowWall] = React.useState(null);
    const [loginState, setLoginState] = React.useState("web3Auth");
    const [showMenu, setShowMenu] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [web3auth, setWeb3auth] = React.useState<Web3AuthCore | null>(null);
    const [providerWeb3auth, setProviderWeb3auth] =
    React.useState<SafeEventEmitterProvider | null>(null);
    const [web3AuthAddress, setWeb3AuthAddress] = React.useState(null);
    const [idTokenWeb3, setIdTokenWeb3] = React.useState(null);
    const profileData = state.useState(
        "accessToken",
        "idToken",
        "refreshToken",
        "profile"
      );
      const web3 = useWalletProvider();
      const { accessToken, idToken, refreshToken, profile } = profileData;
     // 将子组件暴露的方法绑定到 ref 上
  // useImperativeHandle(ref, () => ({
  //   onClick: onClick
  // }));
      const onClick = React.useCallback(
        (event) => {
          console.log(showMenu);
          
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
            // Router.push({
            //   pathname: '/profile',
            //   query: {
            //     type: 'parcellist',
            //   },
            // });
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
        setTimeout(() => {
          setLoading(false);
        }, 5000);
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
          const networkId = await window.ethereum.request({
            method: "net_version",
          });
          console.log(networkId === "11155111", "networkId", networkId);
          // 判断当前网络是否为 Ethereum Sepolia 网络
          // await  window.ethereum.request({
          //   method: 'wallet_switchEthereumChain',
          //   params: [{ chainId: '11155111' }],
          // });
          if (networkId !== "11155111") {
            // 根据需要跳转到引导转换网络的网页或执行其他逻辑
            // window.open("https://example.com");
            // return;
            const chainId = "0x" + (11155111).toString(16);
            console.log(chainId, "chainId");
    
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: chainId,
                },
              ],
            });
          }
    
          web3.connect().then(
            async (res) => {
              console.log("connect==>", res);
              const { address: addr, provider } = res;
    
              connect(addr, provider);
              window.localStorage.setItem("metaMaskAddress", res.address);
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
      const authenticateUser = React.useCallback(async () => {
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
    
        setShowMenu(true);
      }, [
        idTokenWeb3,
        web3AuthAddress,
        showMenu,
        providerWeb3auth,
        idTokenWeb3,
        web3auth,
      ]);
      
  const getAccounts = React.useCallback(async () => {
    if (!providerWeb3auth) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(providerWeb3auth);

    const addressGetAccounts = await rpc.getAccounts();
    window.localStorage.setItem("addressGetAccounts", addressGetAccounts);

    setWeb3AuthAddress(addressGetAccounts);

    if (idTokenWeb3 && web3AuthAddress) {
      setToken("atk", `${idTokenWeb3}-.-${web3AuthAddress}`);
      const webGetBase = getBaseInfo(getToken("atk"));
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
          idtoken.then((res) => {});
          if (idtoken !== null) {
            const address3 = getAccounts();
            address3.then((res) => {});
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
    
        window.localStorage.setItem("LoginType", "web3Auth");
      }, [providerWeb3auth, web3auth, showMenu, web3AuthAddress, idTokenWeb3]);
      const logout = React.useCallback(() => {
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
    
        if (pathname !== "/") {
          window.location.href = "/";
          window.localStorage.setItem("LoginType", null);
          window.localStorage.setItem("addressGetAccounts", null);
          window.localStorage.clear();
        } else {
          // window.location.reload();
          window.localStorage.setItem("LoginType", null);
          window.localStorage.setItem("addressGetAccounts", null);
          window.localStorage.clear();
        }
        removeToken("atk");
        setIdTokenWeb3(null);
      }, [web3auth, idTokenWeb3, web3AuthAddress, pathname]);
    const clickItem = React.useCallback(
        (item) => {
          if (!profile?.address) {
            window.localStorage.clear();
          }
    
          setShowWall(item.value);
          // if (item.type === "wallet") {
          if (!profile?.address && item?.value === "metamask") {
            connectToChain();
          }
        //   if (!profile.address && item.value === "walletconnect") {
        //     walletconnect();
        //   }
          if (item.type === "login") {
            login();
          }
          if (item.type === "loginOut") {
            logout();
          }
        },
        [profile, connectToChain, login]
      );
      const clickOperationItem = React.useCallback(
        async (item) => {
          if (window.localStorage.getItem("LoginType") === "web3Auth") {
            if (item.value === "resetApp") {
              setProviderWeb3auth(null);
              setWeb3AuthAddress(null);
    
              logout();
    
              removeToken("atk");
            }
            setShowMenu(false);
          } else if (
            window.localStorage.getItem("LoginType") === "metaMask" &&
            profile?.address
          ) {
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
              window.localStorage.clear();
    
              state.setState({
                accessToken: "",
                refreshToken: "",
                profile: { address: null, nickName: null, avatar: null },
              });
    
              if (pathname !== "/") {
                window.location.href = "/";
              } else {
                // window.location.reload();
              }
            }
            setShowMenu(false);
          } else if (window.localStorage.getItem("LoginType") === "walletConnect") {
            if (item.value === "resetApp") {
              removeToken("atk");
              removeToken("rtk");
              removeToken("address");
              state.setState({
                accessToken: "",
                refreshToken: "",
                profile: { address: null, nickName: null, avatar: null },
              });
              if (pathname !== "/") {
                window.location.href = "/";
              } else {
                // window.location.reload();
              }
              window.localStorage.setItem("LoginType", null);
              window.localStorage.setItem("METACAT_atk", null);
              window.localStorage.clear();
            }
          }
        },
        [logout, pathname, web3, loginState, profile]
        // w3
      );
    
    const render = React.useMemo(() => {
        if (profile?.address) {
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
                    className={style.wordCon}
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
                    <div className={style.wordCon}>
                      <div>
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
                <img
                  src="/images/v5/arrow.png"
                  className={style.activeWallet}
                ></img>
              </div>
            </li>
          );
        });
      }, [
        profile,
        clickItem,
        web3AuthAddress,
        clickOperationItem,
        idTokenWeb3,
        loading,
        showWall,
      ]);

      const renderContent = React.useMemo(() => {
        if( !profile.address){
        return(
          <>
         
        <div className={style.conRend}>
                <img src="/images/close-pop.png" alt="" className={style.conRendImg}
                    onClick={()=>{
                      setShowMenu(false);
                    }}/>
        <p className={style.conRendP1}>Connect wallet</p>
        <p className={style.conRendP2}>How would you like to connect?</p>
        {render}
        </div>
          

          </>
        )
      }
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
                className={style.wordCon}
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
                <div className={style.wordCon}>
                  <div>
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
      }, [  profile,
        clickItem,
        web3AuthAddress,
        clickOperationItem,
        idTokenWeb3,
        loading,
        showWall,]);
        const clipName = React.useCallback(
          (addres) => {
            if (addres?.length > 8) {
              const end = addres.length - 4;
              const all = addres.slice(6, end);
              return addres.replace(all, "***");
            }
            return addres;
          },
          [null]
        );
      
    const getText = React.useMemo(() => {
        let text = "Connect";
        if (profile?.address) {
          if ( profile?.address) {
            // console.log(profile);
            // text = profile?.nickName;
            text = clipName(profile?.address);
            // setShowMenu(true);
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
            text = "Connect";
          }
        }
    
        return (
          <>
            <div style={{ display: "flex" }}>
              {/* {profile?.address ||
              (web3AuthAddress && providerWeb3auth !== null && idTokenWeb3) ? 
              (
                <img
                  className={cn("mr-1 ", style.avatar)}
                  src={profile.avatar || "/images/icon.png"}
                />
              ) 
              : 
              (
                <img
                  className={cn("mr-1 ", style.avatar)}
                  src="/images/v5/wallet.png"
                />
              )} */}
              <div
                title={text}
                className={cn(
                  "font-semibold truncate",
                  style.walletText,
                  profile?.address ? "text-xs" : "text-base"
                )}
              >
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
        showMenu
      ]);
      const profilConent = React.useCallback(async () => {
        const profilemetaMask = window.localStorage.getItem("metaMaskAddress");
        if (profilemetaMask !== null) {
          const metaCatAtk = window.localStorage.getItem("METACAT_atk");
          if (metaCatAtk) {
            const renConcent = getBaseInfo(metaCatAtk);
            renConcent.then((renConcent1) => {
              // setProfileConcent(renConcent1.profile?.address);
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
        const metaCatAtk = window.localStorage.getItem("METACAT_atk");
    
        if (!metaCatAtk) {
          setTimeout(() => {
            profilConent();
          }, 2000);
        } else {
          const renConcent = getBaseInfo(metaCatAtk);
    
          renConcent.then((renConcent1) => {
            // setProfileConcent(renConcent1.profile?.address);
            state.setState({
              profile: {
                address: renConcent1?.data?.profile?.address,
                nickName: renConcent1?.data?.profile?.nick_name,
                avatar: renConcent1?.data?.profile?.avatar,
              },
            });
          });
        }
    
        const loginCon = window.localStorage.getItem("LoginType");
        setLoginState(loginCon);
        if (idTokenWeb3 && web3AuthAddress) {
          setToken("atk", `${idTokenWeb3}-.-${web3AuthAddress}`);
        }
      }, [loginState]);
      const mintBag = ()=>{
        console.log(11111);
        
      }
  return (
    <>
    <div className={cn('',style.homeContent)}>
      <div className={cn('',style.homeC)}>
      <div className={style.titCon}>Wearable Pack</div>
        <div className={cn('',style.btnContent)}>
        <div
          className={cn(
            "flex justify-center items-center w-full h-full text-xs",
            style.btnDiv
          )}
          onClick={onClick}
        >
          {getText}
        </div>
        </div>
      </div>
       
        <div style={{ borderRadius: "6px", marginTop: "5px"}} className={cn(profile.address?style.Addr:style.Addr1)}>
          {/* <ul className={cn("list-none mt-2 z-20")}></ul> */}
          {showMenu && renderContent}
        </div>
        <div className={style.container}>
          <p>Pack Your Wearable.</p>
          <p  className={style.PBox}>UseERC-6551to package and sell your Wearables.</p>
          <div className={style.bttBox} onClick={mintBag}>Mint Bag</div>
        </div>
    </div>
    </>
  )
}
