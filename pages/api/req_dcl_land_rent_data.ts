// 16.3 获取六个平台每 月/季度/年 各个总量

import api from '../../lib/z_api';

export default async (req, res) => {
  const { type } = req.query;
  const data = await api.req_dcl_land_rent_data(type);
  res.statusCode = 200;

  res.json(data);
};
