from django.db import models

# Create your models here.
class HistoricalData(models.Model):
    date = models.DateField()
    value = models.FloatField()
    unit = models.CharField(max_length=10)