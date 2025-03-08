from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, ActivitySerializer
from api.models import CustomUser, Activity, Reward
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
    
class ActivityDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            activity = Activity.objects.get(pk=pk)
        except Activity.DoesNotExist:
            return Response({'detail': 'Activity not found.'}, status=404)
        serializer = ActivitySerializer(activity)
        return Response(serializer.data)

    def post(self, request, pk):
        """
        When a user marks an activity complete, we add the activity's points
        to the user's points and optionally record the completion.
        """
        try:
            activity = Activity.objects.get(pk=pk)
        except Activity.DoesNotExist:
            return Response({'detail': 'Activity not found.'}, status=404)
        
        user = request.user
        # Increase user's points by activity.points
        user.points += activity.points
        user.save()
        
        # Optionally record that this user completed the activity.
        # For this, ensure your ManyToMany field in Activity is named (e.g., "completed_by")
        activity.completed_by.add(user)
        activity.save()

        return Response({'detail': 'Activity completed. Points updated.'})
    
class RewardListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rewards = Reward.objects.all()
        data = []
        for reward in rewards:
            can_purchase = request.user.points >= reward.points_needed
            data.append({
                "id": reward.id,
                "title": reward.title,
                "points_needed": reward.points_needed,
                "can_purchase": can_purchase,
                "action": "Redeem" if can_purchase else "Earn more"
            })
        return Response(data)
    
class RedeemRewardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            reward = Reward.objects.get(pk=pk)
        except Reward.DoesNotExist:
            return Response({"detail": "Reward not found."}, status=404)

        user = request.user
        if user.points < reward.points_needed:
            return Response({"detail": "Not enough points to redeem this reward."}, status=400)
        
        user.points -= reward.points_needed
        user.save()

        reward.redeemed_by.add(user)
        reward.save()
        return Response({"detail": "Reward redeemed successfully."})
