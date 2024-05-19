const amqp = require('amqplib');
const { rabbitMQ } = require('../config');
const { sendEmail } = require('./emailService');

let channel;

async function connectQueue() {
    const connection = await amqp.connect(rabbitMQ.url);
    channel = await connection.createChannel();
    await channel.assertQueue(rabbitMQ.queueName, { durable: true });
}

connectQueue();

exports.publishToQueue = async (message) => {
    if (!channel) {
        await connectQueue();
    }
    channel.sendToQueue(rabbitMQ.queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
};

exports.consumeQueue = async () => {
    if (!channel) {
        await connectQueue();
    }
    channel.consume(rabbitMQ.queueName, (msg) => {
        const message = JSON.parse(msg.content.toString());
        sendEmail(message.email, message.message);
        channel.ack(msg);
    });
};

