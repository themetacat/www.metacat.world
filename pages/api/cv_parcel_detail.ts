import api from '../../lib/api';

export default async (req, res) => {
  const { id } = req.query;
  const data = await api.getCvParcelDetail(id);

  res.statusCode = 200;

  res.json(data);
};
