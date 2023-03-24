import React from 'react';

import cn from 'classnames';
// Import Swiper React components
import { Pagination, Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import styles from './index.module.css';

type img = {
  name?: string;
  imgUrl?: string;
  url?: string;
};

type Props = {
  imgs: Array<img>;
};

export default function Carousel({ imgs }: Props) {
  const jumpToDetail = React.useCallback(
    (url) => {
      window.open(url);
    },
    [imgs],
  );

  return (
    <div className={cn('w-full h-full', styles.swiper)}>
      <div
        className={cn(
          'perbtn flex justify-center items-center bg-white bg-opacity-30',
          styles.btn,
          styles.perbtn,
        )}
      >
        <img className={styles.icon} src="/images/carousel-left.png"></img>
      </div>
      <Swiper
        className="h-full rounded-lg"
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.nextbtn',
          prevEl: '.perbtn',
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class='${className}'></span>`;
          },
        }}
      >
        {imgs.map((slide, idx) => {
          return (
            <SwiperSlide
              className={cn('w-full h-full', styles.slide)}
              key={idx}
              onClick={() => {
                jumpToDetail(slide.url);
              }}
            >
              <img
                className={cn('w-full', styles.img)}
                src={slide.imgUrl || '/images/default-cover.png'}
              />
              <div
                className={cn(
                  'w-full text-white text-lg px-4 flex justify-between pt-5 pl-7 font-medium bg-mainDark bg-opacity-20',
                  styles.title,
                )}
              >
                <span className=" w-4/5 truncate">{slide.name}</span>
                <a className=" text-sm text-mainDark font-normal event-hand">{`View Heatmap >`}</a>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className={cn(
          'nextbtn flex justify-center items-center bg-white bg-opacity-30',
          styles.btn,
          styles.nextbtn,
        )}
      >
        <img className={styles.icon} src="/images/carousel-right.png"></img>
      </div>
    </div>
  );
}
