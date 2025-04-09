# accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)  # Champ pour déterminer si un utilisateur est admin

    def __str__(self):
        return self.username
