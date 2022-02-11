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

export const getCvParcelDetail = async (id: number) => {
  const search = qs.stringify({ id }, { addQueryPrefix: true });
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
