const router = require("express").Router();

const { create, getByElderId } = require("../../controllers/actividades.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");

router.get("/persona-mayor/:elderId", checkToken, getByElderId);
router.post("/", checkToken, create);


module.exports = router;
