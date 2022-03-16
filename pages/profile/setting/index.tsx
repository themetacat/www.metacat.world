import React from 'react';

import cn from 'classnames';

import ReactTooltip from 'react-tooltip';

import { toast } from 'react-toastify';

import Page from '../../../components/page';
import PageHeader from '../../../components/page-header';
import Footer from '../../../components/footer';
import MeteInput from '../../../components/meta-input';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import { getBaseInfo, updateBaseInfo, nickNameExist } from '../../../service';

import { useWalletProvider } from '../../../components/web3modal';

import style from './index.module.css';
import { convert, getToken } from '../../../common/utils';
import UploadImg from '../../../components/upload-img';

export default function Settings() {
  const meta = {
    title: `ProfileSetting - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [infoMsg, setInfoMsg] = React.useState('');
  const [imgInfoMsg, setImgInfoMsg] = React.useState('Update failed');
  const [nickName, setNickName] = React.useState('');
  const [twitterAddress, setTwitterAddress] = React.useState('');
  const [websiteAddress, setWebsiteAddress] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [avaterUrl, setAvaterUrl] = React.useState('/images/icon.png');
  const [canSave, setCanSave] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const web3 = useWalletProvider();

  const requireData = React.useCallback(
    async (token) => {
      const res = await getBaseInfo(token);
      const { data } = res;
      if (data) {
        const profile = convert(data.profile);
        const { address: addr, nickName: name, avatar, links } = profile;
        const { twitterName, websiteUrl } = links;
        setAvaterUrl(avatar);
        setAddress(addr);
        setNickName(name);
        setTwitterAddress(twitterName);
        setWebsiteAddress(websiteUrl);
      }
    },
    [null],
  );

  React.useEffect(() => {
    const accessToken = getToken(web3.data.address, 'atk');
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

  const submit = React.useCallback(
    (event) => {
      setSaving(true);
      event.preventDefault();
      if (infoMsg || infoMsg !== '') {
        toast.warn('Invalid username', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'dark',
        });
        setSaving(false);
        return;
      }
      const token = getToken(address, 'atk');
      if (token) {
        updateBaseInfo(token, nickName, twitterAddress, websiteAddress).then((res) => {
          const { code, msg } = res;
          if (code !== 100000) {
            toast.error('Update failed', {
              position: 'top-center',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: 'dark',
            });
            setSaving(false);
            return;
          }
          toast.success('Profile successfully updated', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'dark',
          });
          setSaving(false);
        });
      }
    },
    [nickName, twitterAddress, websiteAddress, address],
  );

  return (
    <Page className={cn('min-h-screen', style.anPage)} meta={meta}>
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
          <div className="flex justify-center items-center pt-8">
            <div className="mr-7">
              <form onSubmit={submit}>
                <div className="mb-5 ">
                  <div className={cn('text-xs', style.baseInfo)}>
                    <span className={cn('mr-1', style.unNull)}>*</span>Require file
                  </div>
                  <div></div>
                </div>
                <MeteInput
                  label="Username"
                  require={true}
                  name={'username'}
                  bold={true}
                  value={nickName || clipName(address)}
                  requirePrefix={false}
                  onChangeHandler={(val) => {
                    setNickName(val);
                    setInfoMsg('');
                    const rel = /^[0-9a-zA-Z.\d+\x7f-\xff_-]+$/;
                    if (!rel.test(val)) {
                      setInfoMsg(
                        'Invalid username. Can only contain letters,numbers,huyphens(-),and underscores(_)',
                      );
                      setCanSave(false);
                      return;
                    }
                    if (val) {
                      const check = nickNameExist(val);
                      check.then((res) => {
                        if (res.code === 100006) {
                          setInfoMsg('Invalid username. The username is already taken');
                          setCanSave(false);
                          return;
                        }
                        if (res.code === 100000) {
                          setCanSave(true);
                        }
                      });
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

                <MeteInput
                  value={twitterAddress}
                  name={'twitter'}
                  label="Links"
                  prefix="/images/v5/Twitter.png"
                  placeholder={'Twitter'}
                  onChangeHandler={(val) => {
                    setTwitterAddress(val);
                  }}
                ></MeteInput>
                <MeteInput
                  value={websiteAddress}
                  name={'website'}
                  prefix="/images/v5/yoursite.io.png"
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
                      'flex justify-center items-center text-xl font-semibold',
                      style.saveBtn,
                    )}
                  >
                    {saving ? (
                      <img
                        src="/images/loading.png"
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
              <UploadImg imgUrl={avaterUrl || '/images/icon.png'}></UploadImg>
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
