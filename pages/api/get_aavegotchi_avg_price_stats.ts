// 6.30 获取 netvrk 地块成交均价统计信息接口
import api from '../../lib/z_api';

export default async (req, res) => {
  const data = await api.req_aavegotchi_avg_price();

  res.statusCode = 200;

  res.json(data);
};
