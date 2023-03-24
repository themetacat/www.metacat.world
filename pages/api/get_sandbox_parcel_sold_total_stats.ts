// 6.13 获取 Sandbox 地块成交总数量统计信息接口

import api from '../../lib/z_api';

export default async (req, res) => {
  const data = await api.req_sandbox_sold_total_stats();

  res.statusCode = 200;

  res.json(data);
};
