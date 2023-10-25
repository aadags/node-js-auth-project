
const express = require('express');
const router = express.Router();
const requireRole = require('../Middleware/Permission')
const UserController = require('../Controller/UserController');


router.get("/list", requireRole('get_users'), UserController.listUsers);

module.exports = router;