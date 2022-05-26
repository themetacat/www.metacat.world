// 17.2 验证邮箱验证码以及绑定邮箱
import api from '../../lib/z_api';

export default async (req, res) => {
  const { code } = req.query;
  const data = await api.req_ver_email_code(code);

  res.statusCode = 200;

  res.json(data);
};
