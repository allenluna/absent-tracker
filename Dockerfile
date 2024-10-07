# FROM python:3.11-slim-buster

# RUN apt-get update && apt-get install -y curl

# WORKDIR /app
# ENV PYTHONUNBUFFERED true

# COPY . .
# RUN pip install -r requirements.txt
# # ENV PYTHONPATH="${PYTHONPATH}:/usr/src/jam"
# EXPOSE 8000
# # ENTRYPOINT ["python", "/usr/src/jam/manage.py"]

# # By default, start the web server when container runs
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "JAM_AGENT_NOTIFICATION_TRACKER.wsgi:application"]


FROM python:3.11-slim-buster


RUN apt-get update && apt-get install -y curl


WORKDIR /app
ENV PYTHONUNBUFFERED true


COPY . .


COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt


EXPOSE 8080


CMD ["gunicorn", "--bind", "0.0.0.0:8080", "JAM_AGENT_NOTIFICATION_TRACKER.wsgi:application"]
