// 14.2 获取当前登录者 Cryptovoxels 地块每日/每周/每月流量占比接口
import api from '../../lib/z_api';
// import api from '../../lib/test';

export default async (req, res) => {
  const token = req.headers.authorization;
  const data = await api.req_deceData_parcel_traffic_daily(token);

  res.statusCode = 200;

  res.json(data);
};
