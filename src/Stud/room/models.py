from django.db import models
from account.models import Profile
# Create your models here.
class Image(models.Model):
  title = models.CharField()
  image = models.ImageField(upload_to='images/')
  upload_at = models.DateTimeField(auto_now_add=True)

  def __str__ (self):
    return self.title
