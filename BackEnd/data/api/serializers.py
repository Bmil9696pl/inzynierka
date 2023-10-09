from rest_framework import serializers
from ..models import DailyData, HistoricalData

class DailyDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyData
        fields = ('date', 'goldValue', 'unit', 'dollarRate')

class HistoricalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalData
        fields = ('date', 'value', 'unit')