import pymongo
import time
import logging
from datetime import datetime, timedelta
from functools import lru_cache

from rabbit_utils import get_users, send_mail

client = pymongo.MongoClient("mongodb://mongodb:27017")
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
        ten_seconds_ago = datetime.utcnow() - timedelta(minutes=30)
        ten_minutes_ago_str = ten_seconds_ago.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        for sensor_id in sensor_ids:
            result = collection_all.find_one({"sensor_id": sensor_id, "date": {"$gte": ten_minutes_ago_str}})

            if result is not None:
                logging.info("Data found for the following sensor: %s", result)
            else:
                list_sensors_no_response.append(sensor_id)
                logging.info("No data found for the following sensor: %s", sensor_id)

        if list_sensors_no_response:
            sensor_list = ', '.join(list_sensors_no_response)
            message = f'No data found for the following sensors: {sensor_list}'
            subject = 'Alert!!!'
            users = get_users()
            users_join = ', '.join(users)
            send_mail(users_join, subject, message)

        time.sleep(1800)


ids = get_all_ids()
check_sensor_data(ids)
