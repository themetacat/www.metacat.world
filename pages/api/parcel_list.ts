// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from '../../lib/api';

export default async (req, res) => {
  const token = req.headers.Authorization;
  const data = await api.getParcelList(token);

  res.statusCode = 200;

  res.json(data);
};
