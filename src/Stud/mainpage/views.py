from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.


def home(request):
  return render(request, "mainpage/Home.html")


def yourroom(request):
  return render(request, "mainpage/YourRoom.html")