from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('authenticate', Authentication, basename='authenticate')
router.register('cameras', Cameras, basename='cameras')
router.register('recordinglist', RecordingList, basename='recordinglist')
router.register('recordStream', RecordStream, basename='recordStream')

urlpatterns = router.urls
# urlpatterns = [

#     path('', home)
# ]