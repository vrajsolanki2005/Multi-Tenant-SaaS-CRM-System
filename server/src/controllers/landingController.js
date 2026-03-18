const pool = require('../config/db');

const getSection = async (req, res) => {
    const { section } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT data FROM landing_content WHERE section = ? AND is_active = TRUE ORDER BY sort_order ASC',
            [section]
        );
        res.json({ data: rows.map(r => r.data) });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch landing content' });
    }
};

module.exports = { getSection };
