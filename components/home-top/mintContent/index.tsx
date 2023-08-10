import React,{useState} from 'react'
import cn from "classnames";
import style from "./index.module.css";

export default function MintContent(handleMint) {
    const [num,setNum] = useState(1)
    const [mintNum, setMintNum] = React.useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editNum, setEditNum] = useState(0);
    const [balanceNum, setBalanceNum] = useState(false);
    const [ethBalance, setEthBalance] = useState("0");
    const [switcherNet, setSwitcherNet] = useState(false);
    const lower= ()=>{
        setNum(num - 1);
    }
    const increase= ()=>{
        setNum(num + 1);
    }
    const handleBlur = () => {
        setIsEditing(false);
        setNum(editNum); // 更新输入框数据到num
      };
      const handleNumChange = (event) => {
        if (event.target.value < 1) {
          event.target.value = 1;
        }
        const value = parseInt(event.target.value);
        setEditNum(value);
      };
      const handleDoubleClick = () => {
        setEditNum(num); // 设置初始值为之前的数据
        setIsEditing(true);
      };
      
  return (
    <>
  <div className={cn(style.content)}>
          <span>{(0.006 * num).toFixed(3)}</span>
          <p className={cn(style.supply)}>
            Supply:
            <span>{mintNum}</span>
            <span>/</span>
            <span>1984</span>
          </p>
          <div className={cn(style.middleContent)}>
            <div
              className={cn(style.imgCon)}
              onClick={num !== 1 ? lower : null}
            >
              <img src="/images/carousel-left.png" alt="" />
            </div>
            {isEditing ? (
              <input
                type="number"
                className={cn(style.numIn)}
                value={editNum}
                onChange={handleNumChange}
                onBlur={handleBlur}
                style={{ appearance: "none" }}
                autoFocus
              />
            ) : (
              <span className={cn(style.num)} onClick={handleDoubleClick}>
                {num < 1 ? 1 : num}
              </span>
            )}
            <div className={cn(style.imgCon)} onClick={increase}>
              <img src="/images/carousel-right.png" alt="" />
            </div>
          </div>
          {/* <button className={cn(style.mintBtn)} onClick={handleMint}>
            Mint
          </button> */}
          {balanceNum === true || (0.006 * num).toFixed(3) >= ethBalance ? (
            <div>
              <p>
                ETH Balance: You need {(0.006 * num).toFixed(3)} ETH + gas fee{" "}
                <br /> You ETH wallet Balance: {ethBalance} ETH
              </p>
            </div>
          ) : null}
          {switcherNet === true ? (
            <div>
              <p>Please switch to Ethereum Sepolia</p>
            </div>
          ) : null}
          <button
            className={cn(
              mintNum === "1984" ? style.mintBtnDis : style.mintBtn
            )}
            disabled={mintNum === "1984"}
            onClick={handleMint}
          >
            Mint
          </button>
        </div>
    </>
  )
}
