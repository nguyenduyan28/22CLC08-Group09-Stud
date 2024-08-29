from django.shortcuts import render, redirect, get_object_or_404
from .forms import ImageForm
from .models import Image
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from .models import Room, JoinRequest
from account.models import Profile

# Create your views here.
@login_required
def yourroom(request, invite_token):
    room = get_object_or_404(Room, invite_token=invite_token)
    profile = request.user.profile
    if profile == room.roomHost:
        joinRequest = JoinRequest.objects.filter(room=room)
        if joinRequest:
            return redirect(f'../../room_access_view/{invite_token}/manage_requests')

    if profile not in room.members.all():
        return redirect(f'../../room_access_view/{invite_token}')
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            image  = form.save(commit=False)
            image.room = room
            image.save()
            return redirect(f'../{invite_token}')
    elif request.method == 'GET':
        form = ImageForm()
    images = room.image_set.all()
    return render(request, "room/YourRoom.html", {'images': images, 'form': form})
def yourroom1(request):
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            image  = form.save(commit=False)
            image.save()
            return redirect('yourroom')
    elif request.method == 'GET':
        form = ImageForm()
    images = Image.objects.all()
    return render(request, "room/YourRoom.html", {'images': images, 'form': form})
def upload_image(request):
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('image_list')
    elif request.method == 'GET':
        form = ImageForm()
    return render(request, 'room/upload_image.html', {'form': form})

def image_list(request):
    if request.method == 'POST':
        image_id = request.POST.get('image_id')
        Image.objects.filter(id=image_id).delete()
    images = Image.objects.all()
    return render(request, 'room/image_list.html', {'images': images})

def delete_image(request, image_id):
    image = get_object_or_404(Image, id=image_id)
    if request.method == 'POST':
        image.delete()
        return redirect('image_list')
    return render(request, 'confirm_delete.html', {'image': image})

from django.urls import reverse

def generate_invite_link(request, room):
    base_url =  get_current_site(request).domain

    invite_url = reverse('join_room', args=[room.invite_token])
    return f"{base_url}{invite_url}"
def join_room(request, invite_token):
    room = get_object_or_404(Room, invite_token=invite_token)
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            image  = form.save(commit=False)
            image.room = room
            image.save()
            return redirect('yourroom')
    elif request.method == 'GET':
        form = ImageForm()
    # Additional logic to allow full interaction
    images = room.image_set.all()
    return render(request, 'room/YourRoom.html', {'form': form, 'mode': 'view' , 'image' : images})

def view_room(request, invite_token):
    room = get_object_or_404(Room, invite_token=invite_token)

    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            image  = form.save(commit=False)
            image.room = room
            image.save()
            return redirect('yourroom')
    elif request.method == 'GET':
        form = ImageForm()
    images = room.image_set.all()
    return render(request, 'room/YourRoom.html', {'form': form, 'mode': 'view' , 'image' : images})
def login(request):
  return render(request, "room/Login.html")

@login_required
def listroom(request):
    profile = Profile.objects.get(user=request.user)
    room = profile.hosted_rooms.all()
    return render(request, "room/listroom.html", {'room': room})
    
from django.contrib import messages

@login_required
def room_access_view(request, invite_token):
    room = get_object_or_404(Room, invite_token=invite_token)
    profile = request.user.profile

    
    join_request = JoinRequest.objects.filter(profile=profile, room=room).first()

    if request.method == 'POST':
        if not join_request:
            JoinRequest.objects.create(profile=profile, room=room)
            messages.info(room.roomHost.user, f'{profile.user.username} has requested to join your room "{room.roomName}".')
            return redirect('room_access_view', invite_token=room.invite_token)

    return render(request, 'room/request_join_room.html', {'room': room, 'join_request': join_request})
#
@login_required
def manage_join_requests(request, invite_token):
    room = get_object_or_404(Room, invite_token=invite_token)
    
    # Ensure only the host can manage requests
    if room.roomHost != request.user.profile:
        return redirect('some_error_view')

    join_requests = JoinRequest.objects.filter(room=room, is_approved=False)

    if request.method == 'POST':
        request_id = request.POST.get('request_id')
        action = request.POST.get('action')
        join_request = get_object_or_404(JoinRequest, id=request_id)

        if action == 'approve':
            room.members.add(join_request.profile)
            join_request.is_approved = True
            join_request.save()
        elif action == 'deny':
            join_request.delete()

        join_request.delete()
        return redirect('manage_join_requests', invite_token=room.invite_token)

    return render(request, 'room/manage_requests.html', {'room': room, 'join_requests': join_requests})
