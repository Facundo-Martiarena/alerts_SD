# Proyecto ALERTAS 

Este proyecto consta de tres servicios, en los caules, dos están basada en Node.js y MongoDB (login y statistics), junto con servicios en Python que utiliza RabbitMQ y 
MongoDB como los otros. Este es un sistema para registrar datos de sensores, realizar consultas y procesar tareas en segundo plano.
Tiene como cometido fundamental, notificar alertas en caso de que haya un cambio considerable en la presión de agua, los mismos notificarán a los usuarios registrados en el sistema en caso de que no haya una respuesta en los últimos 30 minutos.

## Instrucciones de Uso

Sigue los pasos a continuación para ejecutar la aplicación y realizar pruebas.

### Requisitos

- Docker
- Docker Compose
- JMeter (opcional, solo para pruebas de carga)

### Pasos a Seguir

1. Clona el repositorio a tu máquina local.

2. Navega hasta el directorio del proyecto.

3. Ejecuta el siguiente comando para iniciar la aplicación, la base de datos MongoDB y los servicios Python con RabbitMQ utilizando Docker Compose:

   ```bash
   docker-compose build
   docker-compose up

4. Puedes utilizar el siguiente curl para tener referencia y realizar pruebas por cada sensor en particular

   ```bash
   curl --location --request POST 'http://localhost:5000/data' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "sensor_id": "649792d46ae61f7ade49d5ab",
   "department": "Montevideo",
   "location": "direccion_3",
   "pressure": 12,
   "date": "{{currentDate}}"
   }'

5. Para poder realizar las pruebas de carga, debe abrir el archivo `sistemasDistribuidos.jmx`, y ejecutar.
   (tener en cuenta que la verisón usada para jmeter, es la 5.5)
