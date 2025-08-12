const express = require('express');
const route = express.Router();
const { signup, login } = require('../controllers/authLogic');

route.post('/signup', signup);
route.post('/login', login);

module.exports = route;
