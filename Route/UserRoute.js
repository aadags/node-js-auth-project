
const express = require('express');
const router = express.Router();
const UserController = require('../Controller/UserController');


router.get("/list", UserController.listUsers);

module.exports = router;