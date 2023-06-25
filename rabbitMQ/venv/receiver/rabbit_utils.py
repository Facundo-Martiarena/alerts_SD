import smtplib
import os
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
from pymongo import MongoClient

mongo_client = MongoClient('mongodb', 27017)
mongo_db = mongo_client['rabbitMQ']
mongo_users = mongo_client['alertas']


def send_mail(receiver, subject, message):
    sender = 'sistemas.distribuidos2023@gmail.com'
    load_dotenv('../.env')
    smtp_server = os.getenv('SMTP_SERVER')
    smtp_port = os.getenv('SMTP_PORT')
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


def get_users():
    users_list = []
    collection_users = mongo_users['users']
    users = collection_users.find()
    for user in users:
        user_email = user.get('email')
        users_list.append(user_email)

    return users_list
