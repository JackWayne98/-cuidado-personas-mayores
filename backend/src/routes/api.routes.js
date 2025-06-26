const router = require("express").Router();

router.use("/usuarios", require("./api/usuarios.routes"));
router.use("/personas-mayores", require("./api/personasMayores.routes"));
router.use("/actividades", require("./api/actividades.routes"));

module.exports = router;
