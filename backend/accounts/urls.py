# accounts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterUser.as_view(), name='register'),
    path('login/', views.LoginUser.as_view(), name='login'),
    path('admin/create_user/', views.AdminCreateUser.as_view(), name='create_user'),
]
