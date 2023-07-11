import React, { useEffect, useState } from "react";
import cn from "classnames";
import { toast } from "react-hot-toast";
import "tailwindcss/tailwind.css";
import { Web3AuthCore } from "@web3auth/core";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnect from "@walletconnect/client";
import NodeWalletConnect from "@walletconnect/node";
import MintConcent from "./mintContent";
import Page from "../page";
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import Rekv from "rekv";
import Link from "next/link";

import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

import Router, { useRouter } from "next/router";

import RPC from "../web3RPC";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

import { useWalletProvider } from "../web3modal";

import {
  getNonce,
  loginSignature,
  getBaseInfo,
  getCVEventList,
} from "../../service";

import { convert, getToken, removeToken, setToken } from "../../common/utils";
import { SITE_NAME, META_DESCRIPTION } from "../../common/const";
import style from "./index.module.css";
import Web3 from "web3";

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
  //   label: "Mint",
  //   icon: "/images/PicLogo.jpg",
  //   value: "mintConnevt",
  //   type: "mint",
  // },
];

const WALLET = [
  {
    label: "MetaMask",
    icon: "/images/v5/Maskgroup.png",
    value: "metamask",
    type: "walletMetaMask",
  },
  {
    label: "Wallet Connect",
    icon: "/images/walletconnect.png",
    value: "walletconnect",
    type: "wallet",
  },
  {
    label: "Others(Meta,Twitter...)",
    icon: "/images/v5/login.jpg",
    value: "loginConnevt",
    type: "login",
  },
  // {
  //   label: "Mint",
  //   icon: "/images/PicLogo.jpg",
  //   value: "mintConnevt",
  //   type: "mint",
  // },
];

