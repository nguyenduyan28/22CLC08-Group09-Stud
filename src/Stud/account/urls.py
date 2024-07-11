from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="home"),
    path('login/', views.signin, name='signin'),
    path('signup/', views.signup, name = 'signup'),
    path('signout/', views.signout, name = 'signout'),
    path('forgot/', views.forgot, name = 'forgot'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('me', views.me, name="me")
]