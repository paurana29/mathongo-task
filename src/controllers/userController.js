const User = require('../models/userModel');
const List = require('../models/listModel');
const csvParser = require('../utils/csvParser');
const { publishToQueue } = require('../services/queueService');

const addUsers = async (req, res) => {
    try {
        const { listId } = req.params;
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        const users = await csvParser.parseCSV(req.file.path);
        const fallbackValues = list.customProperties.reduce((acc, prop) => {
            acc[prop.title] = prop.fallbackValue;
            return acc;
        }, {});

        let successCount = 0;
        let errorCount = 0;
        let errors = [];

        for (const user of users) {
            try {
                const userProperties = {};
                for (const key in fallbackValues) {
                    userProperties[key] = user[key] || fallbackValues[key];
                }

                const newUser = new User({
                    name: user.name,
                    email: user.email,
                    listId,
                    properties: userProperties
                });
                
                await newUser.save();
                publishToQueue({ email: newUser.email, message: 'Hi from Mathongo!' });
                successCount++;
            } catch (error) {
                errors.push({ user, error: error.message });
                errorCount++;
            }
        }

        res.status(200).json({
            successCount,
            errorCount,
            totalUsers: await User.countDocuments({ listId }),
            errors
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendEmailToList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { subject, body } = req.body;

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        const users = await User.find({ listId });
        users.forEach(user => {
            const personalizedBody = body.replace(/\[(\w+)\]/g, (match, p1) => user[p1] || user.properties.get(p1) || match);
            publishToQueue({ email: user.email, subject, message: personalizedBody });
        });

        res.status(200).json({ message: 'Emails are being sent to the list' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {addUsers, sendEmailToList};
