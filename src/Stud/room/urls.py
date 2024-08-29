from django.urls import path

from . import views
 

urlpatterns = [
  path("yourroom", views.yourroom, name='yourroom'),
  path("upload/", views.upload_image),
  path("list", views.image_list, name='image_list'),
  path("login", views.login),
  path('join-room/<str:invite_token>/', views.joinroom, name='join_room'),
  path('start_timer/', views.start_timer, name='start_timer'),
  path('end_timer/', views.end_timer, name='end_timer'),
  path('update_tracking/', views.update_tracking, name='update_tracking'),
  path('view_achievement/', views.view_achievement, name = 'view_achievement'),
]