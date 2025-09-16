from django.utils.deprecation import MiddlewareMixin
from .models import Merchant


class TenantMiddleware(MiddlewareMixin):
    """
    Middleware that adds tenant information to the request object.
    
    If the authenticated user is a merchant, sets request.tenant to the merchant ID.
    Otherwise, sets request.tenant to None.
    """
    
    def process_request(self, request):
        # Initialize tenant as None
        request.tenant = None
        
        # Check if user is authenticated
        if hasattr(request, 'user') and request.user.is_authenticated:
            try:
                # Try to get the merchant associated with this user
                merchant = Merchant.objects.get(user=request.user)
                request.tenant = merchant.id
            except Merchant.DoesNotExist:
                # User is not a merchant, tenant remains None
                pass
        
        return None
