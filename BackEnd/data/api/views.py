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
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        queryset = HistoricalData.objects.filter(date__range=[start_date, end_date])

        serializer = HistoricalDataSerializer(queryset, many=True)
        return Response(serializer.data)