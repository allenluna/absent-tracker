FROM python:3.11-slim-buster


RUN apt-get update && apt-get install -y curl


WORKDIR /app
ENV PYTHONUNBUFFERED true


COPY . .


COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt


EXPOSE 8080

# CMD ["python", "JAM_AGENT_NOTIFICATION_TRACKER/manage.py", "runserver", "0.0.0.0:8080"]
# CMD ["gunicorn", "--bind", "0.0.0.0:8080", "JAM_AGENT_NOTIFICATION_TRACKER.wsgi:application"]
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--timeout", "300", "JAM_AGENT_NOTIFICATION_TRACKER.wsgi:application"]
