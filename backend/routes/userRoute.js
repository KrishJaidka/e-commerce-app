const express = require('express');
const route = express.Router();
const { getUser } = require('../controllers/userLogic');

route.get('/:id', getUser);

module.exports = route;