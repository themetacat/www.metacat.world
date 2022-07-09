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

type Props = {
  imgs: Array<string>;
};

export default function CarouseSinglePic({ imgs }: Props) {
  const jumpToDetail = React.useCallback(
    (url) => {
      window.open(url);
    },
    [imgs],
  );

  return (
    <div className={cn('w-full h-full', styles.swiper)}>
      <Swiper
        className="h-full rounded-lg"
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{ disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class='${className}'></span>`;
          },
        }}
      >
        {imgs.map((slide, idx) => {
          return (
            <SwiperSlide className={cn('w-full h-full', styles.slide)} key={idx}>
              <img
                className={cn('w-full', styles.img)}
                src={slide || '/images/default-cover.png'}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
