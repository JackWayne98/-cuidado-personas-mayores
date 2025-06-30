const {
  create,
  getByUser,
  getById,
  createRecurrentEvent,
  edit,
  updateStatus,
  deleteEventoActividad,
  deletebyRecurrentGroup,
} = require("../../controllers/eventoActividad.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");

const router = require("express").Router();

router.post("/recurrentes", checkToken, createRecurrentEvent);

router.post("/", checkToken, create);
router.get("/", checkToken, getByUser);
router.get("/:id", checkToken, getById);
router.put("/:id", checkToken, edit);
router.put("/:id/status", checkToken, updateStatus);
router.delete("/:id", checkToken, deleteEventoActividad);
router.delete("/recurrentes/:grupo_recurrencia_id", checkToken, deletebyRecurrentGroup)

module.exports = router;
