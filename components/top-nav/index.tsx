import React, { useCallback, useEffect, useState,forwardRef ,useRef} from "react";
import cn from "classnames";
import style from "./index.module.css";
import HomePage from "../home-page";
import Router, { useRouter } from "next/router";
import { toast } from "react-hot-toast";

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

export default function TopNav() {
  
  const funRef = useRef(null)
    const router = useRouter();
    const mintBag = ()=>{
      
      const localAddr = window.localStorage.getItem('metaMaskAddress')
     // console.log(localAddr);
      router.replace('/bags')
      // if(localAddr){
      //   router.replace('/assets/matic')
      // }else{
      //   console.log(toast);
        
      //   toast.error('aaaaa')
      // }
    }
   
  return (
    <>
    <HomePage ref={funRef}/>
    <div className={style.container}>
    <p>Pack Your Wearable.</p>
    <p  className={style.PBox}>UseERC-6551to package and sell your Wearables.</p>
    <div className={style.bttBox} onClick={mintBag}>Mint Bag</div>
  </div>
  </>
  )
}
