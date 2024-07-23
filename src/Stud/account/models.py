from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Profile(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  bio = models.TextField(blank=True, null=True)
  birthday = models.DateField(blank=True, null=True)
  phone = models.CharField(max_length=20, blank=True, null=True)

  def __str__(self):
    return self.user.username
