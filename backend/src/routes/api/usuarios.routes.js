const { register, getById } = require("../../controllers/usuarios.controller");


const router = require("express").Router();

// Define your routes here

router.get("/:userId", getById);
router.post("/register", register);

module.exports = router;
