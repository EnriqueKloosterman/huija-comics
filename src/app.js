const express = require('express');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.listen(port, () => {
    console.log('You once again have entered the world of survival horror. Good luck! By the way, app is running in port 3000')
})
