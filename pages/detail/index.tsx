import React from 'react';

import cn from 'classnames';
import Router, { useRouter } from 'next/router';

import {
  Scene,
  PerspectiveCamera,
  HemisphereLight,
  DirectionalLight,
  BoxHelper,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader.js';
import { toast } from 'react-hot-toast';
import { req_get_building_detail_info, req_building_list, req_user_add_or_edit_building } from '../../service/z_api';
import { getToken, setToken } from '../../common/utils';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import CardBuilding from '../../components/cardBuilding';
import AddBuildings from '../../components/addBuilding';
import Footer from '../../components/footer';

import api from '../../lib/api';
import z_api from '../../lib/z_api';
import { SITE_NAME, META_DESCRIPTION } from '../../common/const';
import {
  req_builder_del_self_building,
} from '../../service/z_api';

import { convert } from '../../common/utils';

import style from './index.module.css';

export default function buildingDetail({ buildingLinkCon, artist, id }) {
  const [buildFile, setBuildFile] = React.useState([])
  const [imgUrl, setImgUrl] = React.useState('')
  const [buildName, setBuildName] = React.useState('')
  const [platformBuild, setPlatformBuild] = React.useState('')
  const [formatBuild, setFormatBuild] = React.useState('')
  const [buildStory, setBuildStory] = React.useState('')
  const [token, setToken] = React.useState('');
  const [addbuild, setAddbuild] = React.useState(false);
  const [buildAll, setBuildAll] = React.useState(null);
  const [buildInc, setBuildInc] = React.useState('edit');
  const [buildPush, setBuildPush] = React.useState('');
  const router = useRouter();
  const meta = {
    title: `BuildingDetail- ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };
  const GoBack = () => {
    // window.open(`https://www.metacat.world/profile?type=wearablelist`);
    router.push(`/profile?type=wearablelist`);
  };

  const closeBuild = () => {
    setAddbuild(false)
  }
  const fn = async () => {

    const buildLink = router.query.buildingLink
    console.log(router);

    const url = window.location.search;
    // const object = {}
    if (url.indexOf('?') !== -1) {
      var str = url.substr(1);
      var strs = str.split("building_link=");
    }

    const res = await req_get_building_detail_info(strs[1]);
    const detailBuildInfo = res.data

    // setDetailBuildInfo(res.data)
    console.log(detailBuildInfo);
    setImgUrl(res.data.file_link_cover)
    setBuildName(res.data.building_name)
    setPlatformBuild(res.data.platform)
    setFormatBuild(res.data.building_format)
    setBuildStory(res.data.building_desc)
    setBuildFile(res.data.detail_files)
    console.log(res.data.detail_files);

    console.log(res.data, 12, str, 3333, strs[1]);
  }

  const deleteBuild = (token, buildingLinkCon) => {
    const url = window.location.search;
    if (url.indexOf('?') !== -1) {
      var str = url.substr(1);
      var strs = str.split("building_link=");
    }
    const res = req_builder_del_self_building(token, strs[1])
    res.then((res) => {
      if (res.code === 100000) {
        toast(res.msg)
        router.push(`/profile?type=building`);
      } else {
        toast(res.msg)
      }
    })

    console.log(res, 565656);
  }
  const editBuild = async (buildingLinkCon) => {
    const url = window.location.search;
    if (url.indexOf('?') !== -1) {
      var str = url.substr(1);
      var strs = str.split("building_link=");
    }
    setAddbuild(true)
    const res = await req_get_building_detail_info(strs[1])
    setBuildPush(strs[1])
    console.log(res, strs[1]);
    if (res.data) {
      setBuildAll(res.data)
      setAddbuild(true)
    }

  }

  const visitBuild = (buildingLinkCon)=>{
    const url = window.location.search;
    if (url.indexOf('?') !== -1) {
      var str = url.substr(1);
      var strs = str.split("building_link=");
    }
    const res =  req_get_building_detail_info(strs[1])
    console.log(res, strs[1]);
    window.open(strs[1])
    
  }

  const Save = React.useCallback((token: string, operationType: string, nickName: string, platform: string, linkBuild: string, introduction: string, format: string, subArrData, files_link_cover: string, files_link_del,) => {
    // setBuildInc(operationType)
    console.log(buildInc, operationType, 21);

    if (nickName === '') {
      toast.error('请填写Building Name');
      return false;
    }
    if (platform === '') {
      toast.error('请选择Platform');
      return false;
    }
    if (linkBuild === '') {
      toast.error('请填写Link To Building');
      return false;
    }
    const linkBuildIndex = linkBuild.indexOf('http')
    if (linkBuildIndex === -1) {
      toast.error('请填写正确的link地址');
      return false;
    }
    if (format === '') {
      toast.error('请选择Format of Building');
      return false;
    }
    if (subArrData.length === 0) {
      toast.error('请上传building文件');
      return false;
    }
    if (subArrData.length === 0) {
      toast.error('请上传building文件');
      return false;
    }
    if (files_link_cover === '') {
      files_link_cover = subArrData[0]
      // toast.error('请设置封面图');
      // return false;
    }
    const indexBuild = subArrData.indexOf(files_link_cover)
    if (indexBuild === -1) {
      files_link_cover = subArrData[0]
      // toast.error('请设置封面图');
      // return false;
    }
    console.log(indexBuild);

    const res = req_user_add_or_edit_building(token, buildInc, nickName, platform, linkBuild, introduction, format, subArrData.join(','), files_link_cover.toString(), files_link_del.join(','));
    console.log(res, subArrData);
    console.log(files_link_cover, "files_link_cover");

    setAddbuild(false)

    console.log(buildInc, nickName, platform, linkBuild, introduction, format, subArrData, 558, res);



    res.then((res) => {
      // toast(res.msg)
      if (res.code === 100000) {
        toast(res.msg)
        setImgUrl(files_link_cover)
        setBuildName(nickName)
        setPlatformBuild(platform)
        setFormatBuild(format)
        setBuildStory(introduction)
        setBuildFile(subArrData)
        // console.log(res.data.detail_files);
      }
    });



  },
    [buildInc],
  );

  React.useEffect(() => {

    fn()
    const t = getToken('atk');
    setToken(t);

  }, [getToken])

  return (
    <Page className={cn('min-h-screen flex flex-col', style.anPage)} meta={meta}>
      <div className={cn("bg-black relative", style.backImg)}>
        <PageHeader className={cn('relative z-20')}  />
      </div>
      <div className={style.content}>
        <div className={style.boxCon}>
          <span className={style.mybuilding}>My Building</span>
          <img className="ml-1 mr-2" src="/images/v5/arrow-simple.png"></img>
          <span className={style.nameCon}>{buildName}</span>
        </div>
        <div className={style.container}>
          <div className={style.conLeft}>
            <img src={imgUrl} className={style.conLeft}></img>
          </div>
          <div className={style.conRight}>
            <p className={style.buildName}>{buildName}</p>
            <div className={style.message}>
              <div className={style.first}>
                <span className={style.platform}>Platform:</span>
                <span className={style.instuor}>{platformBuild}</span>
              </div>
              <div className={style.first}>
                <span className={style.platform}>Builder:</span>
                <span className={style.instuor}>{buildName}</span>
              </div>
              <div className={style.first}>
                <span className={style.platform}>Format:</span>
                <span className={style.instuor}>{formatBuild}</span>
              </div>
              <div className={style.first}>
                <span className={style.platform}>Building Story:</span>
                <span className={style.instuor}>{buildStory}</span>
              </div>
            </div>
            <div className={style.btnBox}>
              <div className={style.btn1} onClick={() => { deleteBuild(token, buildingLinkCon) }}>Delete</div>
              <div className={style.btn2} onClick={() => { editBuild(buildingLinkCon) }}>Edit</div>
              <div className={style.btn3} onClick={()=>{visitBuild(buildingLinkCon)}}>Visit</div>
            </div>
          </div>

        </div>
        <div className={style.buildDet}>
          <div className={style.linellae}></div>
          <div className={style.buildDetInco}>Building details</div>
        </div>
        {/* <div className={style.imgBox}> */}
        <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mt-5", style.imgBox)}>
          {buildFile.map((e) => {
            return (
              <img src={e}></img>
            )
          })}
        </div>
        {addbuild === true ?
          <>
            <AddBuildings
              Save={Save}
              buildAll={buildAll}
              buildInc={buildInc}
              closeBuild={closeBuild}
            />
          </> : ''}
      </div>

      <Footer />
    </Page>
  );
}

// export async function getServerSideProps(context) {
//   const { buildingLink } = context.params;
//   let res = null;
//   if (context.query.type === 'pfp' || context.query.form === 'pfp_wearable') {
//     res = await z_api.req_pfp_detail(buildingLink);
//   } else if (context.query.type === 'mywearables' || context.query.type === 'topic') {
//     res = await z_api.req_get_wearable_detail(buildingLink);
//   } else {
//     res = await api.getDaoWearableDetail(buildingLink);
//   }
//   const { artwork, artist } = res.data[0];
//   return {
//     props: {
//       artwork,
//       artist,
//       buildingLink,
//     }, // will be passed to the page component as props
//   };
// }
