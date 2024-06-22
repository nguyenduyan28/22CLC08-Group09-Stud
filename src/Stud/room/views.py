from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.


def index(request):
  return render(request, "room/Home.html")


def room(request):
  return render(request, "room/YourRoom.html")