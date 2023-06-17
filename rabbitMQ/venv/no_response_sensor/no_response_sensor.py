import pymongo
import time
from datetime import datetime, timedelta

# ID del sensor que deseas consultar
sensor_id = "648e3a5c62790b060b4de3ad"


def check_sensor_data(sensor_id):
    client = pymongo.MongoClient("mongodb://localhost:27017")
    db = client['rabbitMQ']
    collection = db['all']
    while True:

        ten_seconds_ago = datetime.utcnow() - timedelta(minutes=1)
        ten_minutes_ago_str = ten_seconds_ago.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        result = collection.find_one({"sensor_id": sensor_id, "date": {"$gte": ten_minutes_ago_str}})

        if result is not None:
            print("Se encontraron datos del sensor:", result)
        else:
            print("No se encontraron datos del sensor")

        time.sleep(10)


check_sensor_data(sensor_id)
