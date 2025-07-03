const { create, markAsRead } = require("../../controllers/notificaciones.controller");

const router = require("express").Router();

router.post("/", create);
router.put("/:id/leida", markAsRead)


module.exports = router
console.log("Changes")