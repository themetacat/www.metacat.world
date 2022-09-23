import React from 'react';

import cn from 'classnames';
import Router, { useRouter } from 'next/router';

import { toast } from 'react-hot-toast';
import { req_get_building_detail_info, req_builder_del_self_building, req_user_add_or_edit_building } from '../../service/z_api';
import { getToken } from '../../common/utils';

import Page from '../../components/page';
import PageHeader from '../../components/page-header';
import CardBuilding from '../../components/cardBuilding';
import AddBuildings from '../../components/addBuilding';
import Footer from '../../components/footer';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';




import style from './index.module.css';

export default function buildingDetail({ buildingLinkCon, artist, id }) {
  // const url = window.location.search;
  // if (url.indexOf('?') !== -1) {
  //   var str = url.substr(1);
  //   var strs = str.split("building_link=");
  // }
  const router = useRouter();
  const [buildFile, setBuildFile] = React.useState([])
  const [imgUrl, setImgUrl] = React.useState('')
  const [buildName, setBuildName] = React.useState('')
  const [platformBuild, setPlatformBuild] = React.useState('')
  const [formatBuild, setFormatBuild] = React.useState('')
  const [buildStory, setBuildStory] = React.useState('')
  const [tokenCon, setTokenCon] = React.useState('');
  const [addbuild, setAddbuild] = React.useState(false);
  const [buildAll, setBuildAll] = React.useState(null);
  const [buildInc, setBuildInc] = React.useState('edit');
  const [buildPush, setBuildPush] = React.useState('');

  const meta = {
    title: `BuildingDetail- ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };


  const closeBuild = () => {
    setAddbuild(false)
  }
  const fn = async () => {


    const url = window.location.search;
    let str = '';
    let strs = [];
    if (url.indexOf('?') !== -1) {
      str = url.substr(1);
      strs = str.split("building_link=");
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

    // console.log(res.data, 12, str, 3333, strs[1]);
  }

  const drag = function (evt, dbele?) {
    let containerVal = dbele
    if (!dbele) {
      containerVal = document.querySelector('.addBuilding_content__GcPPZ')
    }

    // ele.onmousedown = function (evt) {

    const oEvent = evt;
    const disX = oEvent.clientX - containerVal.offsetLeft;
    const disY = oEvent.clientY - containerVal.offsetTop;
    document.onmousemove = function (evts) {
      // console.log(evts);
      const evtUp = evts;
      let leftX = evtUp.clientX - disX;
      let topY = evtUp.clientY - disY;

      if (
        leftX >
        document.querySelector("#container").clientWidth - containerVal.offsetWidth
      ) {
        leftX =
          document.body.clientWidth -
          containerVal.offsetWidth;
      }
      if (leftX < 0) {
        leftX = 0;
      }
      if (
        topY >
        document.querySelector("#container").clientHeight -
        containerVal.offsetHeight
      ) {
        topY =
          document.body.clientHeight -
          containerVal.offsetHeight;
      }
      if (topY < 0) {
        topY = 0;
      }

      if (containerVal) {
        containerVal.style.left = `${leftX}px`;
        containerVal.style.marginLeft = "0px";
        containerVal.style.marginTop = "0px";
        // containerVal.style.marginBottom = 50 + "px";
        containerVal.style.top = `${topY}px`;
        containerVal.style.zIndex = "999999";
      } else {
        return false;
      }
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  const deleteBuild = (token, buildingLinkConVal) => {
    const url = window.location.search;
    const str = url.substr(1);
    const strs = str.split("building_link=");
    if (url.indexOf('?') !== -1) {
      // var str = url.substr(1);
      // var strs = str.split("building_link=");
    }
    const res = req_builder_del_self_building(token, strs[1])
    res.then((resB) => {
      if (resB.code === 100000) {
        toast(resB.msg)
        router.push(`/profile?type=building`);
      } else {
        toast(resB.msg)
      }
    })

    // console.log(res, 565656);
  }
  const editBuild = async (buildingLinkConB) => {
    const url = window.location.search;
    let str = '';
    let strs = [];
    if (url.indexOf('?') !== -1) {
      str = url.substr(1);
      strs = str.split("building_link=");
    }
    setAddbuild(true)
    const res = await req_get_building_detail_info(strs[1])
    setBuildPush(strs[1])
    // console.log(res, strs[1]);
    if (res.data) {
      setBuildAll(res.data)
      setAddbuild(true)
    }

  }

  const visitBuild = (buildingLinkConV) => {
    const url = window.location.search;
    let str = '';
    let strs = [];
    if (url.indexOf('?') !== -1) {
      str = url.substr(1);
      strs = str.split("building_link=");
    }
    const res = req_get_building_detail_info(strs[1])
    // console.log(res, strs[1]);
    window.open(strs[1])

  }

  const Save = React.useCallback((token: string, operationType: string, nickName: string, platform: string, linkBuild: string, introduction: string, format: string, subArrData, files_link_cover: string, files_link_del,) => {
    // setBuildInc(operationType)
    console.log(buildInc, operationType, 21);

    if (nickName === '') {
      toast.error('Please fill in Building Name');
      return false;
    }
    if (nickName.length > 200) {
      toast.error('Max text length 200');
      return false;
    }
    if (platform === '') {
      toast.error('Please choose Platform');
      return false;
    }
    if (linkBuild === '') {
      toast.error('Please fill in Link To Building');
      return false;
    }
    const linkBuildIndex = linkBuild.indexOf('http://')
    const linkBuildCom = linkBuild.indexOf('.com')
    if (linkBuildIndex === -1 || linkBuildCom === -1) {
      toast.error('Please fill in the correct address');
      return false;
    }
    if (format === '') {
      toast.error('Please choose Format of Building');
      return false;
    }
    if (subArrData.length === 0) {
      toast.error(' Please upload the building file');
      return false;
    }
    if (subArrData.length === 0) {
      toast.error('Please upload the building file');
      return false;
    }
    let imgCont = files_link_cover
    if (imgCont === '') {
      [imgCont] = subArrData
      // files_link_cover = subArrData[0]



      // toast.error('请设置封面图');
      // return false;
    }
    const indexBuild = subArrData.indexOf(imgCont)
    if (indexBuild === -1) {
      // files_link_cover = subArrData[0]
      [imgCont] = subArrData

      // toast.error('请设置封面图');
      // return false;
    }
    // console.log(indexBuild);

    const res = req_user_add_or_edit_building(token, buildInc, nickName, platform, linkBuild, introduction, format, subArrData.join(','), imgCont.toString(), files_link_del.join(','));
    // console.log(res, subArrData);
    // console.log(files_link_cover, "files_link_cover");

    setAddbuild(false)

    // console.log(buildInc, nickName, platform, linkBuild, introduction, format, subArrData, 558, res);



    res.then((resValue) => {
      // toast(res.msg)
      if (resValue.code === 100000) {
        toast(resValue.msg)
        setImgUrl(imgCont)
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
    setTokenCon(t);

  }, [getToken])

  return (
    <>
    <Page className={cn('min-h-screen flex flex-col', style.anPage)} meta={meta}>
    <div
          // onClick={() => {
          //   setManySetState(false);
          // }}
          id='container'
          className={cn('', style.bigPic, addbuild === true ? style.join : '',)}
        >
      <div className={cn("bg-black relative", style.backImg)} >
        <PageHeader className={cn('relative z-20')} />
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
              <div className={style.btn1} onClick={() => { deleteBuild(tokenCon, buildingLinkCon) }}>Delete</div>
              <div className={style.btn2} onClick={() => { editBuild(buildingLinkCon) }}>Edit</div>
              <div className={style.btn3} onClick={() => { visitBuild(buildingLinkCon) }}>Visit</div>
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
        </div>
      </div>

      <Footer />
    </Page>
      {addbuild === true ?
        <>
          <AddBuildings
            Save={Save}
            buildAll={buildAll}
            buildInc={buildInc}
            closeBuild={closeBuild}
            clickHeader={drag}
          />
        </> : ''}
        </>
  );
}

