import React from 'react';
import cn from 'classnames';

import { EffectCreative, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from 'next/router';

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
  defaultValue?;
  showType?;
  id?: string;
  className?;
  fixedS?;
};
export default function Switch({ onActive, options,showType, defaultValue, id, className, fixedS }: Props) {
  const router = useRouter();
  const [active, setActive] = React.useState(defaultValue || options[0].value);
  const [percent, setPercent] = React.useState(0);
  const [findIndex, setFindIndex] = React.useState(1);
  const [isSwiper, setSwiper] = React.useState(null);
  const changeActive = React.useCallback(

    (acitveItem) => {
      setActive(acitveItem.value);
      if (onActive) {
        onActive(acitveItem.value);
      }
    },
    [options, onActive],
  );
  React.useEffect(() => {
  
    if (router) {
      // if (router.query.type === showType) return
      const index = options.findIndex(item => {
        return item.value === router.query.type
      })
      setFindIndex(index)
      isSwiper?.slideToLoop(index)
    
    
    }
  
    setActive(router.query.type)
    onActive(router?.query?.type);
  }, [router.query.type])
  return (
    <>
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
          // effect={'slide'}
          // creativeEffect={{
          //   prev: {
          //     // translate: [-200, 0, 0],
          //   }
          // }}
          // initialSlide={findIndex}
          onSwiper={(swiper) => {
            const index = options.findIndex(item => {
              return item.value === router.query.type
            })
            swiper?.slideToLoop(index)
            setSwiper(swiper)
          }}
          spaceBetween={1}
          slidesPerView="auto"
          loop={true}
          centeredSlides={true}
          slideToClickedSlide={true}
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
                  'box-border w-12  font-semibold text-white',
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
      <div className={style.underline}></div>
    </>
  );
}
