from django.shortcuts import render, redirect, get_object_or_404
from .forms import ImageForm
from .models import Image
from account.models import AuthUser
# Create your views here.
def yourroom(request):
  images = Image.objects.all()
  return render(request, "room/YourRoom.html", {'images': images})

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


def login(request):
  return render(request, "room/Login.html")