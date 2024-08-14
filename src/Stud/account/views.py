from django.shortcuts import redirect, render
#from .forms import LoginForm
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from Stud import settings
from django.core.mail import send_mail, EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.http import HttpResponse, HttpResponseRedirect, HttpRequest
from django.template import loader
from django.contrib.auth.decorators import login_required

from . tokens import generate_token

def index(request):
    return render(request, 'account/index.html')

def signup(request):
    if request.method == "POST":
        username = request.POST['username']
        name = request.POST['name']
        email= request.POST['email']
        password = request.POST['password']
        confirmPassword = request.POST['confirmPassword']

        if password != confirmPassword:
            messages.error(request, "Passwords do not match.")
            return redirect('signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect('signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return redirect('signup')

        if len(username) > 20:
            messages.error(request, "Username must be under 20 characters.")
            return redirect('signup')

        if not username.isalnum():
            messages.error(request, "Username must be letter or number only.")
            return redirect('signup')
        myuser = User.objects.create_user(username, email, password)
        myuser.first_name = name

        myuser.is_active = False

        myuser.save()

        messages.success(request, "Your account has been successfuly created. Please active your account via email.")

        current_site = get_current_site(request)
        email_subject = "Confirm Email!!"
        message2 = render_to_string('account/email_confirmation.html',{
            
            'name': myuser.first_name,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(myuser.pk)),
            'token': generate_token.make_token(myuser)
        })
        email = EmailMessage(
                email_subject,
                message2,
                settings.EMAIL_HOST_USER,
                [myuser.email],
        )
        email.fail_silently = True
        email.send()
        return redirect('signin')

    return render(request, "account/Signup.html")
def signin(request):

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            name = user.first_name
            #messages.success(request, "Sign in successfully!")
            #return render(request, "account/index.html")
            print(request.path_info)
            if ("?next=" in request.get_full_path()):
                return redirect('../../' + request.get_full_path().split('/?next=')[1])
            else:
                return redirect('../../')
        else:
            messages.error(request, "Wrong username/password")
            return redirect('signin')
    else:
        return render(request, 'account/Login.html')
def signout(request):
    logout(request)
    #messages.success(request, "Loged out successfully!")
    return redirect('../../')
# Create your views here.

def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        myuser = User.objects.get(pk=uid)
    except (TypeError,ValueError,OverflowError,User.DoesNotExist):
        myuser = None

    if myuser is not None and generate_token.check_token(myuser,token):
        myuser.is_active = True
        myuser.save()
        login(request,myuser)
        messages.success(request, "Your Account has been activated.")
        return redirect('home')
    else:
        return render(request,'activation_failed.html')

def forgot(request):
    return render(request, 'account/Forgot.html')
@login_required
def me(request):
  user = request.user
  if request.method == 'POST':
    # Handle form submission
    if 'update-info' in request.POST:
      user.username = request.POST.get('username') if request.POST.get('username') is not None else user.username
      if request.POST.get('name') is not None:
        user.first_name = request.POST.get('name').split()[0]
        user.last_name = ' '.join(request.POST.get('name').split()[1:])
      user.email = request.POST.get('email') if request.POST.get('email') is not None else user.email
      user.profile.bio = request.POST.get('bio') if request.POST.get('bio') is not None else user.profile.bio
      birthday = request.POST.get('birthday')
      user.profile.birthday = birthday if birthday else None
      user.profile.phone = request.POST.get('phone') if request.POST.get('phone') is not None else user.profile.phone
      user.profile.save()
      user.save()
      messages.success(request, 'Profile updated successfully.')


    if 'change-password' in request.POST:
      current_password = request.POST.get('current_password')
      new_password = request.POST.get('new_password')
      repeat_new_password = request.POST.get('repeat_new_password')
      if user.check_password(current_password) and new_password == repeat_new_password:
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # Important to keep the user logged in
        messages.success(request, 'Password changed successfully.')
      else:
        messages.error(request, 'Password change failed. Please check the current password and new passwords.')

  context = {
    'username': user.username,
    'name': user.get_full_name(),
    'email': user.email,
    'bio': user.profile.bio,
    'birthday': user.profile.birthday,
    'phone': user.profile.phone,
  }
  return render(request, 'account/User.html', context)