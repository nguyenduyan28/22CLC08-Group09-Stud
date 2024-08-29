from django.shortcuts import render, redirect
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from .forms import RoomForm
from account.models import  Profile
from room.views import generate_invite_link
from room.models import Room
import uuid
# Create your views here.


def home(request):
  return render(request, "mainpage/Home.html")


def yourroom(request):
  return render(request, "mainpage/YourRoom.html")

def contact(request):
  return render(request, "mainpage/Contact.html")

def explore(request):
  return render(request, "mainpage/Explore.html")

# hope is right
def createroom(request):
  if (request.method == 'POST'):
    if not request.user.is_authenticated:
      return redirect('login')
    form = RoomForm(request.POST)
    if form.is_valid():
      profileHost = Profile.objects.get(id=request.user.id)
      profileHost.role = Profile.HOST
      profileHost.save()
      room = Room.objects.create(roomName = form.cleaned_data['roomName'], roomDesc = form.cleaned_data['roomDesc'], roomHost=profileHost)
      room.roomName = form.cleaned_data['roomName']
      room.roomDesc = form.cleaned_data['roomDesc']
      room.roomHost = profileHost
      room.members.add(profileHost)
      invite_link = generate_invite_link(request, room)
      room.invite_token = uuid.uuid4()
      print(room.invite_token)
      print(f"Invite link: {invite_link}") 
      room.save()
      print("Success")
      return redirect(f'../room/yourroom/{room.invite_token}')
    else : print(form)
  elif request.method == 'GET':
    form = RoomForm()
  
  return render(request, "mainpage/CreateRoom.html", {'form': form})














