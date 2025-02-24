const express = require('express');
const db = require('./db');
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
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
  }
}

connectRabbitMQ();

app.post('/create-user', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);

    const user = { id: result.insertId, name, email };
    
    channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify(user)));

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/",(req,res) => {
    res.json({
        message: "Welcome to the User Service 1"
    })
})
app.listen(4000, () => console.log('User Service running on port 4000'));
