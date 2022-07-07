export const getTraffic = async () => {
  const url = `/api/v2/get_traffic`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};
