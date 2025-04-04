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
    
// Importacion de rutas
const authRoutes = require('./routes/auth.routes');
const authorRoutes = require('./routes/author.routes');
const publisherRoutes = require('./routes/publisher.routes');
const categoriesRoutes = require('./routes/categories.routes');
const collectionRoutes = require('./routes/collection.routes');
const comicRoutes = require('./routes/comic.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) =>{
    logeer.info(`Request received: ${req.method} ${req.url}`)
    next()
})
// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/publisher', publisherRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/comic', comicRoutes);


app.listen(port, () => {
    console.log(`You once again have entered the world of survival horror. Good luck! By the way, app is running in port ${port}` )
})
