from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    points = models.IntegerField(default=0)

class Activity(models.Model):
    points = models.IntegerField(default=1, verbose_name="Points")
    title = models.CharField(max_length=255, blank=False, verbose_name="Title")
    description = models.TextField(blank=True, verbose_name="Description")
    models.ManyToManyField(
        "api.CustomUser", 
        verbose_name="Users who completed it", 
        blank=True,
    )