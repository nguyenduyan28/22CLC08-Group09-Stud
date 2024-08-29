from django.shortcuts import render, redirect, get_object_or_404
from .forms import ImageForm
from .models import Image
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from .models import Room
from account.models import Profile

# Create your views here.
@login_required
def yourroom(request, invite_token):
    room = get_object_or_404(Room, invite_token=invite_token)
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
    # sua cho nay
    #
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
    