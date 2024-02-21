from rest_framework import viewsets
from ..models import DailyData, HistoricalData
from .serializers import DailyDataSerializer, HistoricalDataSerializer
from rest_framework.response import Response

class DailyDataViewSet(viewsets.ModelViewSet):
    queryset = DailyData.objects.all()
    serializer_class = DailyDataSerializer


class HistoricalDataViewSet(viewsets.ModelViewSet):
    queryset = HistoricalData.objects.all()
    serializer_class = HistoricalDataSerializer

    def list(self, request):
        start_date = request.query_params.get('start_date') # wyłuskanie daty początkowej przedziału czasowego
        end_date = request.query_params.get('end_date') # wyłuskanie daty końcowej przedziału czasowego

        queryset = HistoricalData.objects.filter(date__range=[start_date, end_date]) # przefiltrowanie danych wedle podanego przedziału

        serializer = HistoricalDataSerializer(queryset, many=True)
        return Response(serializer.data) # wysładnie danych odczytanych z serializera