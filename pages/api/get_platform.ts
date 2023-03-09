import api from '../../lib/z_api';

export default async (req, res) => {
  const data = await api.req_platform();

  res.statusCode = 200;

  res.json(data);
};
