from rest_framework import routers
from .views import DailyDataViewSet, HistoricalDataViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'DailyData', DailyDataViewSet)
router.register(r'HistoricalData', HistoricalDataViewSet)

urlpatterns = [
    path('', include(router.urls))
]