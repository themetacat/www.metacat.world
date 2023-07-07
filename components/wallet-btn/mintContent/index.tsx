import React,{useState} from 'react'
import cn from "classnames";
import style from "./index.module.css";

export default function index() {
    const [num,setNum] = useState(1)
    const lower= ()=>{
        setNum(num - 1);
    }
    const increase= ()=>{
        setNum(num + 1);
    }
  return (
    <>
    <div className={cn(style.content)}>
        <span>0.006</span>
        <p  className={cn(style.supply)}>Supply:</p>
        <div className={cn(style.middleContent)}>
            <div className={cn(style.imgCon)} onClick={num !==1?lower:null}><img src="/images/carousel-left.png" alt="" /></div>
            <span className={cn(style.num)}>{num}</span>
            <div  className={cn(style.imgCon)} onClick={increase}><img src="/images/carousel-right.png" alt="" /></div>
        </div>
        <button>Mint</button>
    </div>
    </>
  )
}
