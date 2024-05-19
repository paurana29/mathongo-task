const List = require('../models/listModel');

const createList = async (req, res) => {
    try {
        const { title, customProperties } = req.body;
        const list = new List({ title, customProperties });
        await list.save();
        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {createList};
