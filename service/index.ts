import * as qs from 'qs';

export const getCVEventList = async (cursor: number, count: number) => {
  const search = qs.stringify({ count, cursor }, { addQueryPrefix: true });
  const url = `/api/cv-event-list${search}`;

  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getCVParcelList = async (page: number, count: number, query: string, type: string) => {
  const search = qs.stringify({ page, count, query, type }, { addQueryPrefix: true });
  const url = `/api/cv-parcel-list${search}`;

  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getDCLEventList = async (cursor: number, count: number) => {
  const search = qs.stringify({ count, cursor }, { addQueryPrefix: true });
  const url = `/api/dcl-event-list${search}`;

  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getDCLParcelList = async (
  page: number,
  count: number,
  query: string,
  type: string,
) => {
  const search = qs.stringify({ page, count, query, type }, { addQueryPrefix: true });
  const url = `/api/dcl-parcel-list${search}`;

  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getCarouseList = async () => {
  const url = `/api/carousel`;

  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getTopicList = async () => {
  const url = `/api/topic-list`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getTopicDetail = async (id: number) => {
  const search = qs.stringify({ id }, { addQueryPrefix: true });
  const url = `/api/topic_detail${search}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvTrafficMapLevelThree = async () => {
  const url = `https://api.metacat.world/api/v1/get_cv_traffic_map_level_three`; // /api/cv_traffic_map_level_three;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvTrafficMapLevelOne = async () => {
  const url = `https://api.metacat.world/api/v1/get_cv_traffic_map_level_one`; // /api/cv_traffic_map_level_three;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvTrafficMapLevelTwo = async () => {
  const url = `https://api.metacat.world/api/v1/get_cv_traffic_map_level_two`; // /api/cv_traffic_map_level_three;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvPriceMapLevelThree = async () => {
  const url = `https://api.metacat.world/api/v1/get_cv_price_map_level_three`; // /api/cv_traffic_map_level_three;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvPriceMapLevelOne = async () => {
  const url = `https://api.metacat.world/api/v1/get_cv_price_map_level_one`; // /api/cv_traffic_map_level_three;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvPriceMapLevelTwo = async () => {
  const url = `https://api.metacat.world/api/v1/get_cv_price_map_level_two`; // /api/cv_traffic_map_level_three;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvParcelDetail = async (id: number, map_type?: string, time_range?: string) => {
  const search = qs.stringify({ id, map_type, time_range }, { addQueryPrefix: true });
  const url = `/api/cv_parcel_detail${search}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvIsland = async () => {
  const url = `/api/cv_islands`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvSuburbs = async () => {
  const url = `/api/cv_suburbs`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getBuilderList = async (page: number, count: number) => {
  const search = qs.stringify({ page, count }, { addQueryPrefix: true });

  const url = `/api/builder_list${search}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvParcelSoldTotalStats = async () => {
  const url = `/api/cv_parcel_sold_total_stats`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvTrafficStats = async () => {
  const url = `/api/cv_traffic_stats`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvParcelAvgPriceStats = async () => {
  const url = `/api/cv_parcel_avg_price_stats`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getWorldsStats = async () => {
  const url = `/api/worlds_stats`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvParcelSoldSumStats = async () => {
  const url = `/api/cv_parcel_sold_sum_stats`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvMintStats = async () => {
  const url = `/api/cv_mint_stats`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getCvParcelOwnerStats = async () => {
  const url = `/api/cv_parcel_owner_stats`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

export const getDclParcelAvgPriceStats = async () => {
  const url = `api/dcl_parcel_avg_price_stats`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getDclParcelSoldTotalStats = async () => {
  const url = `api/dcl_parcel_sold_total_stats`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getDclParcelSoldSumStats = async () => {
  const url = `api/dcl_parcel_sold_sum_stats`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getDclParcelOwnerStats = async () => {
  const url = `api/dcl_parcel_owner_stats`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};
