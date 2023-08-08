import React, { useCallback, useEffect, useState } from "react";
import HomePage from "../../../components/home-page";
import Page from "../../../components/page";
import { toast } from "react-hot-toast";
import { SITE_NAME, META_DESCRIPTION } from "../../../common/const";
import { createWalletClient, http, custom, WalletClient, Account } from "viem";
import { TokenboundClient } from "@tokenbound/sdk";
import { polygonMumbai } from "viem/chains";
import cn from "classnames";
import style from "./index.module.css";
import Router, { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import Card from "../../../components/parcels-card";
import Web3 from "web3";

const dataSource = [{}];

import { getBagsDetail ,getBagsNum} from "../../../service";

export default function Matic() {
  const router = useRouter();
  const [dataInfo, setDataInfo] = React.useState([] || null);
  const { tokenId } = router.query;
  const [decodedToken, setDecodedToken] = useState('');
  const [tokenboundAccountNum, setTokenboundAccountNum] = useState('');
  const [title, setTitle] = useState('');
  const [world, setWorld] = useState('');
  const [dataInfoList, setDataInfoList] = React.useState([] || null);
  const meta = {
    title: ` ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  // const truncatedAccount =
  // `${tokenboundAccount}`.slice(0, 6) +
  // "..." +
  // `${tokenboundAccount}`.slice(-4);
  const handleMint = useCallback(() => {
    const getData = async () => {
      try {
        const response = await getBagsDetail(tokenboundAccountNum); // 假设 getBagsDetail 是一个异步函数
      
        // console.log(tokenboundAccountNum, 333);
        setDataInfo(response.ownedNfts);
        if(response.ownedNfts.length===0){
          setDataInfoList(null)
        }
        // console.log(dataInfo, 666);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [dataInfo,tokenboundAccountNum]);

  const handleBag = useCallback(() => {
    const getData = async () => {
      // console.log(router.query.tokenId);
      
      try {
        const response = await getBagsNum(router.query.tokenId); // 假设 getBagsDetail 是一个异步函数
        console.log(response.contract.address, 333);
        setWorld(response.contract.address)
      
        
        setTitle(response.title)
        // console.log(response, 'response');
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [router.query.tokenId]);
  // console.log(getBagsDetail(7));
  

  // useEffect(() => {
  //   handleMint();
  // }, [router.query.tokenId]);
  useEffect(() => {
    handleMint();
    handleBag()
    // console.log(dataInfo,58888);
    // if (Array.isArray(dataInfo)) {
    //   dataInfo.map((item => {
    //     console.log(item);
    //   }));
    // }
  },[router.query.tokenId,tokenboundAccountNum,dataInfoList,world]);

    const handleCopyClick = () => {
      const textToCopy = tokenboundAccountNum;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log("文本已复制到剪贴板");
          alert('文本已复制到剪贴板')
          toast.success('文本已复制到剪贴板')
        })
        .catch((error) => {
          console.error("复制文本到剪贴板时出错:", error);
        });
    }

    useEffect(() => {
      // 检查浏览器是否支持Clipboard API
      if (!navigator.clipboard) {
        console.warn("该浏览器不支持Clipboard API");
      }
    }, []);

useEffect(() => {

  // if (tokenId) {
  //   const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
  // const decodedTokenId = decodeURIComponent(searchParams.get('tokenId'));
  //   console.log(decodedTokenId,6544);
  //   setDecodedToken(decodedTokenId)
  // }
  const fetchData = async () => {
    const web3s = new Web3(window.ethereum);
    // for (const item of dataInfo) {
      // const a = parseInt(item.id.tokenId, 16);

      const accounts = await web3s.eth.getAccounts();
      const walletClient: WalletClient = createWalletClient({
        chain: polygonMumbai,
        account: accounts[0] as `0x${string}`,
        transport: window.ethereum ? custom(window.ethereum) : http(),
      });
      const tokenboundClient = new TokenboundClient({
        walletClient,
        chainId: 80001,
      });

      if (!tokenboundClient) return;

      const tokenboundAccount = tokenboundClient?.getAccount({
        tokenContract: "0x6a7e3ce7e3a629b29f9d01be650a381b3c7f03a0",
        tokenId: router.query.tokenId as string,
      });
      // console.log(tokenboundAccount,22222);
      
      setTokenboundAccountNum(tokenboundAccount)
      const truncatedAccount =
        `${tokenboundAccount}`.slice(0, 6) +
        "..." +
        `${tokenboundAccount}`.slice(-4);

      // truncatedAdd.push(truncatedAccount);
      // setTruncatedAdd([...truncatedAdd]); // 创建一个新的数组以确保状态更新
    // }

    // 其他后续操作
  };

 
  fetchData();
}, [router.query.tokenId,]);

const jumpToOpenC = (item)=>{
  console.log(item,'w22');
  const idToken = item.id.tokenId
  console.log(idToken);
  const decimalValue = parseInt(idToken, 16);
  console.log(decimalValue,556);
  
  window.open(`https://opensea.io/assets/matic/${world}/${decimalValue}`)
}

    return (
      <Page meta={meta} className={cn("", style.page)}>
        <HomePage />
        <div className={style.container}>
          <div className={style.cont}>
            <p className={style.idNum}>{title}</p>
            <div onClick={handleCopyClick}>
              <p className={style.TbaAdd}>
                {tokenboundAccountNum}
              </p>
            </div>
            <p className={style.totalNum}>{dataInfo.length} Wearables</p>
          </div>
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5",
              style.dataSourceCard
            )}
            id="eventData"
          >
             {dataInfoList === null ? (
          <>
          <p className={style.nothingInfo}>You do not own any bags</p>
          </>
        ) : (
           <>
            {dataInfo.map((item) => {
              
              return (
                <div className={style.boxContent} key={item.id}>
                  <img src="/images/untitled.png" alt="" />
                  <img src="/images/Nomal.png" className={style.icon} onClick={()=>{jumpToOpenC(item)}}></img>
                  <div className={style.worldCon}>world
                {world==='1'?
                <>Vox</>
                :null}
                {world==='2'?
                <>Vox</>
                :null}
                {world==='3'?
                <>Vox</>
                :null}
                </div>
                  <div className={style.textCon}>
                    <p className={style.idP1}>{item.metadata.name}</p>
                    <p className={style.idP2}>{item.metadata.description}</p>
                  </div>
                </div>
              );
            })}
           </>
            )}
          </div>
          
        </div>
      </Page>
    );
  };
