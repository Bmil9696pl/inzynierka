from __future__ import absolute_import, unicode_literals
from selenium import webdriver
from celery import shared_task
import selenium.webdriver.common.keys
from selenium.webdriver.support.ui import Select
import time
from datetime import datetime, date, timedelta
import os
import django


from data.models import HistoricalData

def get_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    options.add_argument("disable-infobars")
    options.add_argument("start-maximized")
    options.add_argument("disable-dev-shm-usage")
    options.add_argument("no-sandbox")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_argument("disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(options=options)
    driver.get("https://goldenmark.com/pl/mysaver/ceny-zlota/")
    return driver

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

@shared_task
def updateHistoricalData():
    #with open("dane_historyczne.txt", "r") as file:
    #    lines = file.readlines()
    #    if lines:
    #        lastLine = lines[-1].strip()
    
    lastData = HistoricalData.objects.latest('date')

    driver = get_driver()
    ##time.sleep(5)
    dates = ["27", "28"]
    driver.find_element("xpath", '/html/body/div/main/div/div/div/div[2]/div/div[1]/div[1]/div[3]/a').click()
    driver.find_element("xpath", '/html/body/div/main/div/div/div/div[2]/div/div[1]/div[1]/div[3]/ul/li[3]/a').click()
    start_date = lastData.date
    print(start_date)
    end_date = date.today()
    driver.find_element("xpath", "/html/body/div/main/div/div/div/div[2]/div/div[2]/div[3]/div[1]/input").send_keys("18", "03", "22014", selenium.webdriver.common.keys.Keys.ARROW_LEFT, selenium.webdriver.common.keys.Keys.ARROW_LEFT, "18", "03")
    time.sleep(10)
    first = True
    #file = open("dane_historyczne.txt", "a")
    for single_date in daterange(start_date, end_date):
        day = single_date.strftime("%d-%m-%Y").split("-")[0]
        month = single_date.strftime("%d-%m-%Y").split("-")[1]
        year = single_date.strftime("%d-%m-%Y").split("-")[2]
        date_element = driver.find_element("xpath", "/html/body/div/main/div/div/div/div[2]/div/div[2]/div[3]/div[2]/input").send_keys("" + day, "" + month, "2" + year, selenium.webdriver.common.keys.Keys.ARROW_LEFT, selenium.webdriver.common.keys.Keys.ARROW_LEFT, "" + day, "" + month, selenium.webdriver.common.keys.Keys.ARROW_LEFT, selenium.webdriver.common.keys.Keys.ARROW_LEFT)
        time.sleep(5)
        element = driver.find_element("xpath", "/html/body/div/main/div/div/div/div[2]/div/div[1]/div[2]/span[1]/span[2]")
        scrapedData = element.text[:-1] + "a"
        scrapedData = scrapedData.replace(" ", ";")
        scrapedData = scrapedData.replace(",", ".")
        scrapedData = single_date.strftime("%Y-%m-%d") + ";" + scrapedData
        if(first):
            first = False
        else:
            #file.write("\n" + single_date.strftime("%Y-%m-%d") + ";" + scrapedData)
            parts = scrapedData.strip().split(";")
            if(parts[1] != "-"):
                dateVar, value, unit = parts
                data = HistoricalData(date = dateVar, value = value, unit = unit)
                data.save()
    driver.close()