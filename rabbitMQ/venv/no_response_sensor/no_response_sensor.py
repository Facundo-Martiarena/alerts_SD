import pymongo
import time
from datetime import datetime, timedelta
from functools import lru_cache

from rabbit.venv.utils.rabbit_utils import send_mail, get_users

client = pymongo.MongoClient("mongodb://localhost:27017")
db_sensor = client['alertas']
collection_sensors = db_sensor['sensors']
db_all = client['rabbitMQ']
collection_all = db_all['all']


@lru_cache(maxsize=None)
def get_all_ids():
    documents = collection_sensors.find({})

    ids_sensors = [str(doc['_id']) for doc in documents]

    return ids_sensors


def check_sensor_data(sensor_ids):
    list_sensors_no_response = []
    while True:
        ten_seconds_ago = datetime.utcnow() - timedelta(minutes=10)
        ten_minutes_ago_str = ten_seconds_ago.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        for sensor_id in sensor_ids:
            result = collection_all.find_one({"sensor_id": sensor_id, "date": {"$gte": ten_minutes_ago_str}})

            if result is not None:
                print("Data found for the following sensor:", result)
            else:
                list_sensors_no_response.append(sensor_id)
                print("No data found for the following sensor:", sensor_id)

        if list_sensors_no_response:
            sensor_list = ', '.join(list_sensors_no_response)
            message = f'No data found for the following sensors: {sensor_list}'
            subject = 'Alert!!!'
            users = get_users()
            users_join = ', '.join(users)
            send_mail(users_join, subject, message)

        time.sleep(600)


ids = get_all_ids()
print(ids)

check_sensor_data(ids)
