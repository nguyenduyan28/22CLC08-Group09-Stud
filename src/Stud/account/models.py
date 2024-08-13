from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Profile(models.Model):
  LEARNER = "LN"
  ADMIN = "AD"
  HOST = "HO"
  ROLES_CHOICE = {
    (LEARNER , "learner"),
    (HOST , "host"),
    (ADMIN , "admin")
  }
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  role = models.TextField(max_length= 10, choices=ROLES_CHOICE, default=LEARNER)
  bio = models.TextField(blank=True, null=True)
  birthday = models.DateField(blank=True, null=True)
  phone = models.CharField(max_length=20, blank=True, null=True)

  def __str__(self):
    return self.user.username