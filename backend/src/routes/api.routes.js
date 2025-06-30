const router = require("express").Router();

router.use("/usuarios", require("./api/usuarios.routes"));
router.use("/personas-mayores", require("./api/personasMayores.routes"));
router.use("/actividades", require("./api/actividades.routes"));
router.use("/evento-actividad", require("./api/eventoActividad.routes"));
router.use("/recetas-medicas", require("./api/recetas.routes"));

module.exports = router;
