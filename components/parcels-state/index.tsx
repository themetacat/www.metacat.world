import cn from 'classnames';
import style from './index.module.css';

type Props = {
  status?: string;
  price?: number;
};

export default ({ status, price }: Props) => {
  if (status === 'leased') {
    return (
      <div className={cn('flex', style.leasen_Container)}>
        <div className={style.price}>{`${price} ETH/WEEK`}</div>
        <div className={style.lease}>Leased</div>
      </div>
    );
  }
  if (status === 'not_for_rent') {
    return <div className={style.not_for_rent}>Rent out</div>;
  }
  if (status === 'for_rent') {
    return (
      <div className={style.for_rent_Container}>
        <div className={style.price}>{`${price} ETH/WEEK`}</div>
        <div className={style.option}>
          <div>Leased</div>
          <div>Cancel</div>
        </div>
      </div>
    );
  }
};
