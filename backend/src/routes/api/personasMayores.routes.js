const {
  create,
  getById,
  getByUser,
  edit,
  deletePersonaMayor,
} = require("../../controllers/personasMayores.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");
const verificarRelacionPersonaMayor = require("../../middlewares/verificarRelacionPersonaMayor");

const router = require("express").Router();

router.get("/:elderId", checkToken, getById);
router.get("/", checkToken, getByUser);
router.post("/", checkToken, create);
router.put("/:elderId", checkToken, verificarRelacionPersonaMayor, edit);
router.delete("/:elderId", checkToken, verificarRelacionPersonaMayor, deletePersonaMayor)

module.exports = router;
