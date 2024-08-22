from django.shortcuts import render, redirect
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from .forms import RoomForm
from account.models import  Profile
# Create your views here.


def home(request):
  return render(request, "mainpage/Home.html")


def yourroom(request):
  return render(request, "mainpage/YourRoom.html")

def contact(request):
  return render(request, "mainpage/Contact.html")

def explore(request):
  return render(request, "mainpage/Explore.html")


def createroom(request):
  if (request.method == 'POST'):
    if not request.user.is_authenticated:
      return redirect('login')
    form = RoomForm(request.POST)
    if form.is_valid():
      room = form.save(commit=False)
      profileHost = Profile.objects.get(id=request.user.id)
      room.roomHost = profileHost
      room.save()
      print("Success")
      return redirect('home')
    else : print(form)
  elif request.method == 'GET':
    form = RoomForm()
  
  return render(request, "mainpage/CreateRoom.html", {'form': form})