from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            username = body.get('username')
            email = body.get('email')
            password = body.get('password')
            # Add basic validations
            if not username or not password:
                return JsonResponse({'detail': 'Username and password are required.'}, status=400)

            # Create user
            user = User.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'detail': 'User created successfully.'}, status=201)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=400)
    else:
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)
