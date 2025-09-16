from django.contrib import admin
from django.contrib.auth import get_user_model
from .forms import CustomUserChangeForm, CustomUserCreationForm
from django.contrib.auth.admin import UserAdmin
from .models import *
User = get_user_model()


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ['email', 'user_type']
    list_filter = ['user_type']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('user_type',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('user_type',)}),
    )


class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ['email', 'code', 'createdAt', 'expiresAt', 'code_type', 'is_used']
    list_filter = ['code_type', 'is_used']


class MerchantAdmin(admin.ModelAdmin):
    list_display = ['user']


class CustomerAdmin(admin.ModelAdmin):
    list_display = ['merchant','user']

 

admin.site.register(User, CustomUserAdmin)
admin.site.register(OTPCode, OTPCodeAdmin)
admin.site.register(Merchant, MerchantAdmin)
admin.site.register(Customer, CustomerAdmin)