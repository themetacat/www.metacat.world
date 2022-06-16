import api from '../../lib/z_api';

export default async (req, res) => {
  const { tokenId } = req.query;
  const data = await api.req_substrata_detail(tokenId);

  res.statusCode = 200;

  res.json(data);
};
