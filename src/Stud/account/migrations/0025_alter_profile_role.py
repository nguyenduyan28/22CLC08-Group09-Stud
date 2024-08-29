# Generated by Django 5.0.7 on 2024-08-29 04:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0024_alter_profile_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='role',
            field=models.TextField(choices=[('AD', 'admin'), ('HO', 'host'), ('LN', 'learner')], default='LN', max_length=10),
        ),
    ]
