from django.db import models
from account.models import Profile
import uuid 
# Create your models here.
class Room(models.Model):
  roomName = models.TextField(max_length=50)
  roomDesc = models.TextField(max_length=300)
  roomHost = models.ForeignKey(Profile, on_delete=models.CASCADE)
  invite_token = models.CharField(max_length=50, blank=True, null=True, unique=True, default=None)

  def __str__(self):
    return self.roomName
class Image(models.Model):
  title = models.CharField(max_length=100)
  image = models.ImageField(upload_to='images/')
  room = models.ForeignKey(Room, on_delete=models.CASCADE, default=None, null=True)
  upload_at = models.DateTimeField(auto_now_add=True)

  def __str__ (self):
    return self.title