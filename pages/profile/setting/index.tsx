import React from 'react';

import cn from 'classnames';

import ReactTooltip from 'react-tooltip';

import Page from '../../../components/page';
import PageHeader from '../../../components/page-header';
import Footer from '../../../components/footer';
import MeteInput from '../../../components/meta-input';

import { SITE_NAME, META_DESCRIPTION } from '../../../common/const';

import style from './index.module.css';

export default function Settings({ base_info, parcel_list }) {
  const meta = {
    title: `ProfileSetting - ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };

  const [infoMsg, setInfoMsg] = React.useState('');

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
              <form>
                <div className="mb-5 ">
                  <div className={cn('text-xs', style.baseInfo)}>
                    <span className={cn('mr-1', style.unNull)}>*</span>Require file
                  </div>
                  <div></div>
                </div>
                <MeteInput
                  label="Username"
                  require={true}
                  bold={true}
                  requirePrefix={false}
                  onChangeHandler={(val) => {
                    const rel = /^[0-9a-zA-Z.\d+\x7f-\xff_-]+$/;
                    if (!rel.test(val)) {
                      setInfoMsg(
                        'Invalid username. Can only contain letters,numbers,huyphens(-),and underscores(_)',
                      );
                      return;
                    }
                    setInfoMsg('');
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

                <MeteInput label="Links" prefix="/images/v5/Twitter.png"></MeteInput>
                <MeteInput prefix="/images/v5/yoursite.io.png" classname="mt-3"></MeteInput>

                <MeteInput label="Wallet Address" disable={true} classname="mt-7"></MeteInput>
                <div className=" pt-7">
                  <div
                    className={cn(
                      'flex justify-center items-center text-xl font-semibold',
                      style.saveBtn,
                    )}
                  >
                    Save
                  </div>
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
              <img src="/images/icon.png"></img>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  );
}
