# workflows/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.get_users),
    path('create_user/', views.create_user),
    path('workflows/', views.get_workflows),
    path('create_workflow/', views.create_workflow),
]
