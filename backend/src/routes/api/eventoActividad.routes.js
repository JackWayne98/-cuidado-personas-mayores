const {
  create,
  getByUser,
  getById,
  createRecurrentEvent,
  edit,
  updateStatus,
  deleteEventoActividad,
  deletebyRecurrentGroup,
  updateRecurrentGroup,
  getByRecurrentGroupId,
} = require("../../controllers/eventoActividad.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");
const checkPersonaMayorAccess = require("../../middlewares/PersonaMayorAccess.middlewares");

const router = require("express").Router();
router.use(checkToken);

router.get("/recurrentes/:grupo_recurrencia_id", checkPersonaMayorAccess({ fromRecurrentGroup: true }), getByRecurrentGroupId);
router.put("/recurrentes/:grupo_recurrencia_id", checkPersonaMayorAccess({ fromRecurrentGroup: true }), updateRecurrentGroup);
router.delete("/recurrentes/:grupo_recurrencia_id", checkPersonaMayorAccess({ fromRecurrentGroup: true }), deletebyRecurrentGroup);

router.post("/recurrentes", createRecurrentEvent);
router.post("/", create);
router.get("/", getByUser);

router.get("/:id", checkPersonaMayorAccess({ fromEventoActividad: true }), getById);
router.put("/:id", checkPersonaMayorAccess({ fromEventoActividad: true }), edit);
router.put("/:id/status", checkPersonaMayorAccess({ fromEventoActividad: true }), updateStatus);
router.delete("/:id", checkPersonaMayorAccess({ fromEventoActividad: true }), deleteEventoActividad);

module.exports = router;