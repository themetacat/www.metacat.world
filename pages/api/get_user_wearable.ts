import api from '../../lib/z_api';

export default async (req, res) => {
  const token = req.headers.authorization;

  const data = await api.req_get_user_wearable(token);

  res.statusCode = 200;

  res.json(data);
};
