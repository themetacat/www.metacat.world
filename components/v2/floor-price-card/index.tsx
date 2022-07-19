import React from 'react';
import cn from 'classnames';
import AnalyticsCard from '../analytics-card';

import { ICON_DATA } from '../../../common/const';

class price {
  world?: string;

  floorPrice?: number;

  percentage?: number;
}

interface Props {
  items?: Array<price>;
  title?: string;
  className?: string;
}

export default function FloorPriceCard({ title, items, className }: Props) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const result = items.map((x) => {
      const n = ICON_DATA.find((y) => y.world === x.world);
      if (!n) {
        return null;
      }
      return {
        icon: n.icon,
        label: n.label,
        price: x.floorPrice,
        precent: x.percentage,
      };
    });
    setData(result);
  }, [items]);

  return (
    <AnalyticsCard title={title} backCls="cover1">
      <ul
        className={cn(' list-none w-full text-white text-sm py-8 px-5 overflow-hidden', className)}
      >
        {data.map((item, idx) => {
          console.log(item);
          return item ? (
            <li key={idx} className="flex justify-between items-center mb-6">
              <div className="flex items-center w-40">
                <span className=" mr-2">{`${idx + 1}.`}</span>
                <img className=" w-6 h-6 rounded-xl mr-2" src={item.icon}></img>
                <span className="truncate" title={item.label}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center">
                <img className=" w-3 h-3 mr-1" src="/images/v2/eth.png"></img>
                <span>{item.price}</span>
              </div>

              <span
                className={cn(
                  item.precent >= 0 ? ' text-green-500' : ' text-red-500',
                  ' w-10 text-right',
                )}
              >{`${item.precent > 0 ? '+' : ''}${item.precent * 100}%`}</span>
            </li>
          ) : null;
        })}
      </ul>
    </AnalyticsCard>
  );
}
