# Generated by Django 3.2.12 on 2024-08-23 03:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0019_alter_profile_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='role',
            field=models.TextField(choices=[('AD', 'admin'), ('HO', 'host'), ('LN', 'learner')], default='LN', max_length=10),
        ),
    ]