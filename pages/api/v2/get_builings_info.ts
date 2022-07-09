// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from '../../../lib/testv2';

export default async (req, res) => {
  const data = await api.getBuildingsInfo();

  res.statusCode = 200;

  res.json(data);
};
