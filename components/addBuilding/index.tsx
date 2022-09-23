import React from 'react';

import cn from 'classnames';

import ReactTooltip from 'react-tooltip';

import Router from 'next/router';

import { toast } from 'react-hot-toast';
import { className } from 'babylonjs/index';

import { Button } from '@mui/material';

import Page from '../page';
import PageHeader from '../page-header';
import Footer from '../footer';
import MeteInputBuilding from '../meta-input-building';
import MeteInputBuildingLink from '../meta-input_link';
import { state } from '../wallet-btn';
import ChangeEmail from '../changeEmail';
import MeteSelectBuilding from '../meta-select-building';
import MeteSelectFormat from '../meta-select-farmat';

import { SITE_NAME, META_DESCRIPTION } from '../../common/const';

import { getBaseInfo, updateBaseInfo, nickNameExist, refreshToken, } from '../../service';
import { req_all_country, req_platform, req_get_building_detail_info } from '../../service/z_api';

import { useWalletProvider } from '../web3modal';

import style from './index.module.css';
import { convert, getToken } from '../../common/utils';
import UploadBuilding from '../uploadBuilding';
import MeteInputLimit from '../meta-input-limit';




interface Props {

  Save?;
  saveIcon?;
  subArrData?;
  file_link_cover?;
  closeBuild?: () => void;
  buildAll?;
  buildInc?;
  clickHeader?;
  id?;
}


