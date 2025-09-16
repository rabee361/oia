from django.urls import path
from . import views

urlpatterns = [
    path("", views.DashboardView.as_view()),
    path("login/" , views.LoginView.as_view() , name="login-admin"),
    path("logout/" , views.LogoutView.as_view() , name="logout-admin"),
    path("change_password/" , views.ChangePasswordView.as_view() , name="change-password-admin"),
] 