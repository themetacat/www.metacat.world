import React from 'react';
import cn from 'classnames';

import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import style from './index.module.css';
import 'swiper/css';
import 'swiper/css/navigation';

type optionItem = {
  label?: string;
  value?: string;
  icon?: string;
};

type Props = {
  onActive?: (x) => void;
  options?: Array<optionItem>;
  defaultValue?: string;
  id?: string;
  className?;
  fixedS?;
};
export default function Switch({ onActive, options, defaultValue, id, className, fixedS }: Props) {
  const [active, setActive] = React.useState(defaultValue || options[0].value);
  const [percent, setPercent] = React.useState(0);
  const changeActive = React.useCallback(
    (acitveItem) => {
      setActive(acitveItem.value);
      if (onActive) {
        onActive(acitveItem.value);
      }
    },
    [options, onActive],
  );

  return (
    <div
      className={cn(
        'flex justify-center items-center mt-2',
        style.container,
        fixedS ? className : null,
      )}
      id={id}
    >
      <div
        className={cn(
          'per absolute z-50 flex justify-start items-center',
          {
            hidden: percent <= 0,
          },
          style.per,
        )}
      >
        <img className={style.icon} src="/images/tab-left.png"></img>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={1}
        slidesPerView="auto"
        loop={true}
        className={cn('w-full', style.swiper)}
        navigation={{
          prevEl: '.per',
          nextEl: '.next',
        }}
        onProgress={(swiper, progress) => {
          setPercent(progress);
        }}
      >
        {options.map((item, idx) => {
          return (
            <SwiperSlide
              className={cn(
                'box-border w-12 py-2 px-4 font-semibold text-white',
                style.base,
                item.value === active ? style.active : '',
                item.value === 'sandbox' ? style.p1 : null,
                item.value === 'nftworlds' ? style.p2 : null,
                item.value === 'decentraland' ? style.p3 : null,
                item.value === 'cryptovoxels' ? style.p3 : null,
                item.value === 'worldwidewebb' ? style.p4 : null,
                item.value === 'somniumspace' ? style.p5 : null,
              )}
              key={idx}
              onClick={() => {
                changeActive(item);
              }}
            >
              <div className={cn('flex justify-center items-center', style.canHover)}>
                <div
                  className={cn('bg-contain mr-2', style.tabIcon)}
                  style={{ backgroundImage: `url('${item.icon}')` }}
                ></div>
                <div className={style.n}>{item.label}</div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className={cn(
          'next absolute z-50  flex justify-end items-center',
          {
            hidden: percent >= 1,
          },
          style.next,
        )}
      >
        <img className={style.icon} src="/images/tab-right.png"></img>
      </div>
    </div>
  );
}
