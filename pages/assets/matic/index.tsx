import React, { useCallback, useEffect, useState } from "react";
import HomePage from "../../../components/home-page";
import Page from "../../../components/page";
import { SITE_NAME, META_DESCRIPTION } from "../../../common/const";
import cn from "classnames";
import style from "./index.module.css";
import { v4 as uuid } from "uuid";
import Card from "../../../components/parcels-card";

const dataSource = [{}];

import { getBagsDetail } from "../../../service";

export default function Matic() {
  const [dataInfo, setDataInfo] = React.useState([]||null);
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
        const response = await getBagsDetail(); // 假设 getBagsDetail 是一个异步函数
        // console.log(response, 333);
        setDataInfo(response.ownedNfts);
 console.log(dataInfo, 666);
      } catch (error) {
        console.error(error);
      }
   
      
    };
  
    getData();
  }, [dataInfo]);
  
  useEffect(() => {
    handleMint();
  }, []);
  useEffect(() => {
// console.log(dataInfo,58888);
// if (Array.isArray(dataInfo)) {
//   dataInfo.map((item => {
//     console.log(item);
//   }));
// }
  }, [dataInfo]);
  return (
    <Page meta={meta} className={cn("", style.page)}>
      <HomePage />
      <div className={style.container}>
        <div className={style.cont}>
          <p className={style.idNum}>BGA#108</p>
          <p className={style.TbaAdd}>
            0x79EF3DA763754387F06022Cf66c2668854B3389B
          </p>
          <p className={style.totalNum}>9 Wearables</p>
        </div>
        <div
   className={cn(
     "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5",
     style.dataSourceCard
   )}
   id="eventData"
  
 >
{dataInfo.map((item=>{
  console.log(item);
  return(

   <div className={style.boxContent}  key={item.id}>
     <img src="/images/untitled.png" alt="" />
     <div className={style.worldCon}>world</div>
     <div className={style.textCon}>
       <p className={style.idP1}>{item.metadata.name}</p>
       <p className={style.idP2}>
         {item.metadata.description}
       </p>
     </div>
   </div>

 )
})
)
}
</div>
     
      </div>
    </Page>
  );
}
