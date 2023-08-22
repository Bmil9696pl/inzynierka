import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')
django.setup()

from data.models import HistoricalData

def transferDataFromFile(path):
    with open(path, 'r') as file:
        lines = file.readlines()

    for line in lines:
        parts = line.strip().split(";")
        if(parts[1] != "-"):
            date, value, unit = parts
            data = HistoricalData(date = date, value = value, unit = unit)
            data.save()

if __name__ == '__main__':
    path = 'C:\\Users\\bartek\\Desktop\\inzynierka\\dane_historyczne.txt'
    transferDataFromFile(path)