// 6.29 获取 otherside 地块销售总额统计信息接口
import api from '../../lib/z_api';

export default async (req, res) => {
  const data = await api.req_otherside_sales_amount();

  res.statusCode = 200;

  res.json(data);
};
