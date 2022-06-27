import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import ProfileIconLabel from '../profile-icon-label';
import { getToken } from '../../common/utils';
import style from './index.module.css';

// type Contact = {
//   icon?: string;
//   label?: string;
//   address?: string;
// };

interface Props {
  avatar?: string;
  name?: string;
  contact?;
  country?: string;
  from?;
  id?;
}

export default function UserAvatar({ avatar, name, contact, country, from, id }: Props) {
  const router = useRouter();
  const [C, setC] = React.useState([]);
  const [address, setAddress] = React.useState('');

  React.useEffect(() => {
    const a = getToken('address');
    console.log(1, a);
    console.log(2, id);
    if (a) {
      setAddress(a);
    }
    const c = contact.filter((i) => i.address);
    setC(c);
  }, [contact, id]);
  const toMySetting = React.useCallback(() => {
    router.replace('/profile/setting');
  }, []);
  return (
    <div className="flex flex-col justify-center items-center">
      <img className={cn('mt-1', style.userAvatar)} src={avatar}></img>
      <div className="flex">
        <div className=" mt-1 text-white text-xl">{name}</div>
        {from === 'profile' || address === id ? (
          <img
            src="/images/icon/bianji.png"
            className="w-6 h-6 mt-1 ml-1"
            style={{ cursor: 'pointer' }}
            onClick={toMySetting}
          />
        ) : null}
      </div>
      {country ? <div className={style.country}>Country : {country}</div> : null}
      <div className={cn('mt-1 flex justify-start items-center', style.links)}>
        {C.map((ele, idx) => {
          if (idx !== 0) {
            return (
              <div key={idx} className="flex items-center">
                <div className={cn('mx-5', style.divide)}></div>
                <ProfileIconLabel
                  label={ele.label}
                  icon={ele.icon}
                  prefix={true}
                  link={ele.address}
                  isLink={true}
                  classname={'text-sm'}
                ></ProfileIconLabel>
              </div>
            );
          }
          return (
            <ProfileIconLabel
              key={idx}
              label={ele.label}
              icon={ele.icon}
              prefix={true}
              link={ele.address}
              isLink={true}
              classname={'text-sm'}
            ></ProfileIconLabel>
          );
        })}
      </div>
    </div>
  );
}
