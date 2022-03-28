import style from './index.module.css';

type Props = {
  state?: boolean;
  onClick?;
};
export default function rent_set({ state, onClick }: Props) {
  const value = '0.1';
  console.log(state);
  if (state) {
    return (
      <div className={style.container}>
        <div className={style.header}>
          <h3>Rent out Setting</h3>
          <span>&ensp;*&nbsp;</span>
          <p>Required fields</p>
          <div
            onClick={() => {
              onClick(false);
            }}
          >
            x
          </div>
        </div>
        <div className={style.body}>
          <div className={style.parcel}>
            Parcel
            <span>&nbsp;*</span>
          </div>
          <div className={style.built}>
            <div>Built</div>
            <img src="/images/Frame-down.png" />
          </div>
          <div className={style.term}>
            <div>Lease Term</div>
            <span>&nbsp;*</span>
          </div>
          <div className={style.time}>
            <div>1 Month</div>
            <img src="/images/Frame-down.png" />
          </div>
          <div className={style.tdoa}>
            <div>2020-03-19 12:50:18</div>
            <p>to</p>
            <div>2020-03-19 12:50:19</div>
          </div>
          <div className={style.rental}>
            <div>Rental price</div>
            <span>&nbsp;*</span>
          </div>
          <div className={style.price}>
            <input type="text" value={value} />
            <div>ETH / Week</div>
          </div>
          <div className={style.save}>Save</div>
        </div>
      </div>
    );
  }
  return null;
}
