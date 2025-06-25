const router = require("express").Router();

router.use("/usuarios", require("./api/usuarios.routes"));
router.use("/personas-mayores", require("./api/personasMayores.routes") )

module.exports = router;
