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

### Obtener actividades de una persona mayor

Method: GET  
Url: /api/actividades/persona-mayor/:elderId  
Headers: Authorization: Bearer <token>  
Response: Array de lista de actividades asociadas a la persona mayor

### Obtener una actividad por ID

Method: GET  
Url: /api/actividades/:id  
Headers: Authorization: Bearer <token>  
Response: Objeto de actividad

### Crear una nueva actividad

Method: POST  
Url: /api/actividades  
Headers: Authorization: Bearer <token>  
Body: nombre, categoria (una de: medicación, terapia, ejercicio, alimentación, descanso, visita, ocio), descripcion, es_recurrente
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
