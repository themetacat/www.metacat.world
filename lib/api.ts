// https://www.metacat.world/api/v1/get_cv_parcel_list?page=2&count=50&query=&type=gallery
import * as qs from 'qs';

class API {
  private url: string;

  private key?: string;

  constructor(url: string, key?: string) {
    this.url = url;
    this.key = key;
  }

  public async getCVParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count, query, type }, { addQueryPrefix: true });
    const url = `${this.url}/get_cv_parcel_list${search}`;

    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCVEventList(cursor: number, count: number): Promise<any> {
    const search = qs.stringify({ count, cursor }, { addQueryPrefix: true });
    const url = `${this.url}/get_cv_event_list${search}`;

    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDCLEventList(cursor: number, count: number): Promise<any> {
    const search = qs.stringify({ count, cursor }, { addQueryPrefix: true });
    const url = `${this.url}/get_dcl_event_list${search}`;

    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDCLParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count, query, type }, { addQueryPrefix: true });
    const url = `${this.url}/get_dcl_parcel_list${search}`;

    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCarouseList(): Promise<any> {
    const url = `${this.url}/get_carousel_list`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getTopicList(): Promise<any> {
    const url = `${this.url}/get_topic_list`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getTopicDetail(id: number): Promise<any> {
    const search = qs.stringify({ id }, { addQueryPrefix: true });
    const url = `${this.url}/get_topic_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvTrafficMapLevelThree(): Promise<any> {
    const url = `${this.url}/get_cv_traffic_map_level_three`; // `${this.url}/get_cv_traffic_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvTrafficMapLevelOne(): Promise<any> {
    const url = `${this.url}/get_cv_traffic_map_level_one`; // `${this.url}/get_cv_traffic_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvTrafficMapLevelTwo(): Promise<any> {
    const url = `${this.url}/get_cv_traffic_map_level_two`; // `${this.url}/get_cv_traffic_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvPriceMapLevelThree(): Promise<any> {
    const url = `${this.url}/get_cv_price_map_level_three`; // `${this.url}/get_cv_traffic_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvPriceMapLevelOne(): Promise<any> {
    const url = `${this.url}/get_cv_price_map_level_one`; // `${this.url}/get_cv_traffic_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvPriceMapLevelTwo(): Promise<any> {
    const url = `${this.url}/get_cv_price_map_level_two`; // `${this.url}/get_cv_traffic_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvParcelDetail(id: number, map_type?: string, time_range?: string): Promise<any> {
    const search = qs.stringify({ id, map_type, time_range }, { addQueryPrefix: true });
    const url = `${this.url}/get_cv_parcel_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvSuburbs(): Promise<any> {
    const url = `${this.url}/get_cv_suburbs`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvIsland(): Promise<any> {
    const url = `${this.url}/get_cv_islands`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getBuilderList(page: number, count: number): Promise<any> {
    const search = qs.stringify({ page, count }, { addQueryPrefix: true });
    const url = `${this.url}/get_builder_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }
}

export default new API('https://api.metacat.world/api/v1');
