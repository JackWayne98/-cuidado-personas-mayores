const { register } = require('../../controllers/usuarios.controller');

const router = require('express').Router();

// Define your routes here
router.post('/register', register)

module.exports = router;