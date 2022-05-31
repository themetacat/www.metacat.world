import React from 'react';
import cn from 'classnames';

import ProfileIconLabel from '../profile-icon-label';

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
}

export default function UserAvatar({ avatar, name, contact, country }: Props) {
  const [C, setC] = React.useState([]);

  React.useEffect(() => {
    const c = contact.filter((i) => i.address);
    setC(c);
  }, [contact]);
  return (
    <div className="flex flex-col justify-center items-center">
      <img className={cn('mt-1', style.userAvatar)} src={avatar}></img>
      <div className=" mt-1 text-white text-xl">{name}</div>
      {country ? <div className={style.country}>Country:{country}</div> : null}
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
