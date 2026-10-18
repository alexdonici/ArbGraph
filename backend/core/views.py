from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Lesson, UserProgress
from .serializers import LessonSerializer, UserSerializer, UserProgressSerializer

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data
    if 'username' in data and data['username'].strip():
        new_username = data['username'].strip()
        if new_username == user.username:
            return Response({"error": "Acesta este deja numele tău de utilizator actual."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.exclude(pk=user.pk).filter(username=new_username).exists():
            return Response({"error": "Acest nume de utilizator este deja folosit."}, status=status.HTTP_400_BAD_REQUEST)
        user.username = new_username
    if 'password' in data and data['password'].strip():
        new_password = data['password'].strip()
        if user.check_password(new_password):
            return Response({"error": "Noua parolă este identică cu cea veche."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
    user.save()
    return Response({"message": "Datele au fost actualizate cu succes!"}, status=status.HTTP_200_OK)

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all().order_by('order')
    serializer_class = LessonSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class UserProgressView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        progress = UserProgress.objects.filter(user=request.user)
        serializer = UserProgressSerializer(progress, many=True)
        return Response(serializer.data)
    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            UserProgress.objects.get_or_create(user=request.user, lesson=lesson)
            return Response({"message": "Progres salvat!"})
        except Lesson.DoesNotExist:
            return Response({"error": "Lecția nu există."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def completed_lessons(request):
    if request.method == 'GET':
        progress = UserProgress.objects.filter(user=request.user).values_list('lesson_id', flat=True)
        return Response(list(progress), status=status.HTTP_200_OK)
    elif request.method == 'POST':
        lesson_id = request.data.get('lesson_id')
        if not lesson_id:
            return Response({"error": "Lipsește lesson_id"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            UserProgress.objects.get_or_create(user=request.user, lesson=lesson)
            return Response({"message": "Progres salvat!"}, status=status.HTTP_201_CREATED)
        except Lesson.DoesNotExist:
            return Response({"error": "Lecția nu există."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response({"message": "Contul a fost șters cu succes."}, status=status.HTTP_200_OK)