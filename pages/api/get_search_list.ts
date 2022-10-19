// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from '../../lib/api';

export default async (req, res) => {
  const {query,page,per_page,search_item,} = req.query;
  const data = await api.getSearchDetail(query,page,per_page,search_item,);
  

  res.statusCode = 200;

  res.json(data);
};
