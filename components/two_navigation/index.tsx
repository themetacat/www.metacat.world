import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { useRouter } from 'next/router';
import style from './index.module.css';

type Props = {
  options?;
  className?: string;
  location?: string;
};

  export default function TwoNavigation(props) {
  const router = useRouter();
  
  const [showType, setShowType] = React.useState(router.route || 'analytics');

  const changeType = React.useCallback((newType) => {
    setShowType(newType.type);
    router.replace(newType.link);
  }, []);
  return (
    <div className={cn(props.location)}>
        {props.options.map((item, index) => {
        return (
          // <Link href={item.link}>
            <div key={index} onClick={()=>{changeType(item)}} className={cn(style.item, props.className)} style={{ display: 'flex' }}
            >
             {item.icon?(<img
                src={item.icon}
                style={{
                  width: '25px',
                  height: '25px',
                  marginRight:"8px",
                  lineHeight: '30px',
                  borderRadius: '50%',
                  marginTop: '12px',
                  border:"0.3px solid rgba(255,255,255,0.3)",
                }}
              ></img>):""} 
              <Link href={item.link}>{item.label}</Link>
            </div>
          // </Link>
        );
      })}
    </div>
  );
}
