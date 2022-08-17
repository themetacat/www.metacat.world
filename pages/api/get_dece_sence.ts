// import api from '../../lib/z_api';
import api from '../../lib/test';

export default async (req, res) => {
  const { page, count } = req.query;
  const data = await api.req_scence_list(page, count);

  res.statusCode = 200;

  res.json(data);
};