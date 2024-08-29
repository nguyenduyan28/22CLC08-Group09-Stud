from django.urls import path

from . import views
 

urlpatterns = [
  path("yourroom/<str:invite_token>/", views.yourroom, name='yourroom'),
  path("upload/", views.upload_image),
  path("list", views.image_list, name='image_list'),
  path("login", views.login),
  path('yourroom/<str:invite_token>/join/', views.join_room, name='join_room'),
  path('yourroom/<str:invite_token>/view/', views.view_room, name='view_room'),
  path("yourroom/", views.listroom, name='yr'),
  path('room_access_view/<str:invite_token>/', views.room_access_view, name='room_access_view'),
  path('room_access_view/<str:invite_token>/manage_requests/', views.manage_join_requests, name='manage_join_requests'),
  path('get_messages/<str:invite_token>', views.get_messages, name='get_messages'),
  # path('listroom/', views.listroom, name='listroom')
  path('join-room/<str:invite_token>/', views.joinroom, name='join_room'),
  path('start_timer/', views.start_timer, name='start_timer'),
  path('end_timer/', views.end_timer, name='end_timer'),
  path('update_tracking/', views.update_tracking, name='update_tracking'),
  path('view_achievement/', views.view_achievement, name = 'view_achievement'),
  path('save_note_and_todo/', views.save_note_and_todo, name = 'save_note_and_todo'),
  path('get_note_and_todo/', views.get_note_and_todo, name = 'get_note_and_todo'),
]