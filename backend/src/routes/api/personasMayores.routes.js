const {
  create,
  getById,
  getByUser,
  edit,
  deletePersonaMayor,
} = require("../../controllers/personasMayores.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");


const router = require("express").Router();

router.get("/:elderId", checkToken, getById);
router.get("/", checkToken, getByUser);
router.post("/", checkToken, create);
router.put("/:elderId", checkToken, edit);
router.delete("/:elderId", checkToken, deletePersonaMayor)

module.exports = router;
