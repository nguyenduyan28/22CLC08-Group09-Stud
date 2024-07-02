from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from account.models import Profile
# Create your views here.

def home(request):
  return render(request, "mainpage/Home.html")

@login_required
def yourroom(request):
  return render(request, "mainpage/YourRoom.html")