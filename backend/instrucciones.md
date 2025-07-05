## USUARIOS

### Login de usuarios

Method: POST
Url: /api/usuarios/login
Body: email, password

Response: El token de acceso a la aplicacion

### Registro de Usuarios

Method: POST
Url: /api/usuarios/register
Body: name, lastname, email, phone, password
Headers: XXXX

Response: el nuevo usuario creado

---

## PERSONA MAYOR

### Registro de persona_mayor

Method: POST
Url: /api/personas-mayores
Headers: Authorization: Bearer <token>
Body: nombre, apellido, fecha_nacimiento, genero, movilidad, condiciones_medicas, notas_generales, relacion: (uno de: familiar, cuidador, profesional_salud)
Response: la nueva persona mayor registrada

### Obtener detalles de una Persona Mayor

Method: GET
Url: /api/personas-mayores/:elderId
Headers: Authorization: Bearer <token>
Response: Datos completos de la persona mayor

### Obtener todas las Personas Mayores registradas por un usuario

Method: GET
Url: /api/personas-mayores
Headers: Authorization: Bearer <token>
Response: Lista de personas mayores asociadas al usuario

### Actualizar información de una Persona Mayor

Method: PUT
Url: /api/personas-mayores/:elderId
Headers: Authorization: Bearer <token>
Body: nombre, apellido, fecha_nacimiento, genero, movilidad, condiciones_medicas, notas_generales
Response: Persona mayor actualizada correctamente

### Eliminar una Persona Mayor

Method: DELETE
Url: /api/personas-mayores/:elderId
Headers: Authorization: Bearer <token>
Response: Confirmación de eliminación

---

## ACTIVIDADES

### Obtener una actividad por ID

Method: GET  
Url: /api/actividades/:id  
Headers: Authorization: Bearer <token>  
Response: Objeto de actividad

### Crear una nueva actividad

Method: POST  
Url: /api/actividades  
Headers: Authorization: Bearer <token>  
Body: nombre, categoria (una de: medicación, terapia, ejercicio, alimentación, descanso, visita, ocio), descripcion
Response: Objeto de actividad creada

### Actualizar una actividad existente

Method: PUT  
Url: /api/actividades/:id  
Headers: Authorization: Bearer <token>  
Body: nombre, categoria (una de: medicación, terapia, ejercicio, alimentación, descanso, visita, ocio), descripcion, es_recurrente
Response: Objeto de actividad actualizada

### Eliminar una actividad

Method: DELETE  
Url: /api/actividades/:id  
Headers: Authorization: Bearer <token>  
Response: Confirmación de eliminación

---

### EVENTO ACTIVIDAD

### Crear un nuevo evento actividad individual

Method: POST
Url: /api/evento-actividad
Headers: Authorization: Bearer
Body: actividad_id, fecha_inicio, fecha_fin, recordatorio
Response: Objeto del evento creado

### Crear eventos recurrentes para una actividad

Method: POST
Url: /api/evento-actividad/recurrente
Headers: Authorization: Bearer
Body: actividad_id, fecha_inicio, fecha_fin, recordatorio, intervalo_horas, repeticiones
Response: Objeto con grupo_recurrencia_id y lista de eventos creados

### Obtener eventos actividad por usuario autenticado

Method: GET
Url: /api/evento-actividad/usuario
Headers: Authorization: Bearer
Response: Lista de eventos del usuario

### Obtener un evento actividad individual por ID

Method: GET
Url: /api/evento-actividad/:id
Headers: Authorization: Bearer
Response: Objeto del evento solicitado

### Obtener eventos actividad por grupo de recurrencia

Method: GET
Url: /api/evento-actividad/grupo-recurrencia/:grupo_recurrencia_id
Headers: Authorization: Bearer
Params: grupo_recurrencia_id (UUID del grupo de recurrencia)
Response: Lista de eventos actividad asociados al grupo de recurrencia

### Editar eventos de un grupo de recurrencia

Method: PUT  
Url: /api/evento-actividad/recurrentes/:grupo_recurrencia_id  
Headers: Authorization: Bearer  
Body: fecha_inicio, fecha_fin, recordatorio  
Response: Lista de eventos del grupo actualizados

### Editar un evento actividad

Method: PUT
Url: /api/evento-actividad/:id
Headers: Authorization: Bearer <token>
Body: fecha_inicio, fecha_fin, recordatorio, (opcional: estado si se desea cambiar)
Response: Objeto del evento actualizado

### Cambiar el estado de un evento actividad

Method: PUT
Url: /api/evento-actividad/:id/estado
Headers: Authorization: Bearer
Body: estado (uno de: pendiente, completado, cancelado)
Response: Estado del Objeto del evento actualizado

