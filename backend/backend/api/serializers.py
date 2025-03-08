from rest_framework import serializers
from api.models import CustomUser, Activity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'points']

class ActivitySerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()
    class Meta:
        model = Activity
        fields = '__all__'
    
    def get_completed(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return request.user in obj.completed_by.all()
        return False