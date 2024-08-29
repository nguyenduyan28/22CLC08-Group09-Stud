# Generated by Django 3.2.20 on 2024-08-29 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0032_alter_profile_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='role',
            field=models.TextField(choices=[('LN', 'learner'), ('AD', 'admin'), ('HO', 'host')], default='LN', max_length=10),
        ),
    ]
