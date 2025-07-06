const PersonaMayor = require("../models/personasMayores.model");
const PersonaUsuario = require("../models/personaUsuario.model");
const dayjs = require("dayjs");

const create = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      fecha_nacimiento,
      genero,
      movilidad,
      condiciones_medicas,
      notas_generales,
      relacion,
    } = req.body;

    // Lista de valores permitidos para relacion
    const relacionesValidas = ["familiar", "cuidador", "profesional_salud"];
    if (!relacionesValidas.includes(relacion)) {
      return res.status(400).json({
        success: false,
        message: `Valor inválido para 'relacion'. Valores permitidos: ${relacionesValidas.join(
          ", "
        )}`,
      });
    }

    const fecha_creacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const creado_por = req.user.id;
    const modificado_por = req.user.id;

    const elderData = {
      nombre,
      apellido,
      fecha_nacimiento,
      genero,
      movilidad,
      condiciones_medicas,
      notas_generales,
      creado_por,
      modificado_por,
      fecha_creacion,
      fecha_modificacion,
    };
    const result = await PersonaMayor.insert(elderData);
    const personaMayorId = result.insertId;
    const personaMayor = await PersonaMayor.selectById(personaMayorId);

    const perfilUsuarioId = req.user.id;
    console.log(
      "Insertando en persona_usuario:",
      personaMayorId,
      perfilUsuarioId,
      relacion
    );
    await PersonaUsuario.insert(personaMayorId, perfilUsuarioId, relacion);

    return res.json({
      success: true,
      message: "Persona mayor registrada correctamente",
      personaMayor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  const { elderId } = req.params;
  try {
    const personaMayor = await PersonaMayor.selectById(elderId);
    if (!personaMayor) {
      return res
        .status(404)
        .json({ success: false, message: "Persona mayor no encontrada" });
    }
    return res.json({ success: true, personaMayor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getByUser = async (req, res) => {
  const perfilUsuarioId = req.user.id;
  const personasMayores = await PersonaMayor.selectByUser(perfilUsuarioId);
  return res.json({
    personasMayores,
  });
};

const edit = async (req, res) => {
   const {
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    movilidad,
    condiciones_medicas,
    notas_generales,
  } = req.body;

  const personaMayorId = req.params.elderId;
  const modificado_por = req.user.id;
  const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss")
   
  const PersonaMayorUpdatedData = {
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    movilidad,
    condiciones_medicas,
    notas_generales,
    modificado_por,
    fecha_modificacion,
  };
  const result = await PersonaMayor.update(personaMayorId, PersonaMayorUpdatedData);
  const personaMayor = await PersonaMayor.selectById(personaMayorId)
  return res.json({
    personaMayor,
  });
};

const deletePersonaMayor = async (req, res) => {
  try {
    const personaMayorId = req.params.elderId; 
    const result = await PersonaMayor.deleteById(personaMayorId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Persona mayor no encontrada" });
    }

    return res.json({ success: true, message: "Persona mayor eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { create, getById, getByUser, edit, deletePersonaMayor };
