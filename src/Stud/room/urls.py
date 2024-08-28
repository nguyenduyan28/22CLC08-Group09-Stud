from django.urls import path

from . import views
 

urlpatterns = [
  path("yourroom/<str:invite_token>/", views.yourroom, name='yourroom'),
  path("upload/", views.upload_image),
  path("list", views.image_list, name='image_list'),
  path("login", views.login),
  path('yourroom/<str:invite_token>/join/', views.join_room, name='join_room'),
  path('yourroom/<str:invite_token>/view/', views.view_room, name='view_room'),
  path("yourroom", views.yourroom, name='yr'),
]