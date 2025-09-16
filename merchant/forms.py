from django import forms
from django.contrib.auth import authenticate, get_user_model
from utils.types import UserType, BusinessTypes, StoreTypes
from .models import *
User = get_user_model()


class MerchantLoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'auth-input',
            'placeholder': 'أدخل بريدك الإلكتروني',
            'required': True
        }),
        error_messages={
            'required': 'البريد الإلكتروني مطلوب',
            'invalid': 'يرجى إدخال بريد إلكتروني صحيح'
        }
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'auth-input',
            'placeholder': 'أدخل كلمة المرور',
            'required': True
        }),
        error_messages={
            'required': 'كلمة المرور مطلوبة'
        }
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise forms.ValidationError('البريد الإلكتروني غير مسجل في النظام')

            user = authenticate(email=email, password=password)
            if user is None:
                raise forms.ValidationError('كلمة المرور غير صحيحة')

            if user.user_type not in [UserType.MERCHANT, UserType.ADMIN]:
                raise forms.ValidationError('هذا الحساب غير مخول للدخول إلى لوحة التحكم')

            cleaned_data['user'] = user

        return cleaned_data

class MerchantSignUpForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'auth-input',
            'placeholder': 'أدخل بريدك الإلكتروني',
            'required': True
        }),
        error_messages={
            'required': 'البريد الإلكتروني مطلوب',
            'invalid': 'يرجى إدخال بريد إلكتروني صحيح'
        }
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'auth-input',
            'placeholder': 'أدخل كلمة المرور',
            'required': True,
            'minlength': '6'
        }),
        min_length=6,
        error_messages={
            'required': 'كلمة المرور مطلوبة',
            'min_length': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        }
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'auth-input',
            'placeholder': 'تأكيد كلمة المرور',
            'required': True,
            'minlength': '6'
        }),
        error_messages={
            'required': 'تأكيد كلمة المرور مطلوب'
        }
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email:
            if User.objects.filter(email=email).exists():
                raise forms.ValidationError('هذا البريد الإلكتروني مسجل مسبقاً')
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password:
            if password != confirm_password:
                raise forms.ValidationError("كلمات المرور غير متطابقة")

        return cleaned_data

class OTPForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'auth-input',
            'placeholder': 'أدخل بريدك الإلكتروني',
            'required': True
        })
    )



class VerifyOTPForm(forms.Form):
    otp1 = forms.CharField(max_length=1, required=True)
    otp2 = forms.CharField(max_length=1, required=True)
    otp3 = forms.CharField(max_length=1, required=True)
    otp4 = forms.CharField(max_length=1, required=True)

    def clean(self):
        cleaned_data = super().clean()
        otp1 = cleaned_data.get('otp1')
        otp2 = cleaned_data.get('otp2')
        otp3 = cleaned_data.get('otp3')
        otp4 = cleaned_data.get('otp4')

        if otp1 and otp2 and otp3 and otp4:
            full_otp = otp1 + otp2 + otp3 + otp4
            try:
                otp_code = int(full_otp)
                cleaned_data['full_otp'] = otp_code
            except ValueError:
                raise forms.ValidationError('رمز التحقق يجب أن يحتوي على أرقام فقط')

        return cleaned_data

    def verify_otp(self, email):
        """Verify the OTP code against the database"""
        from accounts.models import OTPCode
        from django.utils import timezone

        otp_code = self.cleaned_data.get('full_otp')

        # Find valid OTP code
        otp_record = OTPCode.objects.filter(
            email=email,
            code=otp_code,
            code_type='SIGNUP',
            is_used=False,
            expiresAt__gt=timezone.now()
        ).first()

        if not otp_record:
            raise forms.ValidationError('رمز التحقق غير صحيح أو منتهي الصلاحية')

        return otp_record

    def save(self, email):
        """Mark OTP as used and activate user"""
        from django.contrib.auth import get_user_model

        User = get_user_model()
        otp_record = self.verify_otp(email)

        # Mark OTP as used
        otp_record.is_used = True
        otp_record.save()

        # Activate user if needed
        user = User.objects.filter(email=email).first()
        if user:
            user.is_active = True
            user.save()

        return user
    

