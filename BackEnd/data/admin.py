from django.contrib import admin
from .models import HistoricalData
from .models import DailyData

# Register your models here.

admin.site.register(HistoricalData)
admin.site.register(DailyData)