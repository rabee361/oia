from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from django.views.i18n import set_language

urlpatterns = [
    path("supersecureadmin/", admin.site.urls),
    path("merchant/", include("merchant.urls")),
    path("dashboard/", include("dashboard.urls")),
    path("accounts/", include("accounts.urls")),
    path("api/", include("api.urls")),
    path("404/", page_not_found , name="404"),
    path("500/", server_error , name="500"),
    path('set_language/', set_language, name='set_language'),
]

# 📁 Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
