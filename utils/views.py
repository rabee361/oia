from django.views import View
from django.views.generic import ListView
from .mixins import MerchantLoginRequiredMixin

class BaseView(MerchantLoginRequiredMixin, View):
    pass


class CustomListView(ListView, MerchantLoginRequiredMixin):
    def get_queryset(self):
        return super().get_queryset().filter(merchant=self.request.tenant)