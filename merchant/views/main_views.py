
from multiprocessing import get_context
from django.http.response import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView, ListView
from django.views import View
from django.contrib.auth import login, logout
from django.contrib import messages
from utils.views import CustomListView
from ..forms import *
from ..models import *
from django.db import transaction
from accounts.tasks import send_otp_task
from utils.email import send_otp_email
from utils.types import UserType
from django.contrib.auth import get_user_model
User = get_user_model()
import json
from datetime import timedelta
from django.utils import timezone


class MainView(View):
    def get(self, request):
        domain = request.get_host()
        slug = domain.split('.')[0]
        if slug == 'localhost' or slug =='oiastores':
            slug = 'store'
        store = get_object_or_404(Store, domain=slug)
        theme = Theme.objects.get(id=store.theme.theme.id)
        products = Product.objects.filter(merchant=store.merchant)
        categories = ProductCategory.objects
        store = get_object_or_404(Store, domain=slug)
        theme = Theme.objects.get(id=store.theme.theme.id)
        products = Product.objects.filter(merchant=store.merchant)
        categories = ProductCategory.objects.filter(merchant=store.merchant)
        feature_products = Product.objects.filter(merchant=store.merchant)

        context = {
            'store': store,
            'theme': theme,
            'products': products,
            'categories': categories,
            'feature_products': feature_products,
        }

        return render(request, f'main/{theme.slug}/main.html',context)