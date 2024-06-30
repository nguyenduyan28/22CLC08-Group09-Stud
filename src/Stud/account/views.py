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

    return render(request, "account/signup.html")
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
            return render(request, "account/index.html", {'name': name})
        else:
            messages.error(request, "Wrong username/password")
            return redirect('signin')
    else:
        return render(request, 'account/signin.html')
def signout(request):
    logout(request)
    #messages.success(request, "Loged out successfully!")
    return redirect('home')
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