export default function AddBuildings({ Save, saveIcon, id, clickHeader, subArrData, file_link_cover, closeBuild, buildAll, buildInc }: Props) {
  const meta = {
    title: `ProfileSetting - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };


  const [infoMsg, setInfoMsg] = React.useState(false);
  const [infoMsgPlatform, setInfoMsgPlatform] = React.useState(false);
  const [infoMsgLink, setInfoMsgLink] = React.useState(false);
  const [infoMsgFormat, setInfoMsgFormat] = React.useState(false);
  const [infoMsgFiles, setInfoMsgFiles] = React.useState(false);
  const [imgInfoMsg, setImgInfoMsg] = React.useState('');
  const [orginName, setOrginName] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [linkBuild, setLinkBuild] = React.useState('');
  const [twitterAddress, setTwitterAddress] = React.useState('');
  const [websiteAddress, setWebsiteAddress] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('/images/icon.png' || []);
  const [canSave, setCanSave] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [countNum, setCountNum] = React.useState(0);

  const [email, setEmail] = React.useState('');

  const [emailState, setEmailState] = React.useState(false);
  const [modifyEmail, setModifyEmail] = React.useState(false);
  const [introduction, setIntroduction] = React.useState('');
  const [allCountry, setAllCountry] = React.useState([]);
  const [allPlatform, setAllPlatform] = React.useState([]);
  const [allFormat, setAllFormat] = React.useState([]);
  const [platform, setPlatform] = React.useState('');
  const [format, setFormat] = React.useState('');
  const [subLength, setSubLength] = React.useState(1);
  const [subArr, setSubArr] = React.useState([]);
  const [token, setToken] = React.useState('');
  const [operationType, setOperationType] = React.useState('add');
  const [delImgArr, setDelImgArr] = React.useState([]);
  const [coverImg, setCoverImg] = React.useState('');
  const [showClear, setShowClear] = React.useState('');
  const [saveVal, setSaveVal] = React.useState(false);

  const web3 = useWalletProvider();

  const get_platform = React.useCallback(async () => {
    const result = await req_platform();
    setAllPlatform(result.data.platform);
    setAllFormat(result.data.format)
    // console.log(allCountry, 5555);

  }, [allCountry]);

  React.useEffect(() => {
    console.log(buildAll);

    // if(buildAll){
    setSubArr(buildAll?.detail_files ? [...buildAll?.detail_files] : [])
    setLinkBuild(buildAll?.building_link ? buildAll?.building_link : '')
    setFormat(buildAll?.building_format ? buildAll?.building_format : '')
    setCountNum(buildAll?.building_desc ? buildAll?.building_desc.length : '')
    // nickName  introduction   building_format
    console.log(countNum);
    setShowClear(buildAll?.file_link_cover ? buildAll?.file_link_cover : '')
    setCoverImg(buildAll?.file_link_cover ? buildAll?.file_link_cover : '')
    setIntroduction(buildAll?.building_desc ? buildAll?.building_desc : '')
    setNickName(buildAll?.building_name ? buildAll?.building_name : '')
    setPlatform(buildAll?.platform ? buildAll?.platform : '')
    // setOperationType('edit')
    // }
    //  console.log(operationType,"operationType");

  }, [buildAll]);
  React.useEffect(() => {
    console.log(buildInc, buildInc === 'add');

    if (buildInc === 'add') {
      setSubArr([])
      setLinkBuild('')
      setFormat('')
      setCountNum(0)
      // nickName  introduction   building_format
      setIntroduction('')
      setNickName('')
      setPlatform('')
    }

  }, [buildInc]);
  React.useEffect(() => {

    // console.log(operationType,"operatiooperationTypenType");
    // setOperationType('add')
    const t = getToken('atk');
    setToken(t);
    if (t) {
      get_platform();
    }


  }, [getToken]);
  React.useEffect(() => {
    if (nickName === '' || linkBuild === '' || platform === '' || format === '' || subArr.length === 0) {
      setSaveVal(false)
    } else {
      setSaveVal(true)
    }
console.log(saveIcon,55555);
  }, [nickName, linkBuild, platform, format, subArr, saveVal,saveIcon]);





  const uploadImage = React.useCallback((index, res, item) => {
    setCanSave(true);

    setImgInfoMsg('');
    if (!res.success) {
      setImgInfoMsg('Update failed');
      return;
    }
    // const url = res.data.res.requestUrls[0].split('?')[0];
    const url = res.data.res.requestUrls;
    // setAvatarUrl(url);
    // setAvatarUrl(url);
    // console.log(avatarUrl, 99999999999,res,8888,url);
    // console.log(url,555,res.data.res.requestUrls);

    subArr[index] = res.data.res.requestUrls;
    // let buildData = null;
    // buildData = subArr;
    // const buildData=this.status'
    // console.log(res.data.res.requestUrls,2222222,subArr[index]);

    // console.log([...subArr],'66');

    setSubArr([...subArr])
    // console.log(subArr,555555555555);


  },

    [subArr],
  );
  // console.log(operationType,2222222222222222);

  const beginUpload = React.useCallback(() => {
    setCanSave(false);
  }, [null]);


  const changeIntroductionValue = React.useCallback((e) => {
    setIntroduction(e.target.value);
    const txt = document.getElementById("txt");
    const countNumTxt = document.getElementById("countNum");
    txt.addEventListener("keyup", function () {
      const value = e.target.value.length;
      setCountNum(value)
    })
    if (countNum > 500) {
      toast.error('Max text length 500');
      return false;

    }
  }, [countNum]);
  const down = (e) => {
    console.log(e);

  }

  const changeCountry = React.useCallback((c) => {
    setPlatform(c);
  }, []);
  const changeFormat = React.useCallback((c) => {
    setFormat(c);
  }, []);

  const addBuildOther = () => {
    // console.log(subLength,);
    if (subLength > 7) {
      toast.error('不得超过八条数据');
      return false;
    }

    subArr.push(['/images/icon.png'])

    setSubArr([...subArr])
    setSubLength([...subArr].length)

  }



  const cover = (item) => {
    setCoverImg(item)
    console.log(item, coverImg, "imgUrl");

  }
  const closeBuildCon = (index) => {
    if (subLength < 1) {
      toast.error('不得小于一条数据');
      return false;
    }

    // let newNumDel = subLength;
    // newNumDel - 1;
    console.log(subArr, "dddddddddd", index, subLength);
    const delImgContent = delImgArr;
    console.log(subArr[index], "index");
    delImgContent.push(subArr[index])
    setDelImgArr(delImgContent)
    console.log(delImgArr, "删除掉");

    subArr.splice(index, 1)
    // setSubLength(subArr.length)
    console.log([...subArr], [...subArr].length,);


    setSubArr([...subArr])
    setSubLength([...subArr].length)


  }

  const onClear = () => {
    console.log(nickName);
    setNickName('');
    console.log(nickName);
    setInfoMsg(true)
  }
  const onbuildAll = () => {
    setLinkBuild('')
    setInfoMsgLink(true)
    setInfoMsgFiles(false)
  }

  // const myFunction = React.useCallback(() => {
  //   console.log('2525',nickName.length);
  //   if (nickName.length > 200) {
  //     console.log(nickName.length, nickName.length > 200);
  //     toast.error('Max text length 200');
  //     return false;
  //   }
  // }, [nickName])
  return (
    <>
      <Page className={cn('flex flex-col', style.anPage)} meta={meta}>
        {/* <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'profile'} />
      </div> */}
        <div className={cn('main-content flex flex-col justify-center items-center', style.content)}>
          <div className={cn('w-full flex flex-col justify-start items-center', style.chartList)}>
            <div
              className={cn(
                'w-full text-xl text-white flex justify-start items-center ',
                style.bottomBorder,
              )}
              onMouseDown={clickHeader}
            // onmousedown={clickHeader}
            >
              <span>Upload the building</span>
              <span style={{ display: "inline-block", position: "absolute", right: "15px" }} onClick={closeBuild}><img src='/images/guanbi.png'></img></span>
            </div>
            <div className=" justify-center items-center py-8">
              <div className="mr-7">
                {/* <form onSubmit={submit}> */}
                <div className={cn('text-xs mb-5', style.baseInfo)}>
                  <span className={cn('mr-1', style.unNull)}>*</span>Required fields
                </div>
                <MeteInputBuilding
                  label="Building Name"
                  require={true}
                  name={'Building Name'}
                  bold={true}
                  value={nickName}
                  // || buildAll?.building_name
                  requirePrefix={false}
                  onChangeHandler={(val) => {
                    setNickName(val);
                  }}
                  clear={onClear}
                  // onBlur={() => { myFunction }}
                  onBlur={(val) => {
                    console.log(nickName.length);
                    if (nickName === '') {
                      setInfoMsg(true)
                    } else {
                      setInfoMsg(false)
                    }
                    if (nickName.length > 200) {
                      console.log(nickName.length, nickName.length > 200, toast);
                      toast.error('Max text length 200');
                      return false;
                    }

                  }}

                ></MeteInputBuilding>
                <div className={cn('flex items-center text-xs mt-1 mb-2', style.warnContent)}>

                  {
                    infoMsg === true ? <span className={style.warn}>Please input building name</span> : null
                  }
                </div>

                <MeteSelectBuilding
                  // classname="mt-3"
                  label="Platform"
                  require={true}
                  requirePrefix={false}
                  data={allPlatform}
                  platform={platform}
                  onClick={changeCountry}
                  onBlur={() => {
                    console.log(platform, 5656565);
                    if (platform === '') {
                      setInfoMsgPlatform(true)
                    } else {
                      setInfoMsgPlatform(false)
                    }
                  }}
                ></MeteSelectBuilding>
                <div className={cn('flex items-center text-xs mt-1 mb-2', style.warnContent)}>
                  {infoMsgPlatform === true ? <span className={style.warn}>please choose platform</span> : null}
                </div>
                <div>
                  <MeteInputBuildingLink
                    label="Link To Building"
                    require={true}
                    name={'Link To Building'}
                    bold={true}
                    disable={buildAll?.building_link}
                    value={linkBuild}
                    requirePrefix={false}
                    onChangeHandler={(val) => {
                      setLinkBuild(val);
                    }}
                    clear={onbuildAll}
                    onBlur={(val) => {
                      if (linkBuild === '') {
                        setInfoMsgLink(true)
                        setInfoMsgFiles(false)
                      } else if (linkBuild !== '') {
                        setInfoMsgLink(false)
                        const linkBuildIndex = linkBuild.indexOf('http://')
                        const linkBuildCom = linkBuild.indexOf('.com')
                        if (linkBuildIndex === -1 || linkBuildCom === -1) {

                          setInfoMsgFiles(true)
                        } else {
                          setInfoMsgFiles(false)
                        }
                      } else {
                        setInfoMsgLink(false)
                        setInfoMsgFiles(false)
                      }

                    }}
                  ></MeteInputBuildingLink>
                  <div className={cn('flex items-center text-xs mt-1 mb-2', style.warnContent)}>
                    {
                      infoMsgLink === true ? <span className={style.warn}>Please input building link</span> : null
                    }
                    {
                      infoMsgFiles === true ? <span className={style.warn}>Please fill in the correct address</span> : null
                    }
                  </div>
                </div>
                <div className={style.Introduction}>
                  <div className={style.title}>Building Story</div>
                </div>
                <div className={style.introductionField}>
                  <div className={style.right} style={{ marginLeft: "20px" }}>
                    <textarea
                      id='txt'
                      placeholder="Please Input"
                      value={introduction}
                      maxLength={500}
                      // onChange={setIntroduction}
                      onInput={changeIntroductionValue}
                      onKeyDown={(e) => { down(e) }}
                    />
                    <div className={style.text}>
                      <span id='countNum'>{countNum}</span> <span>/500</span>
                    </div>

                  </div>
                </div>
                {/* <div className={style.country}>
                    <div className={style.title}>Format of Building </div>
                  </div> */}
                <MeteSelectFormat
                  classname="mt-3"
                  label="Format of Building"
                  require={true}
                  requirePrefix={false}
                  data={allFormat}
                  platform={format}
                  onClick={changeFormat}
                  onBlur={() => {
                    console.log(format, 5656565);
                    if (format === '') {
                      setInfoMsgFormat(true)
                    } else {
                      setInfoMsgFormat(false)
                    }
                  }}
                ></MeteSelectFormat>
                <div className={cn('flex items-center text-xs mt-1 mb-2', style.warnContent)}>
                  {infoMsgFormat === true ? <span className={style.warn}>please choose platform</span> : null}
                </div>
                <div className={cn('self-start', style.avatar)}>
                  <div className={cn(' items-center ', style.avaterText)}>
                    <span className=" mr-2">Add Files</span>
                    <span className={cn('mr-1', style.require)}>*</span>
                    <p className={style.suport}>Supported formats:.jpeg,.png,.gif,≤10MB each,≤8 files</p>
                    <ReactTooltip
                      id="info"
                      effect="solid"
                      textColor="#AAAAAA"
                      // className={style.pop}
                      backgroundColor="#0F191B"
                      border={false}
                    >
                      <div className={style.info}>
                        Recommended 350px x 350px
                        <br />
                        Max Size: 1MB
                      </div>
                    </ReactTooltip>
                  </div>
                  <div className={cn("grid grid-cols-1 gap-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center")}
                    style={{
                      width: "500px",
                    }}>
                    {
                      subArr?.map((item, index) =>
                      (
                        <>
                          <UploadBuilding
                            // imgUrl={avatarUrl || '/images/icon.png'}
                            imgUrl={item}
                            closeBuild={() => { closeBuildCon(index) }}
                            cover={() => { cover(item) }}
                            coverImg={coverImg}
                            // afterUpload={uploadImage}
                            afterUpload={(e) => { uploadImage(index, e, item) }}
                            beginUpload={beginUpload}
                            showClear={showClear}
                          ></UploadBuilding>
                        </>
                      )
                      )
                    }
                    <div className={style.addPush} onClick={addBuildOther}>
                    </div>
                  </div>
                </div>

                <button disabled={!saveVal} onClick={() => { Save(token, operationType, nickName, platform, linkBuild, introduction, format, subArr, coverImg, delImgArr) }} className={cn(
                  'flex justify-center items-center text-base font-semibold',
                  saveVal ? true : style.saveBtn,
                  style.saveBtn2,
                )}>
                  {
                    saveIcon === true ? <><img src='/images/saveIcon.gif'></img>
                    </>:<>Save</>
                  }
                  
                </button>

                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </Page>
    </>
  );
}
// }
