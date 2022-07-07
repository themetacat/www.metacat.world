import * as qs from 'qs';

class API {
  private url: string;

  private key?: string;

  constructor(url: string, key?: string) {
    this.url = url;
    this.key = key;
  }

  public async getTraffic(): Promise<any> {
    const url = `${this.url}/home_page/get_traffic`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }
}

export default new API('http://8.130.23.16/api/v1');
