## Login de usuarios

Method: POST
Url: /api/usuarios/login
Body: email, password

Response: El token de acceso a la aplicacion

## Registro de Usuarios
Method: POST
Url: /api/users/register
Body: name, lastname, email, phone, password
Headers: XXXX

Response: el nuevo usuario creado

## Registro de persona_mayor
Method: POST
Url: /api/personas-mayores
Headers: Authorization: Bearer <token>
Body: nombre, apellido, fecha_nacimiento, genero, movilidad, condiciones_medicas, notas_generales, relacion: (uno de: familiar, cuidador, profesional_salud)
Response: la nueva persona mayor registrada

## Obtener detalles de una Persona Mayor
Method: GET
Url: /api/personas-mayores/:elderId
Headers: Authorization: Bearer <token>
Response: Datos completos de la persona mayor

## Obtener todas las Personas Mayores registradas por un usuario
Method: GET
Url: /api/personas-mayores
Headers: Authorization: Bearer <token>
Response: Lista de personas mayores asociadas al usuario


## Actualizar información de una Persona Mayor
Method: PUT
Url: /api/personas-mayores/:elderId
Headers: Authorization: Bearer <token>
Body: nombre, apellido, fecha_nacimiento, genero, movilidad, condiciones_medicas, notas_generales
Response: Persona mayor actualizada correctamente

## Eliminar una Persona Mayor
Method: DELETE
Url: /api/personas-mayores/:elderId
Headers: Authorization: Bearer <token>
Response: Confirmación de eliminación