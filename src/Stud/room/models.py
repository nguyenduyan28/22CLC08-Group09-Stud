from django.db import models
from account.models import Profile
# Create your models here.
class Image(models.Model):
  title = models.CharField()
  image = models.ImageField(upload_to='images/')
  upload_at = models.DateTimeField(auto_now_add=True)

  def __str__ (self):
    return self.title
  def save(self, *args, **kwargs):
    if not self.title:
      self.title = f"{self.upload_at}image3232aa"
        

class Room(models.Model):
  PRIVATE = "PR"
  PUBLIC = "PB"
  ROOM_CHOICES = {
    (PRIVATE , "private"),
    (PUBLIC , "public")
  }
  roomName = models.CharField(max_length=100)
  hostId = models.ForeignKey(Profile, on_delete=models.CASCADE)
  roomPrivacy = models.CharField(max_length=10, choices=ROOM_CHOICES, default=PUBLIC,)
