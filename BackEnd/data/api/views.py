from rest_framework import viewsets
from ..models import DailyData, HistoricalData
from .serializers import DailyDataSerializer, HistoricalDataSerializer

class DailyDataViewSet(viewsets.ModelViewSet):
    queryset = DailyData.objects.all()
    serializer_class = DailyDataSerializer


class HistoricalDataViewSet(viewsets.ModelViewSet):
    queryset = HistoricalData.objects.all()
    serializer_class = HistoricalDataSerializer