//
import api from '../../lib/z_api';

export default async (req, res) => {
  const data = await api.req_cv_top20_parcel();

  res.statusCode = 200;

  res.json(data);
};
