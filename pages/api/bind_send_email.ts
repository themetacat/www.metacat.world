// 17.1 发送邮箱验证码
import api from '../../lib/z_api';

export default async (req, res) => {
  const { email } = req.query;
  const token = req.headers.authorization;
  const data = await api.req_bind_send_email(email, token);

  res.statusCode = 200;

  res.json(data);
};
