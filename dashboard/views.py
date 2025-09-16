from django.shortcuts import render
from django.views.generic import TemplateView
from django.views import View


class DashboardView(TemplateView):
    template_name = 'admin/dashboard.html'

class LoginView(View):
    def get(self, request):
        context = {}
        return render(request, "admin/login.html" , context)
    
    def post(self, request):
        context = {}
        return render(request, "admin/login.html" , context)

class LogoutView(View):
    def get(self, request):
        context = {}
        return render(request, "admin/login.html" , context)
    
    def post(self, request):
        context = {}
        return render(request, "admin/login.html" , context)
    
class ChangePasswordView(View):
    def get(self, request):
        context = {}
        return render(request, "admin/login.html" , context)
    
    def post(self, request):
        context = {}
        return render(request, "admin/login.html" , context)
    