from __future__ import absolute_import, unicode_literals
from selenium import webdriver
from celery import shared_task
import selenium.webdriver.common.keys
from selenium.webdriver.support.ui import Select
import time
from datetime import datetime, date, timedelta
import os
import django

from data.models import DailyData

def get_driver(url):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    options.add_argument("disable-infobars")
    options.add_argument("start-maximized")
    options.add_argument("disable-dev-shm-usage")
    options.add_argument("no-sandbox")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_argument("disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(options=options)
    #driver.get("https://goldenmark.com/pl/mysaver/ceny-zlota/")
    driver.get(url)
    
    return driver

@shared_task
def updateDailyData():
    if(DailyData.objects.count() > 288):
        DailyData.objects.all()[0].delete()
    
    goldDriver = get_driver("https://goldenmark.com/pl/mysaver/ceny-zlota/")
    dollarDriver = get_driver("https://internetowykantor.pl/kurs-dolara/")
    goldDriver.find_element("xpath", '/html/body/div/main/div/div/div/div[2]/div/div[1]/div[1]/div[3]/a').click()
    goldDriver.find_element("xpath", '/html/body/div/main/div/div/div/div[2]/div/div[1]/div[1]/div[3]/ul/li[3]/a').click()
    goldDriver.find_element("xpath", "/html/body/div/main/div/div/div/div[2]/div/div[2]/div[2]/div/a[1]").click()
    time.sleep(10)
    element = goldDriver.find_element("xpath", "/html/body/div/main/div/div/div/div[2]/div/div[1]/div[2]/span[1]/span[2]")
    scrapedData = element.text[:-1] + "a"
    scrapedData = scrapedData.replace(" ", ";")
    scrapedData = scrapedData.replace(",", ".")

    element = dollarDriver.find_element("xpath", '/html/body/div/div[1]/div[2]/div[3]/div[1]/div[2]/div[3]/span[2]')
    scrapedData = scrapedData + ";" + element.text.replace(",", ".")
    parts = scrapedData.strip().split(";")
    goldValue, unit, dollarRate = parts
    print("dupa sraka es")
    data = DailyData(date = datetime.now(), goldValue = goldValue, unit = unit, dollarRate = dollarRate)
    data.save()