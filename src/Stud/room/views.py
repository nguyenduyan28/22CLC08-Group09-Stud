from django.shortcuts import render, redirect, get_object_or_404
from .forms import ImageForm
from .models import Image
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from .models import Room
from django.http import JsonResponse
import logging
from django.utils import timezone
from .models import tracking_time
from datetime import timedelta
# Create your views here.
@login_required
def yourroom(request):
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
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
    return render(request, 'room/upload_image.html', {'form': form})
    return render(request, 'room/YourRoom.html', {'form': form})

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

def joinroom(request, invite_token):
    room = get_object_or_404(Room, invite_token=invite_token)
    if request.user.is_authenticated:
        return (redirect('yourroom'))

def login(request):
  return render(request, "room/Login.html")



logger = logging.getLogger(__name__)
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from .models import Profile 
@login_required
@csrf_exempt
def start_timer(request):
    if request.method == 'GET':
        user_profile = get_object_or_404(Profile, user=request.user)
        logger.info("start_timer function called")
        entry = tracking_time.objects.create(user=user_profile, start_time=timezone.now())
        return JsonResponse({'entry_id': entry.id, 'start_time': entry.start_time})
        
def end_timer(request):
    if request.method == 'GET':
        entry_id = request.GET.get('entry_id')
        if entry_id:
            entry = get_object_or_404(tracking_time, id = entry_id)
            #user_profile = get_object_or_404(Profile, user=request.user)
            #entry = tracking_time.objects.get(id=entry_id, user=user_profile)
            entry.end_time = timezone.now()
            entry.save()
            return JsonResponse({'entry_id': entry.id, 'end_time': entry.end_time})
        else:
            return JsonResponse({'error': 'entry_id not provided'}, status=400)
        
def view_achievement(request):
    if request.method == 'GET':
        user_profile = get_object_or_404(Profile, user=request.user)
        sessions = tracking_time.objects.filter(user=user_profile)

        total_time = sum((session.duration() for session in sessions if session.duration()), timedelta())
        num_sessions = sessions.count()

        return JsonResponse({
            'total_time': str(total_time),
            'num_sessions': num_sessions
        })