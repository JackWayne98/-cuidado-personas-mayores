const router = require("express").Router();

const { create, getByElderId, getById, update, remove } = require("../../controllers/actividades.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");

router.get("/persona-mayor/:elderId", checkToken, getByElderId);
router.get("/:id", checkToken, getById);

router.post("/", checkToken, create);

router.put("/:id", checkToken, update);

router.delete("/:id", checkToken, remove);


module.exports = router;
