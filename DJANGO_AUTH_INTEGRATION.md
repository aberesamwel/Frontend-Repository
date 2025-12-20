# Django Authentication Integration

Your app uses **Django REST API** with **PostgreSQL**. Here's how to add authentication to your existing Django backend:

## 1. Django Models (add to your models.py):

```python
from django.contrib.auth.models import AbstractUser
from django.db import models
import pyotp

class User(AbstractUser):
    two_factor_secret = models.CharField(max_length=32, blank=True, null=True)
    two_factor_enabled = models.BooleanField(default=False)
    login_attempts = models.IntegerField(default=0)
    lock_until = models.DateTimeField(blank=True, null=True)
    reset_password_token = models.CharField(max_length=64, blank=True, null=True)
    reset_password_expires = models.DateTimeField(blank=True, null=True)

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('LOGIN_SUCCESS', 'Login Success'),
        ('LOGIN_FAILED', 'Login Failed'),
        ('PASSWORD_RESET_REQUEST', 'Password Reset Request'),
        ('PASSWORD_RESET_COMPLETE', 'Password Reset Complete'),
        ('PASSWORD_CHANGE', 'Password Change'),
        ('2FA_VERIFY_SUCCESS', '2FA Verify Success'),
        ('2FA_VERIFY_FAILED', '2FA Verify Failed'),
        ('LOGOUT', 'Logout'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
```

## 2. Django Views (add to your views.py):

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
import qrcode
from io import BytesIO
import base64

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    two_factor_code = request.data.get('twoFactorCode')
    
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=401)
    
    if user.two_factor_enabled and not two_factor_code:
        return Response({'requiresTwoFactor': True})
    
    if user.two_factor_enabled:
        totp = pyotp.TOTP(user.two_factor_secret)
        if not totp.verify(two_factor_code):
            return Response({'error': 'Invalid 2FA code'}, status=401)
    
    refresh = RefreshToken.for_user(user)
    return Response({
        'token': str(refresh.access_token),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'twoFactorEnabled': user.two_factor_enabled
        }
    })
```

## 3. Update your Django settings.py:

```python
INSTALLED_APPS = [
    # ... your existing apps
    'rest_framework',
    'rest_framework_simplejwt',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

## 4. Install required packages:

```bash
pip install djangorestframework-simplejwt pyotp qrcode pillow
```

## 5. Update frontend .env:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

Your existing Django backend with PostgreSQL is the right choice. The authentication system I created works perfectly with your setup!