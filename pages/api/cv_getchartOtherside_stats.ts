import api from '../../lib/api';

export default async (req, res) => {
const { world} = req.query;
const data = await api.getchartOtherside(world);
  res.statusCode = 200;
  res.json(data); 
};
