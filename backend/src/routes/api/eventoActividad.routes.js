const {
  create,
  getByUser,
  getById,
  createRecurrentEvent,
} = require("../../controllers/eventoActividad.controller");
const { checkToken } = require("../../middlewares/auth.middlewares");

const router = require("express").Router();

router.post("/", checkToken, create);
router.get("/", checkToken, getByUser);
router.get("/:id", checkToken, getById);

router.post("/recurrentes", checkToken, createRecurrentEvent)

module.exports = router;
