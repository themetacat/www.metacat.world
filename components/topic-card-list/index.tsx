import React from 'react';
import cn from 'classnames';

// Import Swiper React components
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import TopicCard from '../topic-card';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import styles from './index.module.css';

type Item = {
  topicId?: number;
  name?: string;
  type?: string;
  imgUrlList?: Array<string>;
};

type Props = {
  topics?: Array<Item>;
};

export default function TopicCardList({ topics }: Props) {
  return (
    <div className={cn('main-content h-full', styles.swiper)}>
      <div
        className={cn('topicperbtn flex justify-center items-center', styles.btn, styles.perbtn)}
      >
        <img className={styles.icon} src="/images/carousel-left.png"></img>
      </div>
      <Swiper
        className="h-full"
        modules={[Autoplay, Navigation]}
        spaceBetween={14}
        slidesPerView={4}
        autoplay={{
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.topicnextbtn',
          prevEl: '.topicperbtn',
        }}
      >
        {topics.map((item, idx) => {
          return (
            <SwiperSlide
              className={cn('w-full h-full', styles.slide)}
              key={idx}
              onClick={() => {
                console.log(item.name);
              }}
            >
              <TopicCard {...item} key={idx} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className={cn('topicnextbtn flex justify-center items-center', styles.btn, styles.nextbtn)}
      >
        <img className={styles.icon} src="/images/carousel-right.png"></img>
      </div>
    </div>
  );
}
