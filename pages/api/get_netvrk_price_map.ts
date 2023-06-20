import api from '../../lib/api';

export default async (req, res) => {
//   const { landId, mapType } = req.query;
  const data = await api.getNetVrkMap;

  res.statusCode = 200;

  res.json(data);
};
