# Generated by Django 5.1.6 on 2025-03-08 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_reward"),
    ]

    operations = [
        migrations.AddField(
            model_name="activity",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="activities/"),
        ),
        migrations.AddField(
            model_name="activity",
            name="star_rating",
            field=models.FloatField(default=0.0, verbose_name="Star Rating"),
        ),
        migrations.AddField(
            model_name="activity",
            name="time_hours",
            field=models.IntegerField(default=0, verbose_name="Time (hours)"),
        ),
        migrations.AddField(
            model_name="activity",
            name="weather",
            field=models.IntegerField(default=0, verbose_name="Weather Indication"),
        ),
    ]
