import React from 'react';
import style from './index.module.css';

import { toast } from '../../node_modules/react-hot-toast/dist/index';
import { req_parcels_cancel, req_parcels_leased } from '../../service/z_api';
import { refreshToken } from '../../service';
import { convert, getToken, setToken } from '../../common/utils';

import { state } from '../wallet-btn';

type Props = {
  status?: string;
  price?: number;
  id?: number;
};

export default ({ status, price, id }: Props) => {
  const refreshTK = React.useCallback(async () => {
    const rToken = getToken('rtk');
    if (rToken) {
      const res = await refreshToken(rToken);
      const { code, data, msg } = res;
      if (code === 100003) {
        toast.error('Token timeout');
        window.location.href = '/';
        return null;
      }
      if (code !== 100000) {
        toast.error(msg);
        return null;
      }
      const { accessToken, refreshToken: rtk } = convert(data);
      setToken('atk', accessToken);
      setToken('rtk', rtk);
      state.setState({ accessToken, refreshToken: rtk });
      return accessToken;
    }
    return null;
  }, [null]);

  const rent_out = React.useCallback(async (event) => {
    event.stopPropagation();
  }, []);

  const leased = React.useCallback(async (event) => {
    event.stopPropagation();
    const token = await refreshTK();
    const result = await req_parcels_leased(token, id.toString());
    console.log(result);
  }, []);

  const cancel = React.useCallback(async (event) => {
    event.stopPropagation();
    const token = await refreshTK();
    const result = await req_parcels_cancel(token, id.toString());
    console.log(result);
  }, []);

  const edit = React.useCallback(async (event) => {
    event.stopPropagation();
  }, []);

  if (status === 'leased') {
    return (
      <div className={style.leasen_Container}>
        <div className={style.price}>{`${price} ETH/WEEK`}</div>
        <div className={style.lease}>Leased</div>
      </div>
    );
  }
  if (status === 'not_for_rent') {
    return (
      <div className={style.not_for_rent} onClick={rent_out}>
        Rent out
      </div>
    );
  }
  if (status === 'for_rent') {
    return (
      <div className={style.for_rent_Container}>
        <div className={style.price}>{`${price} ETH/WEEK`}</div>
        <div className={style.option}>
          <div onClick={edit} className={style.edit}>
            Edit
          </div>
          <div onClick={leased} className={style.leased}>
            Leased
          </div>
          <div onClick={cancel} className={style.cancel}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
};
