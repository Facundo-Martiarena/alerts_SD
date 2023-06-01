FROM python:3.8-slim-buster

WORKDIR /usr/src/app

RUN pip3 install --upgrade setuptools
#Copiamos los archivos de la carpeta actual hacia docker
COPY .. .

#Descargamos las dependencias
RUN pip3 install -r requirements.txt

#Ejecutamos nuestra app en docker
ENTRYPOINT ["python3", "consumer.py"]