
const express = require('express');
const router = express.Router();
const AuthController = require('../Controller/AuthController');


router.post("/login", AuthController.login);

module.exports = router;