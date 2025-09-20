from django.db import models
from django.contrib.auth.models import AbstractUser 
from utils.types import UserType, CodeTypes, BusinessTypes, StoreTypes
from dashboard.models import *
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator
from utils.helper import generate_code, get_expiration_time
from utils.managers import CustomeUserManager


class CustomUser(AbstractUser):
    image = models.ImageField(upload_to='users/images' , null=True, blank=True)
    user_type = models.CharField(max_length=10, choices=UserType, default=UserType.CUSTOMER)
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'

    objects = CustomeUserManager()

    def clean(self):
        if self.image and self.image.size > 2 * 1024 * 1024:  # 2MB in bytes
            raise ValidationError('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت')

        if self.image and not self.image.name.endswith(('.jpg', '.jpeg', '.png','webp')):
            raise ValidationError('يجب أن يكون الصورة بصيغة jpg أو jpeg أو png أو webp')

    def create_signup_otp(self, *args, **kwargs):
        code = OTPCode.objects.filter(email=self.email, expiresAt__date=timezone.now().date(), is_used=False).first()
        if not code:
            otp = OTPCode.objects.create(
                code_type='SIGNUP',
                email=self.email,
            )
            return otp.code

    # def create_chat(self):
    #     pass

    class Meta:
        ordering = ['-id']

    def __str__(self) -> str:
        return f"{self.username} - {self.email}"


class Merchant(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    business_type = models.CharField(max_length=100, choices=BusinessTypes)
    store_name = models.CharField(max_length=100)
    store_type = models.CharField(max_length=100, choices=StoreTypes)
    share_location = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class Customer(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    

class OTPCode(models.Model):
    email = models.CharField(max_length=40 , null=True , blank=True)
    code = models.IntegerField(validators=[MinValueValidator(100000), MaxValueValidator(999999)] , default=generate_code)
    createdAt = models.DateTimeField(auto_now_add=True)
    expiresAt = models.DateTimeField(default=get_expiration_time)
    code_type = models.CharField(max_length=20, choices=CodeTypes.choices , default=CodeTypes.SIGNUP)
    is_used = models.BooleanField(default=False)

    @staticmethod
    def checkLimit(email):
        return OTPCode.objects.filter(email=email,createdAt__gt=timezone.localtime()-timezone.timedelta(minutes=15)).count() >= 5 

    def __str__(self) -> str:
        return f"{self.email} - {self.code}"


# class Notification(models.Model):
#     title = models.CharField(max_length=255 , verbose_name='العنوان')
#     body = models.CharField(max_length=255 , verbose_name='النص')
#     createdAt = models.DateTimeField(auto_now_add=True , verbose_name='تاريخ الإنشاء')

#     def __str__(self) -> str:
#         return self.title

#     class Meta:
#         ordering = ['-id']



# class UserNotification(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     title = models.CharField(max_length=255)
#     content = models.CharField(max_length=255)
#     createdAt = models.DateTimeField(auto_now_add=True)

#     def __str__(self) -> str:
#         return f"{self.user.full_name} - {self.title}"

#     class Meta:
#         ordering = ['-id']
