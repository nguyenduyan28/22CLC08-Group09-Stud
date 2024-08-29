from django.db import models
from account.models import Profile
from django.db.models import JSONField
from datetime import timedelta
from django.utils import timezone
import uuid
# Create your models here.
class Image(models.Model):
  title = models.CharField(max_length=100)
  image = models.ImageField(upload_to='images/')
  upload_at = models.DateTimeField(auto_now_add=True)

  def __str__ (self):
    return self.title

class Room(models.Model):
  roomName = models.TextField(max_length=50)
  roomDesc = models.TextField(max_length=300)
  roomHost = models.ForeignKey(Profile, on_delete=models.CASCADE)
  # invite_token = models.CharField(max_length=36, blank=True, null=True, unique=True  ,default=uuid.uuid4())

  def __str__(self):
    return self.roomName
  

class tracking_time(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now) 
    total_time = models.DurationField(default=timedelta(0)) 
    num_sessions = models.IntegerField(default=0) 

    def __str__(self):
        return f"User: {self.user.username}, Total Time: {self.total_time}, Sessions: {self.num_sessions}"
    


class note(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    note_content = models.TextField(blank=True, null=True)
    todos = JSONField(default=list)  


