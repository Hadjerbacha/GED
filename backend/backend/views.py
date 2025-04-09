# backend/views.py
from rest_framework.views import APIView
from rest_framework.response import Response

class TokenObtainPairView(APIView):
    def get(self, request):
        return Response({"message": "Token obtained successfully"})

class TokenRefreshView(APIView):
    def get(self, request):
        return Response({"message": "Token refreshed successfully"})
