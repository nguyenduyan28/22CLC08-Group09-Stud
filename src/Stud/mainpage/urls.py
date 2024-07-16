from django.urls import path

from . import views
 

urlpatterns = [
  path("", views.home, name="mainpage-home"),
  path("yourroom", views.yourroom)

]