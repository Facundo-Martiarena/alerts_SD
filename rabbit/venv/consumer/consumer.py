import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import pika
from pymongo import MongoClient

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

queue_name = 'requests'
channel.queue_declare(queue=queue_name)

mongo_client = MongoClient('localhost', 27018)
mongo_db = mongo_client['rabbitMQ']


def callback(ch, method, properties, body):
    data = json.loads(body)
    presion = data.get('presion')
    departamento = data.get('departamento')
    print(f"presión: {presion} en el departamento: {departamento}")

    if presion < 50:
        collection = mongo_db[departamento + '_alerta_presion']
        # Ejemplo de uso
        destinatario = 'facumartiarena1995@gmail.com'
        asunto = 'Alerta importante'
        mensaje = f'Se ha detectado una situación de alerta en el sistema, en el departamento: {departamento}, con una presión de {presion}.'
        send_mail('sistemas.distribuidos2023@gmail.com', destinatario, asunto, mensaje)

    else:
        collection = mongo_db['no_alertados']

    print("Mensaje guardado en MongoDB")
    collection.insert_one(data)

    ch.basic_ack(delivery_tag=method.delivery_tag)
    print("Mensaje recibido y procesado exitosamente")


def send_mail(sender, receiver, subject, message):
    code = "huoxjemlwiopgwnr"

    # Configuración del mensaje
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = receiver
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login(sender, code)
            smtp.send_message(msg)
        print('Correo electrónico enviado correctamente.')
    except smtplib.SMTPException as e:
        print('Error al enviar el correo electrónico:', e)


channel.basic_consume(queue=queue_name, on_message_callback=callback)

channel.start_consuming()

connection.close()
