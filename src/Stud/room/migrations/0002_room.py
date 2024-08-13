# Generated by Django 4.2.13 on 2024-07-19 17:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_profile_role'),
        ('room', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('roomName', models.CharField(max_length=100)),
                ('roomPrivacy', models.CharField(choices=[('PR', 'private'), ('PB', 'public')], default='PB', max_length=10)),
                ('hostId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.profile')),
            ],
        ),
    ]