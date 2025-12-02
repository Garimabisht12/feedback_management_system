const express = require('express');
const app = express();

const uploadRoutes = require('./routes/uploadRoutes');

app.use('/admin', uploadRoutes);