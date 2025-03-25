const express = require('express');
const logeer = require('./utils/logger')
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors');
const { sequelize } = require('./database/models');

// Verifica la conexión a la base de datos y sincriniza los modelos
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
    

const authRoutes = require('./routes/auth.routes')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) =>{
    logeer.info(`Request received: ${req.method} ${req.url}`)
    next()
})

app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log('You once again have entered the world of survival horror. Good luck! By the way, app is running in port 3000')
})
