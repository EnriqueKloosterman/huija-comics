const express = require('express');
const router = express.Router();
const upload = require('../middlewares/image.upload');
const authController = require("../controllers/auth.controller");

router.post('/register', upload.single('user_image'), authController.register);



module.exports = router;