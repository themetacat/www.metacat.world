import React from 'react';
import moment from 'moment';
import cn from 'classnames';
import style from './index.module.css';
import { getToken } from '../../common/utils';
import store from '../../store/profile';

import { req_parcels_rent_out, req_parcels_update } from '../../service/z_api';

type Props = {
  state?: boolean;
  onClick?;
  selectedIds;
};

export default function rent_set({ state, onClick, selectedIds }: Props) {
  const [show_built, set_show_built] = React.useState('Built');
  const [show_time, set_show_time] = React.useState('1 Month');
  const [parcel_state, set_parcel_state] = React.useState(false);
  const [term_state, set_term_state] = React.useState(false);
  const [start_at, set_start_at] = React.useState('');
  const [end_at, set_end_at] = React.useState('');
  const [is_price, set_is_price] = React.useState(false);

  // 发送保存请求所需参数
  const [end_timestamp, set_end_timestamp] = React.useState('');
  const [start_timestamp, set_start_timestamp] = React.useState('');
  const [price, set_price] = React.useState('0.1');
  const [built, set_built] = React.useState('yes');
  const [selected_ids, set_selected_ids] = React.useState('');
  const [token, set_token] = React.useState('');

  const s = store.useState('updateOrAdd', 'parcels_cardState');
  const is_built = [
    {
      label: 'Built',
    },
    {
      label: 'Not built',
    },
  ];
  const is_time = [
    {
      value: '1 Week',
    },
    {
      value: '1 Month',
    },
    {
      value: '3 Months',
    },
    {
      value: '6 Months',
    },
  ];
  const clear = React.useCallback(() => {
    set_end_timestamp('');
    set_start_timestamp('');
    set_price('0.1');
    set_built('yes');
    set_selected_ids('');
    set_show_built('Built');
    set_show_time('1 Month');
  }, []);
  const show_parcel = React.useCallback(
    (current_state) => {
      set_parcel_state(!current_state);
      set_term_state(false);
    },
    [parcel_state],
  );

  const set_parcel_show = React.useCallback(
    (label) => {
      set_show_built(label);
      if (label === 'Built') {
        set_built('yes');
      }
      if (label === 'Not built') {
        set_built('no');
      }
    },
    [show_built],
  );
  const change_show_time_state = React.useCallback(
    (time_state) => {
      set_term_state(!time_state);
      set_parcel_state(false);
    },
    [term_state],
  );

  const change_price = React.useCallback((event) => {
    set_price(event.target.value.toString());
  }, []);
  const start_time = React.useCallback(() => {
    const start = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
    set_start_at(start);
    set_start_timestamp(moment(start).valueOf().toString().slice(0, 10));
  }, [start_at]);
  const end_time = React.useCallback(
    (type = '1 Month') => {
      if (type === '1 Week') {
        set_end_at(moment().add(7, 'd').format('YYYY-MM-DD HH:mm:ss'));

        set_start_timestamp(
          moment(moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
        set_end_timestamp(
          moment(moment().add(7, 'd').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
      }
      if (type === '1 Month') {
        set_end_at(moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss'));
        set_start_timestamp(
          moment(moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
        set_end_timestamp(
          moment(moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
      }
      if (type === '3 Months') {
        set_end_at(moment().add(3, 'M').format('YYYY-MM-DD HH:mm:ss'));
        set_start_timestamp(
          moment(moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
        set_end_timestamp(
          moment(moment().add(3, 'M').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
      }
      if (type === '6 Months') {
        set_end_at(moment().add(6, 'M').format('YYYY-MM-DD HH:mm:ss'));
        set_start_timestamp(
          moment(moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
        set_end_timestamp(
          moment(moment().add(6, 'M').format('YYYY-MM-DD HH:mm:ss'))
            .valueOf()
            .toString()
            .slice(0, 10),
        );
      }
    },
    [end_at],
  );

  const change_show_time = React.useCallback(
    (value) => {
      set_show_time(value);
      start_time();
      end_time(value);
    },
    [show_time],
  );
  const save = React.useCallback(async () => {
    if (Number(price) <= 0 || Number(price) > 10) {
      set_is_price(true);
      return;
    }
    set_is_price(false);
    if (s.updateOrAdd === 'add') {
      if (token) {
        const result = await req_parcels_rent_out(
          token,
          selected_ids,
          built,
          price,
          start_timestamp,
          end_timestamp,
        );
        if (result.code === 100000) {
          store.setState(() => ({ rentOutState: false, status: 'Successfully listed!', id: null }));
          return;
        }
        store.setState(() => ({ rentOutState: false, status: 'Failed!', id: null }));
      }
    }
    if (s.updateOrAdd === 'update') {
      if (token) {
        const result = await req_parcels_update(
          token,
          Number(selected_ids),
          built,
          price,
          Number(start_timestamp),
          Number(end_timestamp),
        );
        if (result.code === 100000) {
          store.setState(() => ({ rentOutState: false, status: 'Successfully listed!' }));
          return;
        }
        store.setState(() => ({ rentOutState: false, status: 'Failed!' }));
      }
    }
    clear();
    store.setState(() => ({ parcels_cardState: false, id: null }));
  }, [selectedIds, getToken, show_built, price, start_at, end_at, token, s]);
  React.useEffect(() => {
    start_time();
    end_time();
    set_selected_ids(selectedIds.join(','));
    const accessToken = getToken('atk');
    if (accessToken) {
      set_token(accessToken);
    }
  }, [selectedIds, state, token]);

  if (state) {
    return (
      <div className={style.shade}>
        <div className={style.container}>
          <div className={style.header}>
            <h3>Rent out Setting</h3>
            <span>&ensp;*&nbsp;</span>
            <p>Required fields</p>
            <div
              onClick={() => {
                onClick(false);
                clear();
                store.setState(() => ({ parcels_cardState: false, id: null }));
                set_is_price(false);
              }}
            >
              <img src="/images/guanbi.png" className={style.guanbi} />
            </div>
          </div>
          <div className={style.body}>
            <div className={style.parcel}>
              Parcel
              <span>&nbsp;*</span>
            </div>
            <div
              className={style.built}
              onClick={() => {
                show_parcel(parcel_state);
              }}
            >
              <div>{show_built}</div>
              {parcel_state ? (
                <img src="/images/Frame-up.png" />
              ) : (
                <img src="/images/Frame-down.png" />
              )}
              {parcel_state ? (
                <div className={style.parcel_show}>
                  {is_built.map((item) => {
                    return (
                      <div
                        key={item.label}
                        className={style.item}
                        onClick={() => {
                          set_parcel_show(item.label);
                        }}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className={style.term}>
              <div>Lease Term</div>
              <span>&nbsp;*</span>
            </div>
            <div
              className={style.time}
              onClick={() => {
                change_show_time_state(term_state);
              }}
            >
              <div>{show_time}</div>
              {term_state ? (
                <img src="/images/Frame-up.png" />
              ) : (
                <img src="/images/Frame-down.png" />
              )}
              {term_state ? (
                <div className={style.show_term}>
                  {is_time.map((item) => {
                    return (
                      <div
                        key={item.value}
                        className={style.show_item}
                        onClick={() => {
                          change_show_time(item.value);
                        }}
                      >
                        {item.value}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className={style.tdoa}>
              <div>{start_at}</div>
              <p>to</p>
              <div>{end_at}</div>
            </div>
            <div className={style.rental}>
              <div>Rental price</div>
              <span>&nbsp;*</span>
            </div>
            <div className={style.price}>
              <input
                type="text"
                placeholder="0.1"
                value={price}
                onInput={(event) => {
                  change_price(event);
                }}
              />
              <div>ETH / Week</div>
            </div>
            <div className={cn(style.iv, is_price ? null : style.dn)}>
              Invalid value，0 ETH＜price≤10.00 ETH
            </div>
            <div
              className={style.save}
              onClick={() => {
                save();
              }}
            >
              Save
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
