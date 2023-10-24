
const express = require('express');
const router = express.Router();
const RoleController = require('../Controller/RoleController');


router.get("/list", RoleController.listRoles);

module.exports = router;