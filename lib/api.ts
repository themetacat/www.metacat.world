// https://www.metacat.world/api/v1/get_cv_parcel_list?page=2&count=50&query=&type=gallery
import * as qs from 'qs';

class API {
  private url: string;

  private key?: string;

  constructor(url: string, key?: string) {

    
    this.url = url;
    // this.url = 'http://8.130.23.16/api/v1';
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
  
  public async getMonaParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_mona_space_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getOncyberParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_oncyber_space_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getProtoParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_protoworld_zone_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getRareParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_rarerooms_room_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getHyperfyParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_hyperfy_parcel_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getMozillaParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_mozilla_hubs_scene_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getArtifexParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_artifex_world_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getPlayerOneList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_playerone_space_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getNiftyIslandList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_niftyisland_island_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSubstrataList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_substrata_parcel_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getAriumParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_arium_space_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }
  
  public async getSpatialParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_spatial_space_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSandBoxParcelList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count , query, type}, { addQueryPrefix: true });
    const url = `${this.url}/get_sandbox_parcel_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSomSpaceList(
    page: number,
    count: number,
    query: string,
    type: string,
  ): Promise<any> {
    const search = qs.stringify({ page, count, query, type }, { addQueryPrefix: true });
    const url = `${this.url}/get_somniumspace_parcel_list${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSearchDetail(
    query,
    page:number,
    per_page:number,
    search_item:string,
  ): Promise<any> {
    const search = qs.stringify({query,page,per_page,search_item,}, { addQueryPrefix: true });
    const url = `${this.url}/the_search${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }


  public async getEventList(
    cursor:number ,
    count:number,
  ): Promise<any> {
    const search = qs.stringify({cursor,count}, { addQueryPrefix: true });
    const url = `${this.url}/get_cv_event_list${search}`;
    // const url = `https://api.metacat.world/api/v1/get_cv_event_list${search}`
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDclEventList(
    cursor:number ,
    count:number,
  ): Promise<any> {
    const search = qs.stringify({cursor,count}, { addQueryPrefix: true });
    const url = `${this.url}/get_dcl_event_list${search}`;
    // const url = `https://api.metacat.world/api/v1/get_cv_event_list${search}`
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSomEventList(
    cursor:number ,
    count:number,
  ): Promise<any> {
    const search = qs.stringify({cursor,count}, { addQueryPrefix: true });
    const url = `${this.url}/get_somniumspace_event_list${search}`;
    // const url = `https://api.metacat.world/api/v1/get_cv_event_list${search}`
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
    // const url = `http://8.130.23.16/api/v1/get_dcl_parcel_list${search}`;
    

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
    // console.log(url,55555);
   
    return json;
  }

  public async getNewBuildingDetail(id: number): Promise<any> {
    const search = qs.stringify({ id }, { addQueryPrefix: true });
    const url = `${this.url}/get_new_topic_detail${search}`;
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

  public async getCvParcelSoldTotalStats(): Promise<any> {
    const url = `${this.url}/get_cv_parcel_sold_total_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvTrafficStats(): Promise<any> {
    const url = `${this.url}/get_cv_traffic_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDecentralandStats(): Promise<any> {
    const url = `${this.url}/get_dcl_traffic_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvParcelAvgPriceStats(): Promise<any> {
    const url = `${this.url}/get_cv_parcel_avg_price_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getWorldsStats(): Promise<any> {
    const url = `${this.url}/get_worlds_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getWorldsStatsSale(): Promise<any> {
    // const url = `${this.url}/analytics/cur_data_compared_last_sum`;
    const url = `${this.url}/analytics/cur_data_compared_last_sum`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getWorldsAverageSale(): Promise<any> {
    // const url = `${this.url}/analytics/cur_data_compared_last_sum`;
    const url = `${this.url}/analytics/cur_data_compared_last_avg`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getWorldsNum(): Promise<any> {
    // const url = `${this.url}/analytics/cur_data_compared_last_sum`;
    const url = `${this.url}/analytics/cur_data_compared_last_sales`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvParcelSoldSumStats(): Promise<any> {
    const url = `${this.url}/get_cv_parcel_sold_sum_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvMintStats(): Promise<any> {
    const url = `${this.url}/get_cv_mint_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getCvParcelOwnerStats(): Promise<any> {
    const url = `${this.url}/get_cv_parcel_owner_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSandboxOwnerStats(world: string): Promise<any> {
    const search = qs.stringify({ world }, { addQueryPrefix: true });
    const url = `${this.url}/get_worlds_owner_num${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getChartNftworlds(world: string): Promise<any> {
    const search = qs.stringify({ world }, { addQueryPrefix: true });
    const url = `${this.url}/get_worlds_owner_num${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getchartOtherside(world: string): Promise<any> {
    const search = qs.stringify({ world }, { addQueryPrefix: true });
    const url = `${this.url}/get_worlds_owner_num${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getchartWebb(world: string): Promise<any> {
    const search = qs.stringify({ world }, { addQueryPrefix: true });
    const url = `${this.url}/get_worlds_owner_num${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getchartSomniumSpace(world: string): Promise<any> {
    const search = qs.stringify({ world }, { addQueryPrefix: true });
    const url = `${this.url}/get_worlds_owner_num${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getVoxelsOwnerStats(): Promise<any> {
    const url = `${this.url}/get_cv_parcel_owner_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDclParcelAvgPriceStats(): Promise<any> {
    const url = `${this.url}/get_dcl_parcel_avg_price_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDclParcelSoldTotalStats(): Promise<any> {
    const url = `${this.url}/get_dcl_parcel_sold_total_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDclParcelSoldSumStats(): Promise<any> {
    const url = `${this.url}/get_dcl_parcel_sold_sum_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDclParcelOwnerStats(): Promise<any> {
    const url = `${this.url}/get_dcl_parcel_owner_stats`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getNonce(address: string): Promise<any> {
    const search = qs.stringify({ address }, { addQueryPrefix: true });
    const url = `${this.url}/user/get_nonce${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async loginSignature(address: string, signature: string): Promise<any> {
    const search = qs.stringify({ address, signature }, { addQueryPrefix: false });
    const url = `${this.url}/user/login_signature`;
    const res = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: search,
    });
    const json = await res.json();

    return json;
  }

  public async refreshToken(refreshToken: string): Promise<any> {
    const search = qs.stringify({ refresh_token: refreshToken }, { addQueryPrefix: true });
    const url = `${this.url}/user/refresh_token${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getBaseInfo(token: string): Promise<any> {
    const url = `${this.url}/user/get_base_info`;
    // const url = `http://8.130.23.16/api/v1/user/get_base_info`;
    const res = await fetch(url, {
      method: 'get',
      headers: {
        Authorization: token,
      },
    });
    const json = await res.json();

    return json;
  }


  public async updateBaseInfo(
    token: string,
    nickName: string,
    twitterName: string,
    websiteUrl: string,
    avatar: string,
    introduction: string,
    country: string,
  ): Promise<any> {
    const url = `${this.url}/user/update_base_info`;
    const search = qs.stringify(
      {
        nick_name: nickName,
        twitter_name: twitterName,
        website_url: websiteUrl,
        avatar,
        introduction,
        country,
      },
      { addQueryPrefix: false },
    );
    const res = await fetch(url, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
      },
      body: search,
    });
    const json = await res.json();

    return json;
  }

  public async getParcelList(token: string): Promise<any> {
    const url = `${this.url}/user/get_parcel_list`;

    const res = await fetch(url, {
      method: 'get',
      headers: {
        Authorization: token,
      },
    });
    const json = await res.json();

    return json;
  }

  // 获取当前登陆者Cryptovoxels地块列表接口

  public async getParcelList2(token: string): Promise<any> {
    const url = `${this.url}/rent/get_owned_cv_parcel_list`;

    const res = await fetch(url, {
      method: 'get',
      headers: {
        Authorization: token,
      },
    });
    const json = await res.json();

    return json;
  }

  public async nickNameExit(nickName: string): Promise<any> {
    const search = qs.stringify({ nick_name: nickName }, { addQueryPrefix: true });
    const url = `${this.url}/user/is_nick_name_exist${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDecentralandMapLevelThreeData(): Promise<any> {
    const url = `${this.url}/get_dcl_price_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDclParcelDetail(landId: string, mapType = 'price'): Promise<any> {
    const search = qs.stringify({ land_id: landId, map_type: mapType }, { addQueryPrefix: true });
    const url = `${this.url}/get_dcl_parcel_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getOkxWearableList(): Promise<any> {
    const url = `${this.url}/wearable/get_okx_wearable_list`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getOkxWearableDetail(id: string): Promise<any> {
    const search = qs.stringify({ id }, { addQueryPrefix: true });
    const url = `${this.url}/wearable/get_okx_wearable_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDaoWearableList(): Promise<any> {
    const url = `${this.url}/wearable/get_dao_wearable_list`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getDaoWearableDetail(id: string): Promise<any> {
    const search = qs.stringify({ id }, { addQueryPrefix: true });
    const url = `${this.url}/wearable/get_dao_wearable_detail${search}`;
    // const url1 = `http://8.130.23.16/api/v1/wearable/get_dao_wearable_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSandboxMapLevelThreeData(): Promise<any> {
    const url = `${this.url}/get_sandbox_price_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSandboxParcelDetail(tokenId: string): Promise<any> {
    const search = qs.stringify({ token_id: tokenId }, { addQueryPrefix: true });
    const url = `${this.url}/get_sandbox_parcel_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSomniumSpacePriceMapLevelThreeData(): Promise<any> {
    const url = `${this.url}/get_somniumspace_price_map_level_three`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  public async getSomniumSpaceParcelDeatil(tokenId: string): Promise<any> {
    const search = qs.stringify({ token_id: tokenId }, { addQueryPrefix: true });
    const url = `${this.url}/get_somniumspace_parcel_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  // 获取otherside价格热力图数据
  public async getOtherSidePriceMap() {
    const url = `${this.url}/get_otherside_price_map`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  public async getOtherSideParcelDetail(tokenId: string): Promise<any> {
    const search = qs.stringify({ token_id: tokenId }, { addQueryPrefix: true });
    const url = `${this.url}/get_otherside_parcel_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }

  // 获取otherside价格热力图数据
  public async getDclTrafficMap() {
    const url = `${this.url}/get_dcl_traffic_map`;

    const result = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
    const json = await result.json();

    return json;
  }

  public async getHeatMapInfo(): Promise<any> {
    const url = `${this.url}/home_page//get_heatmap_info`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  public async getTraffic(): Promise<any> {
    const url = `${this.url}/home_page/get_traffic`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  public async getBuildingsInfo(): Promise<any> {
    const url = `${this.url}/home_page/get_builings_info`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  public async getWearablesInfo(): Promise<any> {
    const url = `${this.url}/home_page/get_wearables_info`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  public async getFloorPrice(): Promise<any> {
    const url = `${this.url}/home_page/get_floor_price`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  public async getTzLandPriceMap(): Promise<any> {
    const url = `${this.url}/get_tz1and_price_map`;
    const result = await fetch(url);
    const json = await result.json();

    return json;
  }

  public async getTzLandParcelDetail(tokenId: string): Promise<any> {
    const search = qs.stringify({ token_id: tokenId }, { addQueryPrefix: true });
    const url = `${this.url}/get_tz1and_parcel_detail${search}`;
    const res = await fetch(url);
    const json = await res.json();

    return json;
  }
}

// export default new API('https://api.metacat.world/api/v1');
export default new API('http://47.243.184.241/api/v1');
// http://8.130.23.16/
// https://api.metacat.world
