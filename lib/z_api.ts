import * as qs from 'qs';

class API {
  private url: string;

  private key?: string;

  constructor(url: string, key?: string) {
    this.url = url;
    this.key = key;
  }

  // 设置单个或批量出租

  public async req_parcels_rent_out(
    token: string,
    parcel_ids: string,
    is_built: string,
    price: string,
    start_at: number,
    end_at: number,
  ): Promise<any> {
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
    const url = `${this.url}/rent/batch_list_cv_parcels`;
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
  }

  // 设置批量或单个取消出租

  public async req_parcels_cancel(token: string, parcel_ids: string): Promise<any> {
    const search = qs.stringify({ parcel_ids }, { addQueryPrefix: false });
    const url = `${this.url}/rent/batch_cancel_listed_cv_parcels`;
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
  }

  // 设置单个或批量已出租

  public async req_parcels_leased(token: string, parcel_ids: string): Promise<any> {
    const search = qs.stringify({ parcel_ids }, { addQueryPrefix: false });
    const url = `${this.url}/rent/batch_lease_listed_cv_parcels`;
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
  }

  // 单个更新CV地块租赁

  public async req_parcels_update(
    token: string,
    parcel_id: number,
    is_built?: string,
    price?: string,
    start_at?: number,
    end_at?: number,
  ): Promise<any> {
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
    const url = `${this.url}/rent/update_cv_parcel`;
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
  }

  // 取消挂出
  public async req_parcels_finish(token: string, id: number): Promise<any> {
    const search = qs.stringify({ parcel_id: id }, { addQueryPrefix: false });
    const url = `${this.url}/rent/cv_parcel_fallback_to_listed_status`;
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
  }

  // 获取Cryptovoxels岛屿列表接口
  public async req_rent_islands(): Promise<any> {
    const url = `${this.url}/rent/get_cv_island_list`;
    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 8.8 获取租赁市场 Cryptovoxels 地块列表接口
  public async req_rent_cardList(
    page: number,
    count: number,
    island_ids: string,
    area_scope: string,
    height_scope: string,
    price_scope: string,
    built_status: string,
    sort_field: string,
    sort_type: string,
  ): Promise<any> {
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
    const url = `${this.url}/rent/get_listed_cv_parcels${search}`;
    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 12.1 获取当前登录者 Decentraland 地块列表接口

  public async req_dcl_parcel_list(token: string): Promise<any> {
    const url = `${this.url}/rent/get_owned_dcl_parcel_list`;
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
  }

  // 12.2 批量（单个）挂出 Decentraland 待租地块接口

  public async req_dcl_batch_parcels(
    token: string,
    parcel_ids: string,
    is_built: string,
    price: number,
    start_at: number,
    end_at: number,
  ): Promise<any> {
    const url = `${this.url}/rent/batch_list_dcl_parcels`;
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
  }

  // 12.3 批量（单个）取消已挂出 Decentraland 地块接口

  public async req_dcl_cancel(token: string, parcel_ids: string): Promise<any> {
    const url = `${this.url}/rent/batch_cancel_listed_dcl_parcels`;
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
  }

  // 12.4 批量（单个）更新已挂出 Decentraland 地块为租赁中接口

  public async req_dcl_leased(token: string, parcel_ids: string): Promise<any> {
    const url = `${this.url}/rent/batch_lease_listed_dcl_parcels`;
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
  }

  // 12.5 单个更新 Decentraland 地块租赁信息接口

  public async req_dcl_update(
    token: string,
    parcel_id: string,
    is_built: string,
    price: number,
    start_at: number,
    end_at: number,
  ): Promise<any> {
    const url = `${this.url}/rent/update_dcl_parcel`;
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
  }

  // 12.6 单个更新租赁中 Decentraland 地块为已挂出状态接口

  public async req_dcl_listed(token: string, parcel_id: string): Promise<any> {
    const url = `${this.url}/rent/dcl_parcel_fallback_to_listed_status`;
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
  }

  // 12.7 获取租赁市场 Decentraland 地块列表接口

  public async req_dcl_List(
    page: number,
    count: number,
    size_scope: string,
    price_scope: string,
    built_status: string,
    sort_field: string,
    sort_type: string,
  ): Promise<any> {
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
    const url = `${this.url}/rent/get_listed_dcl_parcels${search}`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.12 获取 Sandbox 地块成交均价统计信息接口

  public async req_sandbox_avg_price_stats(): Promise<any> {
    const url = `${this.url}/get_sandbox_parcel_avg_price_stats`;
    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.13 获取 Sandbox 地块成交总数量统计信息接口

  public async req_sandbox_sold_total_stats(): Promise<any> {
    const url = `${this.url}/get_sandbox_parcel_sold_total_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.14 获取 Sandbox 地块销售总额统计信息接口

  public async req_sandbox_sold_sun_stats(): Promise<any> {
    const url = `${this.url}/get_sandbox_parcel_sold_sum_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.15 获取 SomniumSpace 地块成交均价统计信息接口

  public async req_somniumspace__avg_price_stats(): Promise<any> {
    const url = `${this.url}/get_somniumspace_parcel_avg_price_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.16 获取 SomniumSpace 地块成交总数量统计信息接口

  public async req_somniumspace_sold_total_stats(): Promise<any> {
    const url = `${this.url}/get_somniumspace_parcel_sold_total_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.17 获取 SomniumSpace 地块销售总额统计信息接口

  public async req_somniumspace_sold_sum_stats(): Promise<any> {
    const url = `${this.url}/get_somniumspace_parcel_sold_sum_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.18 获取 NFTWorlds 地块成交均价统计信息接口

  public async req_ntfworlds_avg_price_stats(): Promise<any> {
    const url = `${this.url}/get_nftworlds_parcel_avg_price_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.19 获取 NFTWorlds 地块成交总数量统计信息接口

  public async req_ntfworlds_sold_total_stats(): Promise<any> {
    const url = `${this.url}/get_nftworlds_parcel_sold_total_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.20 获取 NFTWorlds 地块销售总额统计信息接口

  public async req_ntfworlds_sold_sum_stats(): Promise<any> {
    const url = `${this.url}/get_nftworlds_parcel_sold_sum_stats`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.21 获取 Webb 地块成交均价统计信息接口

  public async req_webb_parcel_avg_price_stats(): Promise<any> {
    const url = `${this.url}/get_webb_parcel_avg_price_stats`;
    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.22 获取 Webb 地块成交总数量统计信息接口

  public async req_webb_sold_total_stats(): Promise<any> {
    const url = `${this.url}/get_webb_parcel_sold_total_stats`;
    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  // 6.23 获取 Webb 地块销售总额统计信息接口

  public async req_webb_sold_sum_stats(): Promise<any> {
    const url = `${this.url}/get_webb_parcel_sold_sum_stats`;
    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }
}

export default new API('https://api.metacat.world/api/v1');
