const db = require("./db");
require('./models/index')

const {
    requestRoutes,
} = require('./routes')

db.sync()

const express = require('express');

const app = express();
const cors = require('cors')
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    return res.send('Server running')
})

app.use('/request', requestRoutes);

module.exports = app;