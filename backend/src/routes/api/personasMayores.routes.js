const {
  create,
  getById,
  getByUser,
  edit,
  deletePersonaMayor,
} = require("../../controllers/personasMayores.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");
const checkPersonaMayorAccess = require("../../middlewares/PersonaMayorAccess.middlewares");

const router = require("express").Router();

router.get("/:elderId", checkToken, checkPersonaMayorAccess({ fromPersonaMayorId: true, paramName: "elderId" }), getById);
router.get("/", checkToken, getByUser);
router.post("/", checkToken, create);
router.put("/:elderId", checkToken, checkPersonaMayorAccess({ fromPersonaMayorId: true, paramName: "elderId" }), edit);
router.delete("/:elderId", checkToken, checkPersonaMayorAccess({ fromPersonaMayorId: true, paramName: "elderId" }), deletePersonaMayor);

module.exports = router;