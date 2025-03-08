from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views import signup, MyAccountView, ActivityListView, ActivityDetailView, RewardListView, RedeemRewardView

urlpatterns = [
    path('admin/', admin.site.urls),
    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Signup endpoint
    path('api/signup/', signup, name='signup'),
    path('api/my-account/', MyAccountView.as_view(), name='my-account'),
    path('api/activities/', ActivityListView.as_view(), name='activities'),
    path('api/activities/<int:pk>/', ActivityDetailView.as_view(), name='activity-detail'),
    path('api/rewards/', RewardListView.as_view(), name='rewards'),
    path('api/rewards/<int:pk>/', RedeemRewardView.as_view(), name='reward-redeem'),
]
