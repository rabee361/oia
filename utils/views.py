from django.views import View
from django.views.generic import ListView
from .mixins import CustomLoginRequiredMixin

class BaseView(View):
    pass


class CustomListView(ListView, CustomLoginRequiredMixin):
    def get_queryset(self):
        return super().get_queryset().filter(merchant=self.request.tenant)