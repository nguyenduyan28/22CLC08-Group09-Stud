# Generated by Django 5.0.7 on 2024-08-28 16:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0013_image_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='room',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='room.room'),
        ),
    ]