import React from 'react';
import cn from 'classnames';
import AnalyticsCard from '../analytics-card';

class price {
  icon?: string;

  label?: string;

  price?: string;

  precent?: number;
}

interface Props {
  items?: Array<price>;
  title?: string;
  className?: string;
}

export default function FloorPriceCard({ title, items, className }: Props) {
  return (
    <AnalyticsCard link="/" title={title} backCls="cover1">
      <ul className={cn(' list-none w-full text-white text-sm py-8 px-5', className)}>
        {items.map((item, idx) => {
          return (
            <li key={idx} className="flex justify-between items-center mb-6">
              <div className=" flex items-center">
                <span className=" mr-2">{`${idx + 1}.`}</span>
                <img className=" w-6 h-6 rounded-xl mr-2" src={item.icon}></img>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center">
                <img className=" w-3 h-3 mr-1" src="/images/v2/eth.png"></img>
                <span>{item.price}</span>
              </div>

              <span>{item.precent}</span>
            </li>
          );
        })}
      </ul>
    </AnalyticsCard>
  );
}
