from django.db import models
from account.models import Profile
import uuid 
# Create your models here.
class Room(models.Model):
  roomName = models.TextField(max_length=50)
  roomDesc = models.TextField(max_length=300)
  roomHost = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='hosted_rooms')
  invite_token = models.CharField(max_length=50, blank=True, null=True, unique=True, default=None)
  members = models.ManyToManyField(Profile, related_name='joined_rooms', blank=True)
  def __str__(self):
    return self.roomName



class JoinRequest(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    request_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username} - {self.room.roomName}"
class Image(models.Model):
  title = models.CharField(max_length=100)
  image = models.ImageField(upload_to='images/')
  room = models.ForeignKey(Room, on_delete=models.CASCADE, default=None, null=True)
  upload_at = models.DateTimeField(auto_now_add=True)

  def __str__ (self):
    return self.title

class Message(models.Model):
    # dung 1 khoa ngoai de lien ket message voi room, neu room bi xoa thi cac message cung se bi xoa
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    sender = models.CharField(max_length=255)
    message = models.TextField()
