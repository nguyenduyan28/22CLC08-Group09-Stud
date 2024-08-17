from django.urls import path

from . import views
 

urlpatterns = [
  path("", views.home),
  path("contact", views.contact, name = 'contact'),
  path("explore", views.explore, name = 'explore'),
  path("createroom", views.createroom, name = 'createroom')
]