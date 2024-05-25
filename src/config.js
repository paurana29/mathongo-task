require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/mathongo',
    rabbitMQ: {
        url: process.env.RABBITMQ_URI || 'amqp://localhost',
        queueName: 'emailQueue'
    }
};