export const state = new Rekv<IProfileData>(INITIAL_STATE);
const meta = {
  title: ` ${SITE_NAME}`,
  description: META_DESCRIPTION,
};
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
  const [showModal, setShowModal] = useState(false);
  const [showWall, setShowWall] = React.useState(null);
  const [providerWeb3auth, setProviderWeb3auth] =
    useState<SafeEventEmitterProvider | null>(null);

  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);

  const [web3AuthAddress, setWeb3AuthAddress] = React.useState(null);
  const [idTokenWeb3, setIdTokenWeb3] = React.useState(null);
  const [loginState, setLoginState] = React.useState("web3Auth");
  const [profileConcent, setProfileConcent] = React.useState(null);
  const [mintConcent, setMintConcent] = React.useState(false);
  const [w3, setw3] = React.useState(null);
  const [num, setNum] = useState(1);

  const lower = () => {
    setNum(num - 1);
  };

  const increase = () => {
    setNum(num + 1);
  };

  const provider = new WalletConnectProvider({
    infuraId: "f9d7d835ed864a299a13e841a1b654f8",
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

  const subscribeProvider = React.useCallback(
    async (providerDa, newWeb3, modal) => {
      const { nonce, address: add } = await requireNonce(
        providerDa.accounts[0]
      );

      providerDa
        .request({ method: "personal_sign", params: [nonce, add] })
        .then(
          (resD) => {
            loginSignature(add, resD).then(
              (resData) => {
                checkLoginStatu(resData);
              },
              (res1) => {}
            );
          },
          (error) => {
            if (w3) {
              w3.resetApp();
            }
          }
        );

      if (!providerDa.on) {
        return;
      }

      //   //断开连接
      provider.on("close", async () => {
        removeToken("atk");
        removeToken("rtk");
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
        newWeb3.resetApp();
        await provider.killSession();
        await provider.clearCachedProvider();
      });
      provider.on("accountsChanged", async (accounts) => {
        const addressData = await accounts[0];
      });
    },
    [w3, requireNonce]
  );

  const walletconnect = React.useCallback(async () => {
    setLoading(true);

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "f9d7d835ed864a299a13e841a1b654f8",
          rpc: {
            1:
              "https://sepolia.infura.io/v3/04e6d8eadecd41d68beb8f5e1a57dd7e",
          },
          network: 1,
        },
      },
    };

    const web3Modal = new Web3Modal({
      // network: "mainnet",
      network: "sepolia",
      cacheProvider: true,
      providerOptions,
    });
    // 'https://registry.walletconnect.com/api/v2/wallets'
    {
      /* <WalletConnectQRCodeModal
         size={256}
           onClose={() => setShowModal(false)}
           URI={web3Modal.cachedProvider}
         /> */
    }
    // console.log(web3Modal,Web3Modal,web3Modal.cachedProvider,8888888);

    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: WalletConnectQRCodeModal,
    });
    // console.log(WalletConnect,999);

    // const uri = connector.uri
    // const clientId = connector.clientId
    //     WalletConnectQRCodeModal?.open(uri,
    //       () => {
    //     console.log("QR Code Modal closed");
    // },  )
    // await this.setState({ connector });
    // console.log(connector,8899,uri);
    // connector.createSession().then(() => {
    //   // get uri for QR Code modal
    //   const uri = connector.uri;
    //   // display QR Code modal
    //   WalletConnectQRCodeModal.open(uri, () => {
    //     console.log("QR Code Modal closed");
    //   });
    // });

    // console.log(3334,providerOptions.walletconnect.qrcodeModal, );

    const providerDataText = await web3Modal.connect();
    setShowModal(true);
    await web3Modal.toggleModal();
    const web_3 = new WalletConnectProvider(providerDataText);
    setw3(web_3);
    await subscribeProvider(providerDataText, web_3, web3Modal);

    window.localStorage.setItem("LoginType", "walletConnect");
    setLoading(false);
    // return web_3;
  }, [subscribeProvider]);
  const clientId =
    "BMZn0DvGmTwd5z8riV1hiTES5s0IUai_BXKuvhiCJxRQeVFmY6pGAFnP4ZLp8wYa69jh1oVhDxXpGm8DH4_etQs";

  useEffect(() => {
    const init = async () => {
      try {
        const coreWeb3auth = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0xaa36a7",
            rpcTarget:
              "https://sepolia.infura.io/v3/04e6d8eadecd41d68beb8f5e1a57dd7e", // This is the public RPC we have added, please pass on your own endpoint while creating an app
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
              defaultLanguage: "en",
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
  const profilConent = React.useCallback(async () => {
    const profilemetaMask = window.localStorage.getItem("metaMaskAddress");
    if (profilemetaMask !== null) {
      const metaCatAtk = window.localStorage.getItem("METACAT_atk");
      if (metaCatAtk) {
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

    const loginCon = window.localStorage.getItem("LoginType");
    setLoginState(loginCon);
    if (idTokenWeb3 && web3AuthAddress) {
      setToken("atk", `${idTokenWeb3}-.-${web3AuthAddress}`);
    }
  }, [loginState]);

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
      if (!profile.address && item.value === "walletconnect") {
        walletconnect();
      }
      // if (item.value === "mintConnevt") {
      //   mintConnect();
      // }
      // }
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
  }, [
    profile,
    clickItem,
    web3AuthAddress,
    clickOperationItem,
    idTokenWeb3,
    loading,
    showWall,
  ]);

  const getText = React.useMemo(() => {
    let text = "Connect";
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
        text = "Connect";
        setShowMenu(true);
      }
    }

    return (
      <>
        <div style={{ display: "flex" }}>
          {profile?.address ||
          (web3AuthAddress && providerWeb3auth !== null && idTokenWeb3) ? (
            <img
              className={cn("mr-1 ", style.avatar)}
              src={profile.avatar || "/images/icon.png"}
            />
          ) : (
            <img
              className={cn("mr-1 ", style.avatar)}
              src="/images/v5/wallet.png"
            />
          )}
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
  ]);

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

  const abi = [
    {
      inputs: [
        { internalType: "address", name: "_owner", type: "address" },
        { internalType: "string", name: "newURI", type: "string" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    { inputs: [], name: "ApprovalCallerNotOwnerNorApproved", type: "error" },
    { inputs: [], name: "ApprovalQueryForNonexistentToken", type: "error" },
    { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
    { inputs: [], name: "MintERC2309QuantityExceedsLimit", type: "error" },
    { inputs: [], name: "MintToZeroAddress", type: "error" },
    { inputs: [], name: "MintZeroQuantity", type: "error" },
    { inputs: [], name: "OwnerQueryForNonexistentToken", type: "error" },
    { inputs: [], name: "OwnershipNotInitializedForExtraData", type: "error" },
    { inputs: [], name: "TransferCallerNotOwnerNorApproved", type: "error" },
    { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
    {
      inputs: [],
      name: "TransferToNonERC721ReceiverImplementer",
      type: "error",
    },
    { inputs: [], name: "TransferToZeroAddress", type: "error" },
    { inputs: [], name: "URIQueryForNonexistentToken", type: "error" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "fromTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "toTokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
      ],
      name: "ConsecutiveTransfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "advance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "recipients", type: "address[]" },
      ],
      name: "airdrop",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getApproved",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getBipEnglish",
      outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getInfo",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "mint",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "_data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "send",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string[]", name: "_BipEnglish", type: "string[]" },
      ],
      name: "setBipEnglish",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "newURI", type: "string" }],
      name: "setURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "tokenToBip",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "addr", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const handleMintContent = () => {
    setMintConcent(true);
  };

  const handleMint = async () => {
    try {
      toast.success("Successful");
      const web3 = new Web3(Web3.givenProvider);
      const contractAddress = "0xadd22a3efa6f22dd60df65cdfe096da0366ee002";
      const contract = new web3.eth.Contract(abi as [], contractAddress);
      console.log(contract.events.Transfer);
      const mintNums = 1; // 在这里定义要mint的数量



      const tx = await contract.methods.mint(mintNums).send({
        from: profile.address,
        value: web3.utils.toWei(`${0.006 * mintNums}`, "ether"), // 计算价格,根据合约可知，第一阶段是0.006eth，第二阶段是0.009eth，建议做成可读取的变量
      });
      console.log(tx);
      
      // const tokenToBip = await contract.methods.tokenToBip().call({})
      // console.log(tokenToBip,'tokenToBip');
      
      // // 监听合约事件
      // // const event = contract.events.Transfer((error, event) => {
      // //   console.log(error, event);

      // //   if (!error) {
      // //     console.log("Event data:", event.returnValues);
      // //     // 在此处添加自定义的处理逻辑
      // //   } else {
      // //     console.error("Error:", error);
      // //   }
      // // });
      // // event(); 
      // const eventDataElement = document.getElementById('eventData');
      contract.events.Transfer({ filter: {}, fromBlock: 
        3868463,toBlock:'latest' },function(params){
        console.log(params,'数据');
        
      })
      .on('data', (event) => {
          console.log(event);
          console.log(tx.events.Transfer.returnValues.to.toLowerCase(),11111,event.returnValues.to.toLowerCase());
          
          console.log(tx.events.Transfer.returnValues.to.toLowerCase()===event.returnValues.to.toLowerCase());
          console.log(tx.transactionHash===event.transactionHash,666666666);
          if(tx.transactionHash===event.transactionHash){
            toast.success('hhhhhh')
            alert('仅此一次成功了')
          }
          if(tx.events.Transfer.returnValues.to.toLowerCase()===event.returnValues.to.toLowerCase()){
            const eventDataElement = document.getElementById('eventData');
            // console.log(event);
            // console.log(event.returnValues.to.toLowerCase());
             // 创建一个新的 <p> 元素来展示事件数据
    const pElement = document.createElement('p');

    // 将事件数据转为字符串
    const eventDataString = JSON.stringify(event.blockNumber);

    // 将事件数据添加到 <p> 元素中
    pElement.textContent = eventDataString;

    // 将 <p> 元素追加到 <div> 元素中
    eventDataElement.appendChild(pElement);
          }
         
      })
      
      .on('error', (error) => {
        console.error(error);
      });
      //       const value = await contract.methods.getInfo()
      // console.log(value);
      if (tx) {
        toast.success("Successful");
      }

      console.log("tx:", tx);
      // mint 成功, 进行后续操作
      console.log(tx.events.from);

      
      
      
    } catch (error) {
      toast.error("something went wrong");
    }
  };

//   useEffect(() => {
    
//     window.ethereum.enable()
//     .then(() => {
//       console.log(223);
//         const web3 = new Web3(window.web3.currentProvider);
//         const contractAddress = "0xadd22a3efa6f22dd60df65cdfe096da0366ee002";
//         const dai = new web3.eth.Contract(abi as [], contractAddress);
        
//         const mintNums = 1; 
//         dai.events.Transfer({ filter: {}, fromBlock: 
//           3842937,toBlock:'latest' },function(params){
          
//         })
//         .on('data', (event) => {
//     //       console.log(event);
// console.log(event);

//     const tokenToBip =  dai.methods.tokenToBip(event.returnValues.tokenId).call({})
//     const tokenURI =  dai.methods.tokenURI(event.returnValues.tokenId).call({})
//     console.log(tokenToBip,'tokenToBip');
//     tokenToBip.then(result => {
//       console.log(result); // 输出 "daughter"
//           const eventDataElement = document.getElementById('eventData');
//             // console.log(event);
//             // console.log(event.returnValues.to.toLowerCase());
//              // 创建一个新的 <p> 元素来展示事件数据
//     const pElement = document.createElement('p');

//     // 将事件数据转为字符串
//     const eventDataString = JSON.stringify(result);

//     // 将事件数据添加到 <p> 元素中
//     pElement.textContent = eventDataString;

//     // 将 <p> 元素追加到 <div> 元素中
//     eventDataElement.appendChild(pElement);
//   });
//   tokenURI.then(result => {
//     console.log(result); // 输出 "http://8.130.23.16/api/v1/get_bip_info/40"
//     const eventDataElement = document.getElementById('imgTokenURI');
//     const imgElement = document.createElement('img');
//     fetch(result)
//     .then(response => response.text())
//     .then(content => {
//       console.log(content); // 输出网址链接内容
//       // 在这里对网址链接内容进行处理
//       const data = JSON.parse(content);
//       const imageURL = data.image;
//       const description = data.description;
//       console.log(imageURL); // 输出图片链接
//     // 将链接设置为img元素的src属性值
//     imgElement.setAttribute('src', imageURL);
//     const pElement = document.createElement('p');
//     pElement.textContent = description;
//     eventDataElement.appendChild(imgElement);
//     eventDataElement.appendChild(pElement);
//   })
//   .catch(error => {
//     console.log(error); // 错误处理
//   });
//   });
//     // 在页面上更新事件数据
//     // eventDataElement.innerHTML += `<p>${eventDataString}</p>`;
//         });
       
//     });
// }, []);

  return (
<> 
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
      <div style={{ borderRadius: "6px", marginTop: "5px" }}>
        <ul className={cn("list-none mt-2 z-20")}>{showMenu && render}</ul>
      </div>
      <button onClick={handleMintContent}>Mint</button>
      {mintConcent === true ? (
        <div className={cn(style.content)}>
          <span>0.006</span>
          <p className={cn(style.supply)}>Supply:</p>
          <div className={cn(style.middleContent)}>
            <div
              className={cn(style.imgCon)}
              onClick={num !== 1 ? lower : null}
            >
              <img src="/images/carousel-left.png" alt="" />
            </div>
            <span className={cn(style.num)}>{num}</span>
            <div className={cn(style.imgCon)} onClick={increase}>
              <img src="/images/carousel-right.png" alt="" />
            </div>
          </div>
          <button className={cn(style.mintBtn)} onClick={handleMint}>
            Mint
          </button>
        </div>
      ) : null}
    </div>
    <div  className={cn("cursor-pointer", style.btnBox)}  id="eventData">
<div id="imgTokenURI"></div>
<div><p></p></div>
    </div>
    </>
  );
}
