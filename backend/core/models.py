from django.db import models
from django.contrib.auth.models import User

class Lesson(models.Model):
    # Categoriile posibile pentru o lecție
    CATEGORY_CHOICES = [
        ('TREE', 'Arbori'),
        ('GRAPH', 'Grafuri'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Aici pui teoria explicată (poate conține formatare Markdown/HTML)")
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    order = models.IntegerField(default=1, help_text="Ordinea lecției în meniu (1, 2, 3...)")

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class Exercise(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='exercises', on_delete=models.CASCADE)
    question = models.TextField()
    
    # Variantele noi de răspuns (am pus default ca să nu dea eroare la exercițiile deja create):
    option_a = models.CharField(max_length=255, default='Varianta A')
    option_b = models.CharField(max_length=255, default='Varianta B')
    option_c = models.CharField(max_length=255, default='Varianta C')
    option_d = models.CharField(max_length=255, default='Varianta D')
    
    # Aici vom scrie exact textul variantei corecte (ex: ce scrie la option_a)
    correct_answer = models.CharField(max_length=255) 

    def __str__(self):
        return f"Exercițiu pentru: {self.lesson.title}"
    
class UserProgress(models.Model):
    # Legăm progresul de un utilizator din tabela de conturi
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    # Legăm progresul de o lecție
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    # Salvăm data când a fost finalizată (opțional, dar dă bine)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ne asigurăm că un utilizator nu poate bifa aceeași lecție de două ori în baza de date
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.username} a terminat {self.lesson.title}"