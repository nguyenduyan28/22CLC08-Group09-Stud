from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
  # room_name là tham số URL để truyền tên phòng cho consumer
  # as_asgi sd daphne server
  # ws/notification/<str:room_name>/ : phương thức của Django
    path('ws/notification/<str:room_name>/', ChatConsumer.as_asgi()),
]