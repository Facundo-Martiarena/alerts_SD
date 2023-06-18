import json
import os
import smtplib
import pika
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)


def send_mail(sender, receiver, subject, message):
    load_dotenv('.env')
    smtp_server = os.getenv('SMTP_SERVER')
    smtp_port = int(os.getenv('SMTP_PORT'))
    smtp_username = os.getenv('SMTP_USERNAME')
    smtp_password = os.getenv('SMTP_PASSWORD')

    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = receiver
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as smtp:
            smtp.starttls()
            smtp.login(smtp_username, smtp_password)
            smtp.send_message(msg)
        logging.info('Email sent successfully.')
    except smtplib.SMTPException as e:
        logging.error('Failed to send email: %s', e)


def process_message(ch, method, properties, body):
    data = json.loads(body)
    pressure = data.get('pressure')
    location = data.get('location')
    department = data.get('department')
    logging.info(f'pressure: %s in the location: %s', pressure, location)

    users_list = []

    mongo_client = MongoClient('localhost', 27017)
    mongo_db = mongo_client['rabbitMQ']
    mongo_users = mongo_client['alertas']
    collection_users = mongo_users['users']

    users = collection_users.find()
    for user in users:
        user_email = user.get('email')
        users_list.append(user_email)

    if pressure < 50:
        collection = mongo_db['alerts_pressure']
        receiver = users_list
        receiver_str = ', '.join(receiver)
        subject = 'Alerta importante'
        message = f'An alert condition has been detected in the system, in department: {department}, with a pressure of {pressure} psi.'
        send_mail('sistemas.distribuidos2023@gmail.com', receiver_str, subject, message)
    else:
        collection = mongo_db['not_alerted']

    logging.info('Message saved in MongoDB')
    collection.insert_one(data)

    ch.basic_ack(delivery_tag=method.delivery_tag)
    logging.info('Message received and processed successfully')


def main():
    load_dotenv('.env')
    rabbitmq_host = os.getenv('RABBITMQ_HOST')
    rabbitmq_port = int(os.getenv('RABBITMQ_PORT'))
    rabbitmq_queue = os.getenv('RABBITMQ_QUEUE')

    connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host, rabbitmq_port))
    channel = connection.channel()
    channel.queue_declare(queue=rabbitmq_queue)

    channel.basic_consume(queue=rabbitmq_queue, on_message_callback=process_message)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()

    connection.close()


if __name__ == '__main__':
    main()
