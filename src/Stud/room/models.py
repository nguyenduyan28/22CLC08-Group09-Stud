from django.db import models
from account.models import Profile
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

  def __str__(self):
    return self.roomName