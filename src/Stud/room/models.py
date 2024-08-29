from django.db import models
from account.models import Profile
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
  start_time = models.DateTimeField()
  end_time = models.DateTimeField(null=True, blank=True)

  def duration(self):
      if self.end_time:
          return self.end_time - self.start_time
      return None

  def __str__(self):
      return f"User: {self.user.username}, Start: {self.start_time}, End: {self.end_time}"