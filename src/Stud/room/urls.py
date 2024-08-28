from django.urls import path

from . import views
 

urlpatterns = [
  path("yourroom/<str:invite_token>/", views.yourroom, name='yourroom'),
  path("upload/", views.upload_image),
  path("list", views.image_list, name='image_list'),
  path("login", views.login),
  path('join-room/<str:invite_token>/', views.joinroom, name='join_room'),
  path("yourroom", views.yourroom, name='yr'),
]