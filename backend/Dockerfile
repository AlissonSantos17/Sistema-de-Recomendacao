FROM python:3.7

WORKDIR /usr/src/app/backend

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "python" , "main.py" ]