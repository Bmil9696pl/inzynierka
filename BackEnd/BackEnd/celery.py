from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
from data.updateData import updateData

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')
app = Celery('BackEnd')
app.config_from_object('django.conf:settings', namespace='CELERY')


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=18, minute=7),
        updateData()
        )
