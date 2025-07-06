const router = require("express").Router();

const { create, getById, update, remove, getByUser, getAll } = require("../../controllers/actividades.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");

router.get('/usuario', checkToken, getByUser);
router.get("/all", checkToken, getAll);
router.get("/:id", checkToken, getById);

router.post("/", checkToken, create);

router.put("/:id", checkToken, update);

router.delete("/:id", checkToken, remove);


module.exports = router;
