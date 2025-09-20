from django.db import models
from dashboard.models import *
from accounts.models import *
from django.core.validators import MaxValueValidator, MinValueValidator
from utils.helper import generate_theme_slug
from utils.types import *


class MerchantCurrency(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    parts = models.FloatField()
    parts_name = models.CharField(max_length=10)

class Plan(models.Model):
    name =  models.CharField(max_length=100)
    price =  models.FloatField()
    currnency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    feature1 = models.CharField(max_length=100, null=True, blank=True)
    feature2 = models.CharField(max_length=100, null=True, blank=True)
    feature3 = models.CharField(max_length=100, null=True, blank=True)
    feature4 = models.CharField(max_length=100, null=True, blank=True)
    type = models.CharField(max_length=100, choices=PlanChoices, default=PlanChoices.MONTHLY)

class MerchantPlan(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    expiresAt = models.DateTimeField()

class ProductCategory(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    en_name = models.CharField(max_length=100)
    ar_name = models.CharField(max_length=100)
    en_description = models.TextField(null=True, blank=True)
    ar_description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='products/categories' , null=True, blank=True)
    slug = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.en_name

class Product(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    image1 = models.ImageField(upload_to='images/merchant/products', null=True, blank=True)
    image2 = models.ImageField(upload_to='images/merchant/products', null=True, blank=True)
    image3 = models.ImageField(upload_to='images/merchant/products', null=True, blank=True)
    image4 = models.ImageField(upload_to='images/merchant/products', null=True, blank=True)
    image5 = models.ImageField(upload_to='images/merchant/products', null=True, blank=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    code = models.CharField(max_length=100, null=True, blank=True)
    en_name = models.CharField(max_length=100)
    ar_name = models.CharField(max_length=100, null=True, blank=True)
    barcode = models.CharField(max_length=300, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    short_description = models.CharField(max_length=200, null=True, blank=True)
    shipped = models.BooleanField(default=False)
    tax = models.BooleanField(default=False)
    weight = models.IntegerField(null=True, blank=True)
    weight_unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    cost = models.FloatField(null=True, blank=True)
    cost_currency = models.ForeignKey(MerchantCurrency, on_delete=models.CASCADE)
    max_order_quantity = models.IntegerField(null=True, blank=True)
    min_order_quantity = models.IntegerField(null=True, blank=True)
    displayed = models.BooleanField(default=False)
    price = models.FloatField(null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=100, null=True, blank=True)
    current_quantity = models.IntegerField()
    isActive = models.BooleanField(default=True)
    isDeleted = models.BooleanField(default=False)

    def __str__(self):
        return self.en_name

class ProductFilter(models.Model):
    ar_name  = models.CharField(max_length=255)
    en_name  = models.CharField(max_length=255)
    ar_value  = models.CharField(max_length=255)
    en_value  = models.CharField(max_length=255)

class ProductOption(models.Model):
    ar_name  = models.CharField(max_length=255)
    en_name  = models.CharField(max_length=255)
    ar_value  = models.CharField(max_length=255)
    en_value  = models.CharField(max_length=255)

class CustomerCart(models.Model):
    merchant = models.OneToOneField(Merchant, on_delete=models.CASCADE)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='CustomerCartProduct')
    quantity = models.IntegerField(default=0)

class CustomerCartProduct(models.Model):
    merchant = models.OneToOneField(Merchant, on_delete=models.CASCADE)
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    cart = models.OneToOneField(CustomerCart, on_delete=models.CASCADE)

class Store(models.Model):
    merchant = models.OneToOneField(Merchant, on_delete=models.CASCADE)
    link = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    theme = models.ForeignKey('StoreTheme', on_delete=models.SET_NULL, null=True)
    domain = models.CharField(max_length=100, default="test")

class Theme(models.Model):
    image = models.ImageField(upload_to='theme/images/desktop')
    mobile1 = models.ImageField(upload_to='theme/images/mobile')
    mobile2 = models.ImageField(upload_to='theme/images/mobile')
    mobile3 = models.ImageField(upload_to='theme/images/mobile')
    mobile4 = models.ImageField(upload_to='theme/images/mobile')
    title = models.CharField(max_length=100)
    description = models.TextField()
    designer = models.CharField(max_length=100)
    createdAt = models.DateTimeField(auto_now_add=True)
    price = models.FloatField(null=True, blank=True)
    currecny = models.ForeignKey(Currency, null=True, blank=True, on_delete=models.SET_NULL)
    rating = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(1)])
    slug = models.CharField(max_length=100, unique=True, default=generate_theme_slug)

class StoreTheme(models.Model):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE)
    hero1 = models.ImageField(upload_to='stores/hero' , null=True, blank=True)
    hero2 = models.ImageField(upload_to='stores/hero' , null=True, blank=True)
    hero3 = models.ImageField(upload_to='stores/hero' , null=True, blank=True)
    logo = models.ImageField(upload_to='stores/logos' , null=True, blank=True)
    cover = models.ImageField(upload_to='images/')
    primary = models.CharField(max_length=10)
    secondary = models.CharField(max_length=10)
    tertiary = models.CharField(max_length=10)
    banner = models.ImageField(upload_to='stores/banners' , null=True, blank=True)

class ThemeReview(models.Model):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE)
    description = models.TextField()
    rating = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])

class MerchantSocial(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    facebook = models.CharField(max_length=100, null=True, blank=True)
    twitter = models.CharField(max_length=100, null=True, blank=True)
    instagram = models.CharField(max_length=100, null=True, blank=True)
    telegram = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)

class Warehouse(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    neighborhood = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    selling_point = models.CharField(max_length=100)
    long = models.CharField(max_length=100)
    lat = models.CharField(max_length=100)

class WarehouseMove(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    from_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='from_warehouse')
    to_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='to_warehouse')
    status = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    shipping = models.CharField(max_length=100)
    payment = models.CharField(max_length=100, choices=PaymentMethods.choices)
    total = models.FloatField()
    status = models.CharField(max_length=100, choices=OrderStatus.choices)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

class AutoDiscount(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    discount_type = models.CharField(max_length=100, choices=DiscountTypes.choices)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=100, choices=StatusTypes.choices)
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()
    stop_at = models.CharField(max_length=100, choices=CampaignEnds.choices)

class SalePackage(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    ar_name = models.CharField(max_length=255)
    en_name = models.CharField(max_length=255)
    percent = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    ar_description = models.TextField()
    en_description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    package_type = models.CharField(max_length=100, choices=PackageTypes.choices)


class SaleCampaign(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    from_date = models.DateField(null=True, blank=True)
    from_time = models.TimeField(null=True, blank=True)
    purpose = models.CharField(max_length=100)
    notify_through = models.CharField(max_length=100)
    client_selection = models.CharField(max_length=100, choices=ClientSelection.choices)
    campaign_timezone = models.CharField(max_length=100)
    msg = models.TextField()
    msg_time = models.TimeField(null=True, blank=True)
    msg_date = models.DateField(null=True, blank=True)