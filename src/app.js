const express = require('express');
const mongoose = require('mongoose');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');
const { consumeQueue } = require('./services/queueService');
const { mongoURI } = require('./config');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(mongoURI);

app.use(express.json());
app.use('/api', listRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    consumeQueue();
});

