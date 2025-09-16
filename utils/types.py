from django.db import models
from django.utils.translation import gettext_lazy as _


class UserType(models.TextChoices):
    CUSTOMER = 'customer'
    MERCHANT = 'merchant'
    ADMIN = 'admin'

class CodeTypes(models.TextChoices):
    SIGNUP = 'SIGNUP'
    RESET_PASSWORD = 'RESET_PASSWORD'
    FORGET_PASSWORD = 'FORGET_PASSWORD'

class BusinessTypes(models.TextChoices):
    FASHION = 'fashion'
    ELECTRONICS = 'electronics'
    FOOD = 'food'
    BOOKS = 'books'
    HOME = 'home'
    BEAUTY = 'beauty'
    SPORTS = 'sports'
    TOYS = 'toys'

class StoreTypes(models.TextChoices): 
    RETAIL = 'retail'
    WHOLESALE = 'wholesale'
    MANUFACTURING = 'manufacturing'
    SERVICES = 'services'
    DIGITAL = 'digital'

class PaymentMethods(models.TextChoices):
    CASH = 'cash'
    CREDIT_CARD = 'credit_card'
    PAYPAL = 'paypal'
    APPLE_PAY = 'apple_pay'
    GOOGLE_PAY = 'google_pay'
    BANK_TRANSFER = 'bank_transfer'
    OTHER = 'other'

class OrderStatus(models.TextChoices):
    PENDING = 'pending'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

class PlanChoices(models.TextChoices):
    ANNUAL = 'annual'
    MONTHLY = 'monthly'

class DiscountTypes(models.TextChoices):
    PERCENT = 'percent'
    FIXED = 'fixed'
    FREE_SHIPPING = 'free_shipping'