class RegisterMerchantForm(forms.ModelForm):
    share_location = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={
            'class': 'custom-checkbox-input'
        })
    )

    business_type = forms.ChoiceField(
        choices=[('', 'اختر مجال النشاط')] + list(BusinessTypes.choices),
        widget=forms.Select(attrs={
            'class': 'auth-select',
            'required': True,
            'data-validation': 'required'
        })
    )

    store_type = forms.ChoiceField(
        choices=[('', 'اختر نوع النشاط')] + list(StoreTypes.choices),
        widget=forms.Select(attrs={
            'class': 'auth-select',
            'required': True,
            'data-validation': 'required'
        })
    )

    class Meta:
        model = Merchant
        fields = ['store_name', 'business_type', 'store_type', 'share_location']
        labels = {
            'store_name': 'اسم المتجر',
            'business_type': 'مجال النشاط التجاري',
            'store_type': 'نوع النشاط التجاري',
            'share_location': 'السماح بالوصول إلى الموقع الجغرافي'
        }
        widgets = {
            'store_name': forms.TextInput(attrs={
                'class': 'auth-input',
                'placeholder': 'مثال: متجر رائع',
                'required': True,
                'data-validation': 'required'
            })
        }

    def save(self, user, commit=True):
        instance = super().save(commit=False)
        instance.user = user
        if commit:
            instance.save()
        return instance
    

class CategoryForm(forms.ModelForm):
    class Meta:
        model = ProductCategory
        fields = ['ar_name', 'en_name', 'ar_description', 'en_description', 'image', 'slug']
        widgets = {
            'ar_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'أدخل اسم الفئة بالعربية',
                'required': True
            }),
            'en_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter category name in English',
                'required': True
            }),
            'ar_description': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'أدخل وصف الفئة بالعربية',
                'rows': 4
            }),
            'en_description': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'Enter category description in English',
                'rows': 4
            }),
            'image': forms.FileInput(attrs={
                'class': 'image-input',
                'accept': 'image/*'
            }),
            'slug': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'category-url-slug'
            })
        }
        error_messages = {
            'ar_name': {
                'required': 'اسم الفئة بالعربية مطلوب',
                'max_length': 'اسم الفئة لا يجب أن يتجاوز 100 حرف'
            },
            'en_name': {
                'required': 'اسم الفئة بالإنجليزية مطلوب',
                'max_length': 'اسم الفئة لا يجب أن يتجاوز 100 حرف'
            },
            'slug': {
                'max_length': 'رابط الفئة لا يجب أن يتجاوز 50 حرف'
            }
        }

    def clean_slug(self):
        slug = self.cleaned_data.get('slug')
        if slug:
            slug = slug.lower().replace(' ', '-')
            if ProductCategory.objects.filter(slug=slug).exclude(pk=self.instance.pk if self.instance else None).exists():
                raise forms.ValidationError('هذا الرابط مستخدم مسبقاً')
        return slug

    def save(self, commit=True):
        instance = super().save(commit=False)
        if not instance.slug and instance.ar_name:
            import re
            slug = re.sub(r'[^\w\s-]', '', instance.ar_name.lower())
            slug = re.sub(r'[-\s]+', '-', slug)
            instance.slug = slug
        if commit:
            instance.save()
        return instance





class ProductFilterForm(forms.ModelForm):
    class Meta:
        model = ProductFilter
        fields = ['ar_name', 'en_name', 'ar_value', 'en_value']
        widgets = {
            'ar_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'أدخل اسم التصنيف بالعربية',
                'required': True
            }),
            'en_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter filter name in English',
                'required': True
            }),
            'ar_value': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'أدخل وصف التصنيف بالعربية',
                'rows': 4
            }),
            'en_value': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'Enter filter description in English',
                'rows': 4
            }),
        }
        error_messages = {
            'ar_name': {
                'required': 'اسم التصنيف بالعربية مطلوب',
                'max_length': 'اسم التصنيف لا يجب أن يتجاوز 100 حرف'
            },
            'en_name': {
                'required': 'اسم التصنيف بالإنجليزية مطلوب',
                'max_length': 'اسم التصنيف لا يجب أن يتجاوز 100 حرف'
            },
        }




class ProductOptionform(forms.ModelForm):
    class Meta:
        model = ProductOption
        fields = ['ar_name', 'en_name', 'ar_value', 'en_value']
        widgets = {
            'ar_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'أدخل اسم الخيار بالعربية',
                'required': True
            }),
            'en_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter option name in English',
                'required': True
            }),
            'ar_value': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'أدخل وصف الخيار بالعربية',
                'rows': 4
            }),
            'en_value': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'Enter option description in English',
                'rows': 4
            }),
        }
        error_messages = {
            'ar_name': {
                'required': 'اسم الخيار بالعربية مطلوب',
                'max_length': 'اسم الخيار لا يجب أن يتجاوز 100 حرف'
            },
            'en_name': {
                'required': 'اسم الخيار بالإنجليزية مطلوب',
                'max_length': 'اسم الخيار لا يجب أن يتجاوز 100 حرف'
            },
        }

