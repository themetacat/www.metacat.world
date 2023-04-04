import api from '../../lib/z_api';

export default async (req, res) => {
  const { type } = req.query;
  const data = await api.req_all_time_data(type);

  res.statusCode = 200;

  res.json(data);
};
