// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from '../../lib/test';

export default async (req, res) => {
  const data = await api.getOtherSidePriceMap();

  res.statusCode = 200;

  res.json(data);
};
