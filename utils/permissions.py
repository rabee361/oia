

class IsMerchant:
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'MERCHANT'

class IsCustomer:
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'CUSTOMER'
    
class IsAdmin:
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'ADMIN'
