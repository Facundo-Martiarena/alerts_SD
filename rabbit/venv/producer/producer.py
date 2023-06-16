import pika
import json
from flask import Flask, request
import uuid

app = Flask(__name__)


@app.route('/datos', methods=['POST'])
def procesar_datos():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    queue_name = 'requests'
    data = request.json

    data['_id'] = str(uuid.uuid4())
    data['estado'] = "alertado"

    message = json.dumps(data)

    channel.basic_publish(exchange='', routing_key=queue_name, body=message)

    print("Mensaje enviado a la cola")

    connection.close()

    return 'Los datos se procesaron correctamente.'


if __name__ == '__main__':
    app.run(debug=True)
