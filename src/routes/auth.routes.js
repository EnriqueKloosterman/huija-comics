const express = require('express');
const router = express.Router();
const upload = require('../middlewares/image.upload');
const authController = require("../controllers/auth.controller");
const validationsResult = require('../middlewares/validations.auth');

router.post('/register', upload.single('user_image'), validationsResult.registerValidation, authController.register);
router.post('/login', authController.login);
router.post('/update/:user_id', upload.single('user_image'), authController.updateUser);



module.exports = router;