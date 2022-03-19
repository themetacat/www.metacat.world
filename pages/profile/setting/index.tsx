import React from 'react';

import cn from 'classnames';

import ReactTooltip from 'react-tooltip';

import { toast } from 'react-hot-toast';

import Page from '../../../components/page';
import PageHeader from '../../../components/page-header';
import Footer from '../../../components/footer';
import MeteInput from '../../../components/meta-input';
import { state } from '../../../components/wallet-btn';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import { getBaseInfo, updateBaseInfo, nickNameExist, refreshToken } from '../../../service';

import { useWalletProvider } from '../../../components/web3modal';

import style from './index.module.css';
import { convert, getToken, setToken } from '../../../common/utils';
import UploadImg from '../../../components/upload-img';
import MeteInputLimit from '../../../components/meta-input-limit';

export default function Settings() {
  const meta = {
    title: `ProfileSetting - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [infoMsg, setInfoMsg] = React.useState('');
  const [imgInfoMsg, setImgInfoMsg] = React.useState('');
  const [orginName, setOrginName] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [twitterAddress, setTwitterAddress] = React.useState('');
  const [websiteAddress, setWebsiteAddress] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('/images/icon.png');
  const [canSave, setCanSave] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const web3 = useWalletProvider();

  const refreshTK = React.useCallback(async () => {
    const rToken = getToken('rtk');
    if (rToken) {
      const res = await refreshToken(rToken);
      const { code, data, msg } = res;
      if (code === 100003) {
        toast.error('Token timeout');
        window.location.href = '/';
        return null;
      }
      if (code !== 100000) {
        toast.error(msg);
        return null;
      }
      const { accessToken, refreshToken: rtk } = convert(data);
      setToken('atk', accessToken);
      setToken('rtk', rtk);
      state.setState({ accessToken, refreshToken: rtk });
      return accessToken;
    }
    return null;
  }, [null]);

  const resultHandler = React.useCallback(
    (res, callback) => {
      const { code, msg, data } = res;
      if (code === 100000) {
        return convert(data);
      }
      if (code === 100003) {
        refreshTK().then((token) => {
          if (token && callback) {
            callback(token);
          }
        });
        return null;
      }

      toast.error(msg);

      return null;
    },
    [refreshTK],
  );

  const requireData = React.useCallback(
    async (token) => {
      const res = await getBaseInfo(token);
      const data = resultHandler(res, requireData);
      if (data) {
        const profile = convert(data.profile);
        const { address: addr, nickName: name, avatar, links } = profile;
        const { twitterName, websiteUrl } = links;
        setAvatarUrl(avatar);
        setAddress(addr);
        setNickName(name);
        setOrginName(name);
        setTwitterAddress(twitterName);
        setWebsiteAddress(websiteUrl);
        state.setState({ profile });
      }
    },
    [resultHandler],
  );

  React.useEffect(() => {
    const accessToken = getToken('atk');
    if (accessToken) {
      requireData(accessToken);
      return;
    }
    window.location.href = '/';
  }, [getToken, requireData]);

  const clipName = React.useCallback(
    (addres) => {
      if (addres?.length > 8) {
        const end = addres.length - 4;
        const all = addres.slice(4, end);
        return addres.replace(all, '***');
      }
      return addres;
    },
    [null],
  );

  const checkName = React.useCallback(
    async (val) => {
      const res = await nickNameExist(val);
      const { code, msg } = res;
      if (code === 100006) {
        setInfoMsg('Invalid username. The username is already taken');
        return false;
      }
      if (code === 100000) {
        return true;
      }
      toast.error(msg);
      return false;
    },
    [nickNameExist, address, getToken],
  );

  const submit = React.useCallback(
    async (event) => {
      event.preventDefault();
      if (!canSave) {
        toast.error('Avatar uploading!');
        return;
      }
      setInfoMsg('');
      let goSave = true;
      if (nickName !== orginName) {
        const rel = /^[0-9a-zA-Z.\d+\x7f-\xff_-]+$/;
        if (!rel.test(nickName)) {
          setInfoMsg(
            'Invalid username. Can only contain letters,numbers,hyphens(-),and underscores(_)',
          );
          goSave = false;
          return;
        }
        goSave = await checkName(nickName);
      }
      if (!goSave) {
        return;
      }
      setSaving(true);
      const token = getToken('atk');
      if (token) {
        updateBaseInfo(token, nickName, twitterAddress, websiteAddress, avatarUrl).then((res) => {
          const { code, msg } = res;
          if (code !== 100000) {
            toast.error('Update failed');
            setSaving(false);
            return;
          }
          toast.success('Profile successfully updated');
          setSaving(false);
          state.setState({
            profile: {
              nickName,
              address,
              avatar: avatarUrl,
            },
          });
        });
      }
    },
    [nickName, twitterAddress, websiteAddress, address, avatarUrl, canSave, orginName, checkName],
  );

  const uploadImage = React.useCallback(
    (res) => {
      setCanSave(true);
      setImgInfoMsg('');
      if (!res.success) {
        setImgInfoMsg('Update failed');
        return;
      }
      const url = res.data.res.requestUrls[0].split('?')[0];
      setAvatarUrl(url);
    },
    [null],
  );

  const beginUpload = React.useCallback(() => {
    setCanSave(false);
  }, [null]);

  return (
    <Page className={cn('min-h-screen flex flex-col', style.anPage)} meta={meta}>
      <div className="bg-black relative">
        <PageHeader className="relative z-10" active={'profile'} />
      </div>
      <div className={cn('main-content flex flex-col justify-center items-center', style.content)}>
        <div className={cn('w-full flex flex-col justify-start items-center', style.chartList)}>
          <div
            className={cn(
              'w-full text-xl text-white flex justify-start items-center  p-7',
              style.bottomBorder,
            )}
          >
            Profile Setting
          </div>
          <div className="flex justify-center items-center py-8">
            <div className="mr-7">
              <form onSubmit={submit}>
                <div className="mb-5 ">
                  <div className={cn('text-xs', style.baseInfo)}>
                    <span className={cn('mr-1', style.unNull)}>*</span>Required fields
                  </div>
                  <div></div>
                </div>
                <MeteInput
                  label="Username"
                  require={true}
                  name={'username'}
                  bold={true}
                  value={nickName}
                  requirePrefix={false}
                  onChangeHandler={(val) => {
                    setNickName(val);
                  }}
                  onBlur={(val) => {
                    setInfoMsg('');
                    let temp = val;
                    if (temp === '') {
                      temp = orginName || clipName(address);
                      setNickName(temp);
                    }
                    const rel = /^[0-9a-zA-Z.\d+\x7f-\xff_-]+$/;
                    if (!rel.test(temp)) {
                      setInfoMsg(
                        'Invalid username. Can only contain letters,numbers,hyphens(-),and underscores(_)',
                      );
                    }
                  }}
                  prefix="/images/v5/Username.png"
                ></MeteInput>
                <div className={cn('flex items-center text-xs mt-1 mb-2', style.warnContent)}>
                  {infoMsg && infoMsg !== '' ? (
                    <>
                      <img className="mr-2" src="/images/v5/warn.png"></img>
                      <span className={style.warn}>{infoMsg}</span>
                    </>
                  ) : null}
                </div>

                <MeteInputLimit
                  value={twitterAddress}
                  name={'twitter'}
                  label="Links"
                  prefix="/images/v5/Twitter.png"
                  prefixLabel="https://twitter.com/"
                  placeholder={'YourTwitterHandle'}
                  onChangeHandler={(val) => {
                    setTwitterAddress(val);
                  }}
                ></MeteInputLimit>
                <MeteInput
                  value={websiteAddress}
                  name={'website'}
                  prefix="/images/v5/home.png"
                  placeholder={'yoursite.io'}
                  classname="mt-3"
                  onChangeHandler={(val) => {
                    setWebsiteAddress(val);
                  }}
                ></MeteInput>

                <MeteInput
                  label="Wallet Address"
                  value={address}
                  name={'address'}
                  disable={true}
                  classname="mt-7"
                ></MeteInput>
                <div className=" pt-7">
                  <button
                    className={cn(
                      'flex justify-center items-center text-base font-semibold',
                      style.saveBtn,
                    )}
                  >
                    {saving ? (
                      <img
                        src="/images/v5/Frame.png"
                        className={cn('animate-spin', style.loading)}
                      />
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className={cn('self-start', style.divide)}></div>
            <div className={cn('ml-7 self-start', style.avatar)}>
              <div className={cn('flex items-center mb-5', style.avaterText)}>
                <span className=" mr-2">Profile Image</span>
                <img data-tip data-for="info" data-place="bottom" src="/images/v5/info.png"></img>
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
              <UploadImg
                imgUrl={avatarUrl || '/images/icon.png'}
                afterUpload={uploadImage}
                beginUpload={beginUpload}
              ></UploadImg>
              <div className={cn('flex items-center text-xs mt-1 mb-2', style.warnContent)}>
                {imgInfoMsg && imgInfoMsg !== '' ? (
                  <>
                    <img className="mr-2" src="/images/v5/warn.png"></img>
                    <span className={cn('mt-2', style.warn)}>{imgInfoMsg}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  );
}
