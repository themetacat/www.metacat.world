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
  parcel_id: number,
  is_built?: string,
  price?: string,
  start_at?: number,
  end_at?: number,
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

// 设置单个取消挂出

export const req_parcels_finish = async (token: string, id: number) => {
  const url = '/api/cv_parcel_fallback_to_listed_status';
  const search = qs.stringify({ parcel_id: id }, { addQueryPrefix: false });
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

// 8.6 获取 Cryptovoxels 岛屿列表接口
export const req_rent_islands = async () => {
  const url = '/api/get_cv_island_list';
  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 8.8 获取租赁市场 Cryptovoxels 地块列表接口
export const req_rent_cardList = async (
  page: number,
  count: number,
  island_ids: string,
  area_scope: string,
  height_scope: string,
  price_scope: string,
  built_status: string,
  sort_field: string,
  sort_type: string,
) => {
  const search = qs.stringify(
    {
      page,
      count,
      island_ids,
      area_scope,
      height_scope,
      price_scope,
      built_status,
      sort_field,
      sort_type,
    },
    { addQueryPrefix: true },
  );
  const url = `/api/get_listed_cv_parcels${search}`;

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = result.json();

  return json;
};

// 12.1 获取当前登录者 Decentraland 地块列表接口

export const req_dcl_parcel_list = async (token: string) => {
  const url = '/api/get_owned_dcl_parcel_list';
  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await result.json();

  return json;
};

// 12.2 批量（单个）挂出 Decentraland 待租地块接口

export const req_dcl_batch_parcels = async (
  token: string,
  parcel_ids: string,
  is_built: string,
  price: number,
  start_at: number,
  end_at: number,
) => {
  const url = `/api/batch_list_dcl_parcels`;
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

// 12.3 批量（单个）取消已挂出 Decentraland 地块接口

export const req_dcl_cancel = async (token: string, parcel_ids: string) => {
  const url = `/api/batch_cancel_listed_dcl_parcels`;
  const search = qs.stringify({ parcel_ids });
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

// 12.4 批量（单个）更新已挂出 Decentraland 地块为租赁中接口

export const req_dcl_leased = async (token: string, parcel_ids: string) => {
  const url = `/api/batch_lease_listed_dcl_parcels`;
  const search = qs.stringify({ parcel_ids });
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

// 12.5 单个更新 Decentraland 地块租赁信息接口

export const req_dcl_update = async (
  token: string,
  parcel_id: string,
  is_built: string,
  price: number,
  start_at: number,
  end_at: number,
) => {
  const url = `/api/update_dcl_parcel`;
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

// 12.6 单个更新租赁中 Decentraland 地块为已挂出状态接口

export const req_dcl_listed = async (token: string, parcel_id: string) => {
  const url = `/api/dcl_parcel_fallback_to_listed_status`;
  const search = qs.stringify({ parcel_id });
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

// 12.7 获取租赁市场 Decentraland 地块列表接口

export const req_dcl_List = async (
  page: number,
  count: number,
  size_scope: string,
  price_scope: string,
  built_status: string,
  sort_field: string,
  sort_type: string,
) => {
  const search = qs.stringify(
    {
      page,
      count,
      size_scope,
      price_scope,
      built_status,
      sort_field,
      sort_type,
    },
    { addQueryPrefix: true },
  );
  const url = `/api/get_listed_dcl_parcels${search}`;

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

//  6.12 获取 Sandbox 地块成交均价统计信息接口

export const req_sandbox_avg_price_stats = async () => {
  const url = '/api/get_sandbox_parcel_avg_price_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.13 获取 Sandbox 地块成交总数量统计信息接口

export const req_sandbox_sold_total_stats = async () => {
  const url = '/api/get_sandbox_parcel_sold_total_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.14 获取 Sandbox 地块销售总额统计信息接口

export const req_sandbox_sold_sun_stats = async () => {
  const url = '/api/get_sandbox_parcel_sold_sum_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.15 获取 SomniumSpace 地块成交均价统计信息接口

export const req_somniumspace__avg_price_stats = async () => {
  const url = '/api/get_somniumspace_parcel_avg_price_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.16 获取 SomniumSpace 地块成交总数量统计信息接口

export const req_somniumspace_sold_total_stats = async () => {
  const url = '/api/get_somniumspace_parcel_sold_total_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.17 获取 SomniumSpace 地块销售总额统计信息接口

export const req_somniumspace_sold_sum_stats = async () => {
  const url = '/api/get_somniumspace_parcel_sold_sum_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.18 获取 NFTWorlds 地块成交均价统计信息接口

export const req_ntfworlds_avg_price_stats = async () => {
  const url = '/api/get_nftworlds_parcel_avg_price_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.19 获取 NFTWorlds 地块成交总数量统计信息接口

export const req_ntfworlds_sold_total_stats = async () => {
  const url = '/api/get_nftworlds_parcel_sold_total_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.20 获取 NFTWorlds 地块销售总额统计信息接口

export const req_ntfworlds_sold_sum_stats = async () => {
  const url = '/api/get_nftworlds_parcel_sold_sum_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.21 获取 Webb 地块成交均价统计信息接口

export const req_webb_parcel_avg_price_stats = async () => {
  const url = '/api/get_webb_parcel_avg_price_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.22 获取 Webb 地块成交总数量统计信息接口

export const req_webb_sold_total_stats = async () => {
  const url = '/api/get_webb_parcel_sold_total_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};

// 6.23 获取 Webb 地块销售总额统计信息接口

export const req_webb_sold_sum_stats = async () => {
  const url = '/api/get_webb_parcel_sold_sum_stats';

  const result = await fetch(url, {
    method: 'get',
    mode: 'cors',
  });
  const json = await result.json();

  return json;
};
