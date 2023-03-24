import React from 'react';
import cn from 'classnames';

interface Props {
  icon?: string;
  label?: string;
  link?: string;
  onActive?: (x) => void;
  className?: string;
}

export default function HeatMapTag({ icon, label, link, onActive, className }: Props) {
  const onAc = React.useCallback(() => {
    onActive({ icon, label, link });
  }, [null]);

  return (
    <div
      onClick={onAc}
      className={cn(' rounded-2xl bg-white bg-opacity-10 flex items-center event-hand', className)}
    >
      <img className="w-8 h-8 rounded-2xl" src={icon}></img>
      <div className=" text-white text-sm px-2">{label}</div>
    </div>
  );
}
