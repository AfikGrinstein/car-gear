const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

let logs = [];

app.get('/health-check', (req, res) => {
    res.send('Server is running...');
});

app.get('/logs', (req, res) => {
    res.send({logs});
});

app.post('/logs', (req, res) => {
    const log = req.body.log;
    logs.push(log);
    res.send();
});

app.delete('/logs', (req, res) => {
    logs = [];
    res.send();
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
