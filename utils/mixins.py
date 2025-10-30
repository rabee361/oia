from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse



class MerchantLoginRequiredMixin(LoginRequiredMixin):
    """
    Custom login required mixin that redirects to the named 'merchant-login' URL
    """

    def get_login_url(self):
        """
        Return the URL to redirect to when login is required.
        Uses reverse('merchant-login') to get the login URL dynamically.
        """
        return reverse('merchant-login')



class AdminLoginRequiredMixin(UserPassesTestMixin):
    """
    Mixin that requires user to be authenticated and have ADMIN user_type.
    Redirects to login page if not authenticated or not an admin.
    """

    def test_func(self):
        """
        Test if user is authenticated and is an admin
        """
        return (
            self.request.user.is_authenticated and
            hasattr(self.request.user, 'user_type') and
            self.request.user.user_type == 'ADMIN'
        )

    def get_login_url(self):
        """
        Return the URL to redirect to when login is required.
        Uses reverse('merchant-login') to get the login URL dynamically.
        """
        return reverse('merchant-login')