### Eliminar un evento actividad

Method: DELETE
Url: /api/evento-actividad/:id
Headers: Authorization: Bearer
Response: Confirmación de eliminación y datos del evento eliminado

### Eliminar eventos recurrentes por grupo de recurrencia

Method: DELETE
Url: /api/evento-actividad/recurrentes/:grupo_recurrencia_id
Headers: Authorization: Bearer
Response: Mensaje confirmando la eliminación o error si no se encuentran eventos con ese grupo.

---

## RECETAS MÉDICAS

### Crear una nueva receta médica

Method: POST
Url: /api/recetas-medicas
Headers: Authorization: Bearer <token>
Body: persona_mayor_id, medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, prescrita_por, archivo_pdf
Response: Objeto de la receta médica creada

### Obtener recetas médicas de una persona mayor

Method: GET
Url: /api/recetas-medicas/persona-mayor/:elderId
Headers: Authorization: Bearer <token>
Response: Array con recetas médicas asociadas a la persona mayor

### Obtener una receta médica por ID

Method: GET
Url: /api/recetas-medicas/:id
Headers: Authorization: Bearer <token>
Response: Objeto de receta médica

### Actualizar una receta médica

Method: PUT
Url: /api/recetas-medicas/:id
Headers: Authorization: Bearer <token>
Body: medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, prescrita_por, archivo_pdf
Response: Objeto de receta médica actualizada

### Eliminar una receta médica

Method: DELETE
Url: /api/recetas-medicas/:id
Headers: Authorization: Bearer <token>
Response: Confirmación de eliminación

---

## DIETAS ALIMENTICIAS

### Crear una nueva dieta alimenticia

Method: POST  
Url: /api/dietas-alimenticias  
Headers: Authorization: Bearer <token>  
Body: persona_mayor_id, descripcion, restricciones, recomendaciones, fecha_inicio, fecha_fin  
Response: Objeto de la dieta alimenticia creada

### Obtener dietas alimenticias de una persona mayor

Method: GET  
Url: /api/dietas-alimenticias/persona-mayor/:elderId  
Headers: Authorization: Bearer <token>  
Response: Array con dietas alimenticias asociadas a la persona mayor

### Obtener una dieta alimenticia por ID

Method: GET  
Url: /api/dietas-alimenticias/:id  
Headers: Authorization: Bearer <token>  
Response: Objeto de dieta alimenticia

### Actualizar una dieta alimenticia

Method: PUT  
Url: /api/dietas-alimenticias/:id  
Headers: Authorization: Bearer <token>  
Body: descripcion, restricciones, recomendaciones, fecha_inicio, fecha_fin, es_activa  
Response: Objeto de dieta alimenticia actualizada

### Eliminar una dieta alimenticia

Method: DELETE  
Url: /api/dietas-alimenticias/:id  
Headers: Authorization: Bearer <token>  
Response: Confirmación de eliminación

---

## CONTACTOS DE EMERGENCIA

### Crear un nuevo contacto de emergencia

Method: POST  
Url: /api/contactos-emergencia  
Headers: Authorization: Bearer <token>  
Body: persona_mayor_id, nombre, correo, telefono, relacion, es_medico  
Response: Objeto del contacto creado

### Obtener contactos de emergencia de una persona mayor

Method: GET  
Url: /api/contactos-emergencia/persona-mayor/:elderId  
Headers: Authorization: Bearer <token>  
Response: Array con contactos asociados a la persona mayor

### Obtener un contacto de emergencia por ID

Method: GET  
Url: /api/contactos-emergencia/:id  
Headers: Authorization: Bearer <token>  
Response: Objeto del contacto

### Actualizar un contacto de emergencia

Method: PUT  
Url: /api/contactos-emergencia/:id  
Headers: Authorization: Bearer <token>  
Body: nombre, correo, telefono, relacion, es_medico  
Response: Objeto actualizado del contacto

### Eliminar un contacto de emergencia

Method: DELETE  
Url: /api/contactos-emergencia/:id  
Headers: Authorization: Bearer <token>  
Response: Confirmación de eliminación

## NOTIFICACIONES

Crear una nueva notificación

Method: POST
Url: /api/notificaciones
Headers: Authorization: Bearer
Body: evento_actividad_id, perfil_usuario_id, mensaje, fecha_envio, leida
Response: Objeto de la notificación creada

### Marcar notificación como leída

Method: PUT
Url: /api/notificaciones/:notificacionId/leida
Headers: Authorization: Bearer
Body: leida
Response: Confirmación de que el estado leida fue actualizado
