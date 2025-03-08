from django.contrib import admin
from api.models import CustomUser, Activity, Reward

admin.site.register(CustomUser)
admin.site.register(Activity)
admin.site.register(Reward)