import api from '../../lib/api';

export default async (req, res) => {
    const { join_type } = req.query;
    const data = await api.getCreatorStats(join_type);
    res.statusCode = 200;
    res.json(data);
};
