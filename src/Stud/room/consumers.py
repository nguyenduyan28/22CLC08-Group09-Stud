import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room, Message
class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        # chứa thông tin của url_route vào kwargs sau đó truy cập giá trị của tham số room_name đến kwargs
        self.room_name = f"room_{self.scope['url_route']['kwargs']['room_name']}" #lấy tên phòng và thiết lập phòng mới cho consumer
        await self.channel_layer.group_add(self.room_name, self.channel_name) # thêm consumer vào phòng
        await self.accept() # chấp nhận yêu cầu từ Websocket

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name) # xóa consumer khi kết nối bị ngắt

    async def receive(self, text_data):
      text_data_json = json.loads(text_data)
      message = text_data_json
      # print(message) 
      event = {
          'type' : 'send_message',
          'message' : message,
      }
      await self.channel_layer.group_send(self.room_name, event)

    async def send_message(self, event):
        data = event['message']
        await self.create_message(data=data)
        response_data = {
            'sender': data['sender'],
            'message': data['message']
        }
        await self.send(text_data=json.dumps({'message': response_data}))

    @database_sync_to_async
    def create_message(self, data):
        get_room_by_name = Room.objects.get(roomName=data['room_name'])
        if not Message.objects.filter(message=data['message']).exists():
            new_message = Message(room=get_room_by_name, sender=data['sender'], message=data['message'])
            new_message.save()