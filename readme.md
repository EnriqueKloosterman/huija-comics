# Huija Comics API

## Descripción
Huija Comics es una API RESTful desarrollada con Express.js que permite gestionar una biblioteca digital de cómics. La aplicación proporciona funcionalidades para administrar cómics, colecciones, autores y categorías, con soporte para la carga de imágenes y autenticación de usuarios.

## Características Principales
- Gestión completa de cómics (CRUD)
- Sistema de colecciones para organizar cómics
- Manejo de autores y categorías
- Autenticación de usuarios
- Carga y gestión de imágenes
- Sistema de logging para monitoreo

## Requisitos Técnicos
- Node.js
- MySQL
- NPM o Yarn

## Dependencias Principales
- Express.js - Framework web
- Sequelize - ORM para MySQL
- Multer - Manejo de archivos
- JWT - Autenticación
- Winston - Logging
- Cloudinary - Almacenamiento de imágenes

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/EnriqueKloosterman/huija-comics.git
cd huija-comics
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_datos
JWT_SECRET=tu_secreto_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura de la API

### Endpoints de Autenticación
- POST `/auth/register` - Registro de usuario
- POST `/auth/login` - Inicio de sesión
- POST `/auth/update/:user_id` - Actualización de usuario

### Endpoints de Cómics
- POST `/comic/create` - Crear nuevo cómic
- GET `/comic/comics` - Obtener todos los cómics
- GET `/comic/comic/:comic_id` - Obtener cómic por ID
- DELETE `/comic/delete/:comic_id` - Eliminar cómic

### Endpoints de Colecciones
- POST `/collections/create` - Crear nueva colección
- GET `/collections` - Obtener todas las colecciones
- GET `/collections/:collection_id` - Obtener colección por ID
- PUT `/collections/update/:collection_id` - Actualizar colección
- DELETE `/collections/delete/:collection_id` - Eliminar colección

## Pruebas
Ejecutar las pruebas unitarias:
```bash
npm test
```

## Logging
La aplicación utiliza Winston para el registro de eventos. Los logs se almacenan en el directorio `/logs`:
- `error.json` - Registro de errores



## Licencia
ISC
