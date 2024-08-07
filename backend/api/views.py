from django.shortcuts import render
from django.http import HttpResponse
from django.http import StreamingHttpResponse

from rest_framework import viewsets, permissions
from rest_framework.response import Response
import requests 
import logging
from rest_framework.decorators import action
from urllib.parse import urlencode

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def home(request):
    return HttpResponse("Homepage")

class Authentication(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        api_url = 'https://api.angelcam.com/v1/me/'
        token = request.data.get('token') 
        if not token:
            return Response({'error': 'Token is required'}, status=400)

        headers = {
            'Accept': 'application/json',
            'Authorization': f'PersonalAccessToken {token}'  
        }
        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()  
            data = response.json()  
            logger.info("Parsed response data: %s", data)
            return Response(data)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=500)

class Cameras(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        api_url = 'https://api.angelcam.com/v1/shared-cameras/'
        token = request.data.get('token') 
        if not token:
            return Response({'error': 'Token is required'}, status=400)

        headers = {
            'Accept': 'application/json',
            'Authorization': f'PersonalAccessToken {token}'  
        }
        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()  
            data = response.json()  
            logger.info("Parsed response data: %s", data)
            return Response(data)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=500)         
        
class RecordingList(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        token = request.data.get('token')
        camera_id = request.data.get('cameraId')
        start = request.data.get('start')
        end = request.data.get('end')

        if not token:
            return Response({'error': 'Token is required'}, status=400)

        if not camera_id:
            return Response({'error': 'Camera ID is required'}, status=400)

        if not start or not end:
            return Response({'error': 'Start and end dates are required'}, status=400)


        headers = {
            'Accept': 'application/json',
            'Authorization': f'PersonalAccessToken {token}'  
        }

        query_params = {
            'start': start,
            'end': end
        }
        base_url = f'https://api.angelcam.com/v1/shared-cameras/{camera_id}/recording/timeline/'
        api_url = f'{base_url}?{urlencode(query_params)}'  
        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()  
            data = response.json()  
            logger.info("Parsed response data: %s", data)
            return Response(data)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=500)                    

class RecordStream(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        token = request.data.get('token') 
        camera_id = request.data.get('cameraId') 
        start=request.data.get('start')
        if not token:
            return Response({'error': 'Token is required'}, status=400)
        if not start :
            return Response({'error': 'Start and end dates are required'}, status=400)
        if not camera_id:
            return Response({'error': 'Start and end dates are required'}, status=400)
        query_params = {
            'start': start,
        }
        headers = {
            'Accept': 'application/json',
            'Authorization': f'PersonalAccessToken {token}'  
        }
        base_url = f'https://api.angelcam.com/v1/shared-cameras/{camera_id}/recording/stream'
        api_url = f'{base_url}?{urlencode(query_params)}'  

        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()  
            data = response.json()  
            logger.info("Parsed response data: %s", data)
            return Response(data)
        except requests.exceptions.RequestException as e:
            logger.info("Parsed response data: %s", e)

            return Response({'error': str(e)}, status=500)         
     
