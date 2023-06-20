import json
import os
import pika
import logging
from dotenv import load_dotenv
from flask import Flask
from pymongo import MongoClient
from rabbit.venv.utils.rabbit_utils import get_users, send_mail

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

mongo_client = MongoClient('localhost', 27017)
mongo_db = mongo_client['rabbitMQ']


def process_message_pressure(ch, method, properties, body):
    data = json.loads(body)
    pressure = data.get('pressure')
    location = data.get('location')
    department = data.get('department')
    logging.info(f'pressure: %s in the location: %s', pressure, location)
    collection_all = mongo_db['all']

    if pressure < 50:
        collection = mongo_db[department + '_alert_pressure']
        receiver_str = ', '.join(get_users())
        subject = 'Alert!!!'
        message = f'An alert condition has been detected in the system, in department: {department}, with a pressure of {pressure} psi.'
        send_mail(receiver_str, subject, message)
    else:
        collection = mongo_db['not_alerted']

    logging.info('Message saved in MongoDB')
    collection.insert_one(data)
    collection_all.insert_one(data)

    ch.basic_ack(delivery_tag=method.delivery_tag)
    logging.info('Message received and processed successfully')


def main():
    load_dotenv('../.env')
    rabbitmq_host = os.getenv('RABBITMQ_HOST')
    rabbitmq_port = int(os.getenv('RABBITMQ_PORT'))
    rabbitmq_queue = os.getenv('RABBITMQ_QUEUE')

    connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host, rabbitmq_port))
    channel = connection.channel()
    channel.queue_declare(queue=rabbitmq_queue)

    channel.basic_consume(queue=rabbitmq_queue, on_message_callback=process_message_pressure)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()

    connection.close()


if __name__ == '__main__':
    main()
