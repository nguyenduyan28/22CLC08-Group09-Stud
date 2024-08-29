from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0007_room'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='invite_token',
            field=models.CharField(blank=True, default=None, max_length=36, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='image',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]

