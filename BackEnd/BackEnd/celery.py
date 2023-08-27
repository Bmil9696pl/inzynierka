#from __future__ import absolute_import, unicode_literals
#import os
#from celery import Celery
#from celery.schedules import crontab
#from data.updateHistoricalData import updateHistoricalData
#from data.updateDailyData import updateDailyData
#
##python manage.py makemigrations
##python manage.py migrate
##python manage.py runserver
#
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')
#app = Celery('tasks', broker='sqla+sqlite:///celerydb.sqlite')
#app.conf.update(
#    CELERY_RESULT_BACKEND = 'db+sqlite:///results.sqlite',
##   CELERY_RESULT_BACKEND = 'redis://localhost/0',
##   CELERY_RESULT_BACKEND = 'amqp',
##   CELERY_RESULT_BACKEND = 'mongodb://127.0.0.1:27017/',
#    CELERY_TASK_SERIALIZER = 'json',
#    CELERY_IGNORE_RESULT = False,
#    )
#
#
#@app.on_after_configure.connect
#def setup_periodic_tasks(sender, **kwargs):
#    sender.add_periodic_task(
#        crontab(hour=18, minute=7),
#        updateHistoricalData()
#        )
#    sender.add_periodic_task(
#        crontab(minute='*/5'),
#        updateDailyData()
#    )
#