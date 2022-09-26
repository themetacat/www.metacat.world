import React from 'react';
import cn from 'classnames';

import { useRouter } from 'next/router';

import { convert, getToken} from '../../common/utils';

import CoverImg from '../cover-img';

import style from './index.module.css';


type Props = {
  file_link_cover?: string;
  buildingLink?:string;
  fileLinkCover?:string;
  buildingName?:string;
  building_name?: string;
  description?: string;
  type?: string;
  platform?: string;
  parcelPageUrl?: string;
  building_link?: string;
  hasTypeTag?: boolean;
  world?: string;
  typeState?: string;
  DeleteBuild?;
  EditBuild?;
};

export default function CardBuilding({
  file_link_cover,
  buildingLink,
  buildingName,
  fileLinkCover,
  building_name,
  EditBuild,
  type,
  platform,
  building_link,
  DeleteBuild,
  parcelPageUrl,
  hasTypeTag = true,
  world,
  typeState
}: Props) {
  const router = useRouter();
  const [buildingLinkCon, setBuildingLink] = React.useState('');
  const [token, setToken] = React.useState('');
  const jumpToOpenC = React.useCallback(
    (event) => {
      event.stopPropagation();
      window.open(building_link||buildingLink);
    },
    [building_link,buildingLink],
  );

  
  const jumpToParcel = React.useCallback(() => {
    // window.open(building_link||buildingLink);
    console.log(buildingLink,"building_linkbuilding_linkbuilding_link");
    if(buildingLink){
      // const c=buildingLink.slice(7)
      window.open(`/detail?building_link=${buildingLink}`);
      // router.replace(`/build/detail?building_link=${buildingLink}`)
      // window.open(`/profile?type=building/detail?buildingLink=${buildingLink}`);
    }else{
      // const a=building_link.slice(7)
      window.open(`/detail?building_link=${building_link}`);
    }
  
  }, [building_link,buildingLink]);
  // const Delete = ()=>{
  //   console.log(5955);
    
  // }

  React.useEffect(() => {
    setBuildingLink(buildingLink ||building_link)
    
    const t = getToken('atk');
    setToken(t);
  }, [building_link,getToken,buildingLink]);

  return (
    <>
      <div
        className={cn('text-white flex-col justify-center items-center p-5', style.card)}
      
      >
        <div className={style.imgContanier}   onClick={jumpToParcel}>
          {world ? (
            <div className={cn('flex items-center justify-center text-sm font-medium', style.tag)}>
              {world}
            </div>
          ) : null}
          <CoverImg
            className={style.img}
            img={file_link_cover||fileLinkCover}
            error="/images/default-cover.png"
          ></CoverImg>
          {
            platform && <span className={style.typeIcon}>{platform}</span>
          }
        </div>
        <div className={cn(' flex-1', style.content)}  onClick={jumpToParcel}>
          <div className={cn('flex justify-between items-center', style.contnetHeader)}>
            <div className={cn("text-xl font-semibold truncate flex-1 mr-3", style.name)} title={buildingName||building_name}>
              {buildingName||building_name}
            </div>
            {/* {building_link ? (
            <img src="/images/Nomal.png" className={style.icon} onClick={jumpToOpenC}></img>
          ) : null} */}

          </div>
         
        </div>
        <div className={cn('', style.description)}>
            <div className={style.Delete} onClick={()=>{DeleteBuild(token,buildingLinkCon)}}>Delete</div>
            <i className={style.i}></i>
            <div className={style.Edit} onClick={()=>{EditBuild(buildingLinkCon)}}>Edit</div>
          </div>
      </div>

    </>
  );
}
