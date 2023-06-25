import json
import os
import jwt
import pika
import requests
import logging
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/data', methods=['POST'])
def process_data():
    queue_name = 'queueName'
    data = request.json

    data['status'] = "alerted"

    message = json.dumps(data)

    sensor_id = data['sensor_id']
    verify_sensor = verify_token(sensor_id)

    if not verify_sensor:
        logging.error('ERROR 401: Unauthorized access')
        return jsonify({"message": "Unauthorized access"}), 401

    connection = pika.BlockingConnection(pika.ConnectionParameters('queue'))
    channel = connection.channel()

    channel.basic_publish(exchange='', routing_key=queue_name, body=message)

    connection.close()

    result_message = jsonify({"message": 'The data was successfully processed.'}), 200
    logging.info(result_message)
    return result_message


def verify_token(sensor_id):

    data = {
        "_id": sensor_id
    }

    response = requests.post("http://login_server:8080/api/authenticate/sensor", json=data)

    if not response:
        return False

    token = response.json()["token"]
    code_token = os.getenv('JWTPRIVATEKEY')

    try:
        decoded = jwt.decode(token, code_token, algorithms=['HS256'])
        if decoded['_id'] == data.get('_id'):
            logging.info('Valid Token')
            return True
    except jwt.DecodeError:
        return jsonify({"message": "Invalid Token"}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Expired token"}), 401


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
