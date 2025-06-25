## USUARIOS

### Login de usuarios

Method: POST
Url: /api/usuarios/login
Body: email, password

Response: El token de acceso a la aplicacion

### Registro de Usuarios

Method: POST
Url: /api/users/register
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

## ACTIVIDADDES

### Obtener actividades de una persona mayor

Method: GET  
Url: /api/actividades/persona/:elderId  
Headers: Authorization: Bearer <token>  
Response: Array de lista de actividades asociadas a la persona mayor

### Obtener una actividad por ID

Method: GET  
Url: /api/actividades/:id  
Headers: Authorization: Bearer <token>  
Response: Objeti de detalles de la actividad

### Crear una nueva actividad

Method: POST  
Url: /api/actividades  
Headers: Authorization: Bearer <token>  
Body: titulo, descripcion, fecha, hora, persona_mayor_id  
Response: Objeto de actividad creada

### Actualizar una actividad existente

Method: PUT  
Url: /api/actividades/:id  
Headers: Authorization: Bearer <token>  
Body: persona_mayor_id, nombre, categoria, descripcion, es recurrente  
Response: Objeto de actividad actualizada

### Eliminar una actividad

Method: DELETE  
Url: /api/actividades/:id  
Headers: Authorization: Bearer <token>  
Response: Confirmación de eliminación
