from django.urls import path

from . import views
 

urlpatterns = [
  path("yourroom", views.yourroom, name='yourroom'),
  path("upload/", views.upload_image),
  path("list", views.image_list, name='image_list'),
  path("login", views.login)
]