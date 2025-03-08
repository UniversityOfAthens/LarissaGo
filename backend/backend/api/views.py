from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, ActivitySerializer
from api.models import CustomUser, Activity
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            username = body.get('username')
            email = body.get('email')
            points = 0
            password = body.get('password')
            # Add basic validations
            if not username or not password:
                return JsonResponse({'detail': 'Username and password are required.'}, status=400)

            # Create user
            user = CustomUser.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'detail': 'User created successfully.'}, status=201)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=400)
    else:
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)

class MyAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class ActivityListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        activities = Activity.objects.all()
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)