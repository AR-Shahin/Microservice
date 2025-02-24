const express = require('express');
const Order = require('./db');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
app.use(express.json());

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('orderQueue');

    channel.consume('orderQueue', async (msg) => {
      const user = JSON.parse(msg.content.toString());
      console.log('Received user:', user);

      await Order.create({ userId: user.id, name: user.name, email: user.email });

      channel.ack(msg);
    });
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
  }
}

connectRabbitMQ();

app.get("/",(req,res) => {
    res.json({
        message: "Welcome to the Order Service 2"
    })
})
app.listen(4001, () => console.log('Order Service running on port 4001'));
