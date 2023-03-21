import api from '../../lib/z_api';

export default async (req, res) => {
 
  const { page, count} = req.query;
  const data = await api.req_wearableDcl_list(page, count);
  res.statusCode = 200;

  res.json(data);
};
