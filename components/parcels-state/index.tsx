import React from 'react';
import style from './index.module.css';

import { toast } from '../../node_modules/react-hot-toast/dist/index';
import { req_parcels_cancel, req_parcels_leased, req_parcels_finish } from '../../service/z_api';
import { refreshToken } from '../../service';
import { convert, getToken, setToken } from '../../common/utils';
import store from '../../store/profile';

import { state } from '../wallet-btn';

type Props = {
  status?: string;
  price?: number;
  id?: number;
  is_state?: boolean;
};
export default ({ status, price, id, is_state }: Props) => {
  const s = store.useState('parcels_cardState');
  const [current_state, set_current_state] = React.useState(false);
  const rent_out = React.useCallback(
    async (event) => {
      event.stopPropagation();
      if (s.parcels_cardState) return;
      store.setState(() => ({ rentOutState: true, id, updateOrAdd: 'add' }));
    },
    [s],
  );
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

  const leased = React.useCallback(async (event) => {
    event.stopPropagation();
    const token = await refreshTK();
    const result = await req_parcels_leased(token, id.toString());
    if (result.code === 100000) {
      store.setState(() => ({ status: 'Successfully marked!', id: null }));
      return;
    }
    store.setState(() => ({ status: 'Failed!', id: null }));
  }, []);

  const cancel = React.useCallback(async (event) => {
    event.stopPropagation();
    const token = await refreshTK();
    const result = await req_parcels_cancel(token, id.toString());
    if (result.code === 100000) {
      store.setState(() => ({ status: 'Successfully cancelled', id: null }));
      return;
    }
    store.setState(() => ({ status: 'Failed!', id: null }));
  }, []);

  React.useEffect(() => {
    set_current_state(is_state);
  }, [set_current_state, is_state]);

  const edit = React.useCallback(async (event) => {
    event.stopPropagation();
    if (current_state) return;
    store.setState(() => ({ rentOutState: true, id, updateOrAdd: 'update' }));
  }, []);

  const finish = React.useCallback(async (event) => {
    event.stopPropagation();
    const token = await refreshTK();
    const result = await req_parcels_finish(token, id);
    if (result.code === 100000) {
      store.setState(() => ({ status: 'Successfully finished!', id: null }));
      return;
    }
    store.setState(() => ({ status: 'Failed!', id: null }));
  }, []);

  if (status === 'leased') {
    return (
      <div className={style.leasen_Container}>
        <div className={style.price}>{`${price} ETH/WEEK`}</div>
        <div className={style.lease}>Leased</div>
        <div onClick={finish} className={style.finish}>
          Finish
        </div>
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
