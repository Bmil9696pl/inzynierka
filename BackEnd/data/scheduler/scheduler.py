from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from django.utils import timezone
from django_apscheduler.models import DjangoJobExecution
import sys
from apscheduler.schedulers.base import *
from apscheduler.triggers.interval import IntervalTrigger
from ..updateDailyData import updateDailyData
from ..updateHistoricalData import updateHistoricalData

def updateDaily():
    updateDailyData()

def updateHistorical():
    updateHistoricalData()

def start():
    scheduler = BackgroundScheduler()
    scheduler.remove_all_jobs() 
    scheduler.add_jobstore(DjangoJobStore(), "default")
    # run this job every 24 hours
    scheduler.add_job(updateDaily, 'interval', minutes=5, name='updateDaily', jobstore='default', replace_existing=True)
    scheduler.add_job(updateHistorical, 'interval', hours=24, name='updateHistorical', jobstore='default', replace_existing=True)
    register_events(scheduler)
    scheduler.start()
    print("Scheduler started...", file=sys.stdout)