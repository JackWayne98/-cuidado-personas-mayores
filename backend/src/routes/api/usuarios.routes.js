const { register, getById, login } = require("../../controllers/usuarios.controller");


const router = require("express").Router();

// Define your routes here

router.get("/:userId", getById);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
