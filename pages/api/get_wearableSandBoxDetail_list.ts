import api from '../../lib/z_api';

export default async (req, res) => {
 
  const {  avatar_id,} = req.query;
  const data = await api.req_detailWearableSandBox_list( avatar_id,);
  res.statusCode = 200;

  res.json(data);
};
