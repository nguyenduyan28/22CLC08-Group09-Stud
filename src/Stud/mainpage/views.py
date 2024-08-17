from django.shortcuts import render, redirect
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from .forms import RoomForm
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
    form = RoomForm(request.POST)
    if form.is_valid():
      form.save()
      return redirect('home')
  elif request.method == 'GET':
    form = RoomForm()
  
  return render(request, "mainpage/CreateRoom.html", {'form': form})