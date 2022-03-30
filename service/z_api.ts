import * as qs from 'qs';

// 设置单个或批量出租

export const req_parcels_rent_out = async (
  token: string,
  parcel_ids: string,
  is_built: string,
  price: string,
  start_at: string,
  end_at: string,
) => {
  const url = '/api/batch_list_cv_parcels';

  const search = qs.stringify(
    {
      parcel_ids,
      is_built,
      price,
      start_at,
      end_at,
    },
    { addQueryPrefix: false },
  );
  const result = await fetch(url, {
    method: 'post',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: search,
  });
  const json = await result.json();

  return json;
};

// 设置批量或单个取消出租

export const req_parcels_cancel = async (token: string, parcel_ids: string) => {
  const search = qs.stringify({ parcel_ids }, { addQueryPrefix: false });
  const url = `/api/batch_cancel_listed_cv_parcels`;
  const result = await fetch(url, {
    method: 'post',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: search,
  });
  const json = await result.json();

  return json;
};

// 设置单个或批量已出租

export const req_parcels_leased = async (token: string, parcel_ids: string) => {
  const search = qs.stringify({ parcel_ids }, { addQueryPrefix: false });
  const url = `/api/batch_lease_listed_cv_parcels`;
  const result = await fetch(url, {
    method: 'post',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: search,
  });
  const json = await result.json();

  return json;
};

// 单个更新CV地块租赁

export const req_parcels_update = async (
  token: string,
  parcel_id: string,
  is_built?: string,
  price?: string,
  start_at?: string,
  end_at?: string,
) => {
  const url = '/api/update_cv_parcel';
  const search = qs.stringify(
    {
      parcel_id,
      is_built,
      price,
      start_at,
      end_at,
    },
    { addQueryPrefix: false },
  );
  const result = await fetch(url, {
    method: 'post',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: search,
  });
  const json = await result.json();

  return json;
};
