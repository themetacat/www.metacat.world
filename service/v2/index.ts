export const getTraffic = async () => {
  const url = `/api/v2/get_traffic`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getBuildingsInfo = async () => {
  const url = `/api/v2/get_builings_info`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getHeatMapInfo = async () => {
  const url = `/api/v2/get_heatmap_info`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getWearablesInfo = async () => {
  const url = `/api/v2/get_wearables_info`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getFloorPrice = async () => {
  const url = `/api/v2/get_floor_price`;
  // const url = `https://api.metacat.world/api/v1/home_page/get_floor_price`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};
