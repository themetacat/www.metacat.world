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
    parcel_ids: string,
    is_built?: string,
    price?: string,
    start_at?: number,
    end_at?: number,
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
}

export default new API('https://api.metacat.world/api/v1');
