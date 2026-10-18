from rest_framework import serializers
from .models import Lesson, Exercise
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Lesson, Exercise, UserProgress

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']

class LessonSerializer(serializers.ModelSerializer):
    # Împachetăm automat exercițiile în interiorul lecției
    exercises = ExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'category', 'order', 'exercises']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        # Setăm parola ca fiind "write_only" ca să nu fie trimisă înapoi vizibil prin API
        extra_kwargs = {'password': {'write_only': True}}

    # Suprascriem funcția de creare ca să ascundem parola și să îi dăm un token
    def create(self, validated_data):
        # "create_user" criptează parola automat (foarte important pentru securitate)
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        # Imediat ce am creat user-ul, îi generăm un Token VIP
        Token.objects.create(user=user)
        return user
    
class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['lesson', 'completed_at']