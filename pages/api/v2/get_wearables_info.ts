import api from '../../../lib/testv2';

export default async (req, res) => {
  const data = await api.getWearablesInfo();

  res.statusCode = 200;

  res.json(data);
};
