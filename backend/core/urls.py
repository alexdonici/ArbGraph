from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token # Funcția magică de Login
from .views import LessonViewSet, RegisterView
from .views import LessonViewSet, RegisterView, UserProgressView
from .views import update_profile, completed_lessons, delete_account

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Rutele pentru autentificare:
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'), # Generează token-ul automat!
    path('progress/', UserProgressView.as_view(), name='progress'),
    path('update-profile/', views.update_profile, name='update_profile'),
    path('completed-lessons/', completed_lessons, name='completed_lessons'),
    path('delete-account/', delete_account, name='delete_account'),
]