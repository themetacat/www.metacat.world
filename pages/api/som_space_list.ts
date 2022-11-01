// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from '../../lib/api';

export default async (req, res) => {
  const { page, count, query, totalPage } = req.query;
  const data = await api.getSomSpaceList(page, count, query, totalPage);

  res.statusCode = 200;

  res.json(data);
};
