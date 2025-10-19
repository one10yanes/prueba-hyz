const express = require('express');
const { PORT } = require('./config.js');
const proyectoRoutes = require('./src/routes/proyectoRoutes.js');
const sequelize = require('./db'); 
const setupSwagger = require('./swagger');
const cors = require('cors');



const app = express();
app.use(cors());
setupSwagger(app);
app.use(express.json());
app.use(proyectoRoutes);

// Sincroniza la base de datos y luego inicia el servidor
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log('Servidor corriendo en el puerto', PORT);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar la base de datos:', err);
    });
