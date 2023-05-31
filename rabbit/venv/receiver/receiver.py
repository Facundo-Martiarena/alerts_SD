import smtplib
import pika
from pymongo import MongoClient
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Establece la conexión con RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = connection.channel()

queue_name = 'queueName'
channel.queue_declare(queue=queue_name)

mongo_client = MongoClient('localhost', 27017)
mongo_db = mongo_client['rabbitMQ']
mongo_collection_alert = mongo_db['datos_alertados']
mongo_collection_others = mongo_db['datos_no_alertados']


def callback(ch, method, properties, body):
    data = json.loads(body)
    presion = data.get('presion')
    departamento = data.get('departamento')
    print(f"presión: {presion} en el departamento: {departamento}")

    print("Versión de smtplib:", smtplib.__version__)

    if presion < 50:
        collection = mongo_db[departamento + '_alerta_presion']
        # Ejemplo de uso
        destinatario = 'facumartiarena1995@gmail.com'
        asunto = 'Alerta importante'
        mensaje = f'Se ha detectado una situación de alerta en el sistema, en el departamento: {departamento}, con una presión de {presion}.'
        enviar_correo('sistemas.distribuidos2023@gmail.com', destinatario, asunto, mensaje, 'auth0.json')

    else:
        collection = mongo_db['no_alertados']

    print("Mensaje guardado en MongoDB")
    collection.insert_one(data)

    ch.basic_ack(delivery_tag=method.delivery_tag)
    print("Mensaje recibido y procesado exitosamente")


def enviar_correo(sender, receiver, subject, message, credentials_file):
    code = "huoxjemlwiopgwnr"

    # Configuración del mensaje
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = receiver
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    # Envío del correo electrónico
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login(sender, code)
            smtp.send_message(msg)
        print('Correo electrónico enviado correctamente.')
    except smtplib.SMTPException as e:
        print('Error al enviar el correo electrónico:', e)


# Registra la función como consumidor de la cola temporal
channel.basic_consume(queue=queue_name, on_message_callback=callback)

# Comienza a consumir mensajes de la cola temporal
channel.start_consuming()

# Cierra la conexión con RabbitMQ
connection.close()
