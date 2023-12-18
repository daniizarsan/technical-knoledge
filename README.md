
# technical-knoledge

## Instrucciones para el lanzamiento
Para instalar las dependencias de este proyecto, ejecute el siguiente comando:  `npm install`.

En primer lugar, hay que configurar el archivo con las variables de entorno.

Para compilar el proyecto se debe usar el comando `npm run build` y una vez compilado con `npm run start`.

El servidor escuchará en el puerto 3030 por defecto. Puede cambiar el puerto configurando la variable de entorno PORT.

## Documentación

La documentación puede encontrarse en la URL `/api-docs`

## Control de versiones

### v1.0 18/12/2023

- [X] CRUD User
	> - [X] Obtener la lista de todos los usuarios
	> - [X] Obtener la información de un único usuario
	> - [X] Añadir un nuevo usuario
	> - [X] Borrar un usuario
	> - [X] Actualizar toda la información de un usuario
	> - [X] Actualizar parciamente la información de un usuario

- [X] CRUD Home
	> - [X] Obtener la lista de todos las viviendas de un usuario
	> - [X] Obtener la lista de todos las viviendas de un usuario aplicando filtros opcionales
	> - [X] Añadir una vivienda y asociarla a un usuario
	> - [X] Borrar una vivienda asociada a un usuario
	> - [X] Actualizar la información de un usuario
