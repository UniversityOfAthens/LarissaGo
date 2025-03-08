from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    points = models.IntegerField(default=0)

class Activity(models.Model):
    points = models.IntegerField(default=1, verbose_name="Points")
    title = models.CharField(max_length=255, blank=False, verbose_name="Title")
    description = models.TextField(blank=True, verbose_name="Description")
    completed_by = models.ManyToManyField(
        "api.CustomUser", 
        verbose_name="Users who completed it", 
        blank=True,
    )
    image = models.ImageField(upload_to='activities/', blank=True, null=True)
    time_hours = models.IntegerField(default=0, verbose_name="Time (hours)")
    weather = models.IntegerField(default=0, verbose_name="Weather Indication")
    star_rating = models.FloatField(default=0.0, verbose_name="Star Rating")
    def __str__(self):
        return self.title

class Reward(models.Model):
    title = models.CharField(max_length=255)
    points_needed = models.IntegerField(default=0, help_text="Points required to redeem this reward")
    redeemed_by = models.ManyToManyField(
        "api.CustomUser",
        blank=True,
        related_name="redeemed_rewards",
        help_text="Users who have redeemed this reward"
    )

    def __str__(self):
        return self.title