
from multiprocessing import get_context
from django.http.response import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView, ListView
from django.views import View
from django.contrib.auth import login, logout
from django.contrib import messages
from utils.views import CustomListView
from ..forms import *
from ..models import *
from django.db import transaction
from accounts.tasks import send_otp_task
from utils.email import send_otp_email
from utils.types import UserType
from django.contrib.auth import get_user_model
User = get_user_model()
import json
from datetime import timedelta
from django.utils import timezone



class DashboardView(TemplateView):
    template_name = "dashboard.html"

class LoginView(View):
    def get(self, request):
        # if request.user.is_authenticated:
        #     return redirect('merchant-dasboard')
        form = MerchantLoginForm()
        return render(request, "auth/login.html", {"form": form})

    def post(self, request):
        form = MerchantLoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data.get('user', None)
            if user:
                login(request, user)
                return redirect('merchant-dasboard')
        return render(request, "auth/login.html", {"form": form})

class LogoutView(View):
    def get(self, request):
        logout(request.user)
        return redirect('login')

class SignUpView(View):
    def get(self, request):
        # if request.user.is_authenticated:
        #     return redirect('dashboard')
        form = MerchantSignUpForm()
        return render(request, "auth/signup.html", {"form": form})

    @transaction.atomic
    def post(self, request):
        form = MerchantSignUpForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = User.objects.create_user(username=email, email=email, password=password,user_type=UserType.MERCHANT)
            x = OTPCode.checkLimit(email)
            print(x)
            print(user)
            if user and not OTPCode.checkLimit(email):
                user.create_signup_otp()
                request.session['signup_email'] = email
                print(request.session['signup_email'])
                # send_otp_task.delay(user.create_signup_otp(), user.email) #TODO test it in prod with redis
                # send_otp_email(code, user.email)
                return redirect('verify-otp')
        return render(request, "auth/signup.html", {"form": form})

class OtpCodeView(View):
    def get(self,request):
        form = OTPForm()
        return render(request, "auth/otp_code.html", {"form":form})

    def post(self,request):
        form = OTPForm()
        if form.is_valid():
            return redirect('verify-otp')
        return render(request, "auth/otp_code.html", {"form":form})

class VerifyOtpView(TemplateView): 
    def get(self, request):
        # Check if user email is in session
        email = request.session.get('signup_email')
        # if not email:
        #     messages.error(request, 'يرجى إعادة المحاولة من البداية')
        #     return redirect('signup')
        form = VerifyOTPForm()
        return render(request, "auth/verify_otp.html", {"form": form, "email": email})

    def post(self, request):
        email = request.session.get('signup_email')
        # if not email:
        #     messages.error(request, 'يرجى إعادة المحاولة من البداية')
        #     return redirect('signup')
        form = VerifyOTPForm(request.POST)
        if form.is_valid():
            try:
                user = form.save(email)
                if user:
                    messages.success(request, 'تم التحقق من البريد الإلكتروني بنجاح')
                    return redirect('register')
            except forms.ValidationError as e:
                form.add_error(None, str(e))

        return render(request, "auth/verify_otp.html", {"form": form, "email": email})

class EmailChangePasswordView(TemplateView):
    template_name = "auth/email_change_password.html"

class ChangePasswordView(TemplateView):
    template_name = "auth/change_password.html"

class RegisterView(View):
    def get(self, request):
        # Check if user email exists in session
        email = request.session.get('signup_email')
        # if not email:
        #     return redirect('signup')
        form = RegisterMerchantForm()
        return render(request, "auth/register.html", {"form": form})

    def post(self, request):
        try:
            email = request.session.get('signup_email')
            if not email:
                return redirect('signup')

            user = User.objects.get(email=email)
            form = RegisterMerchantForm(request.POST)

            if form.is_valid():
                merchant = form.save(user)
                # Clear session after successful registration
                request.session.pop('signup_email', None)
                return redirect('merchant-dasboard')
            return render(request, "auth/register.html", {"form": form})
        except User.DoesNotExist:
            return redirect('signup')

class ConfigurationView(TemplateView):
    template_name = "config/main/configuration.html"

class PlansView(View):
    def get(slf, request):
        plans = Plan.objects.all()
        context = {
            'plans': plans
        }
        return render(request, "config/subscription/plans.html", context=context)

class PlanConfigView(TemplateView):
    template_name = "config/subscription/plans.html"

class CurrencyView(TemplateView):
    template_name = "config/main/currencies.html"

class WarehousesView(TemplateView):
    template_name = "config/warehouses/management/warehouse_management.html"

class AddWarehouseView(TemplateView):
    template_name = "config/warehouses/management/warehouse_form.html"

class WarehouseFormView(TemplateView):
    template_name = "config/warehouses/management/warehouse_form.html"

class AccountView(TemplateView):
    template_name = "config/main/account.html"

class ProductsView(CustomListView):
    model = Product
    context_object_name = 'products'
    template_name = "products/products.html"

class CustomersView(CustomListView):
    model = Customer
    context_object_name = 'customers'
    template_name = "customers/customers.html"

class CustomerView(TemplateView):
    template_name = "customers/customer_form.html"

class DeletedProductsView(View):
    def get(self, request):
        products = Product.objects.filter(isDeleted=True)
        return render(request, "products/deleted_products.html", {"products": products})

class AddProductView(TemplateView):
    template_name = "products/product.html"

class ProductFormView(TemplateView):
    template_name = "products/product.html"
    
class ProductActionView(View):
    def post(self, request):
        selected_ids = json.loads(request.POST.get('selected_ids', '[]'))
        action = request.POST.get('action')
        if action == 'delete':
            Product.objects.filter(id__in=selected_ids).delete()
        return HttpResponseRedirect(reverse('products'))

class CategoryView(ListView):
    model = ProductCategory
    context_object_name = 'categories'
    template_name = "products/categories/categories.html"

class AddCategoryView(View):
    def get(self, request):
        form = CategoryForm()
        context = {
            'form': form,
            'is_edit': False
        }
        return render(request, "products/categories/category_form.html", context)

    def post(self, request):
        form = CategoryForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            category = form.save(commit=False)
            category.merchant = request.user.merchant
            category.save()
            return redirect('categories')

        context = {
            'form': form,
            'is_edit': False
        }
        return render(request, "products/categories/category_form.html", context)

class CategoryFormView(View):
    def get(self, request, id=None):
        if id:
            try:
                category = ProductCategory.objects.get(id=id)
                form = CategoryForm(instance=category)
                context = {
                    'form': form,
                    'category': category,
                    'is_edit': True
                }
            except ProductCategory.DoesNotExist:
                return redirect('404')
        else:
            form = CategoryForm()
            context = {
                'form': form,
                'is_edit': False
            }

        return render(request, "products/categories/category_form.html", context)

    def post(self, request, id=None):
        if id:
            try:
                category = ProductCategory.objects.get(id=id)
                form = CategoryForm(instance=category, data=request.POST, files=request.FILES)
                is_edit = True
            except ProductCategory.DoesNotExist:
                return redirect('404')
        else:
            form = CategoryForm(data=request.POST, files=request.FILES)
            is_edit = False
            category = None

        if form.is_valid():
            saved_category = form.save(commit=False)
            if not is_edit:
                saved_category.merchant = request.user.merchant
            saved_category.save()
            return redirect('categories')

        context = {
            'form': form,
            'category': category,
            'is_edit': is_edit
        }
        return render(request, "products/categories/category_form.html", context)

class CategoryActionView(View):
    def post(self, request):
        selected_ids = json.loads(request.POST.get('selected_ids', '[]'))
        action = request.POST.get('action')
        if action == 'delete':
            ProductCategory.objects.filter(id__in=selected_ids).delete()
        return HttpResponseRedirect(reverse('categories'))





class ProductFiltersActionView(View):
    def post(self, request):
        selected_ids = json.loads(request.POST.get('selected_ids', '[]'))
        action = request.POST.get('action')
        if action == 'delete':
            ProductFilter.objects.filter(id__in=selected_ids).delete()
        return HttpResponseRedirect(reverse('filters'))

class AddProductFilterView(View):
    def get(self, request):
        form = ProductFilterForm()
        context = {
            'form': form,
            'is_edit': False
        }
        return render(request, "products/filters/filter_form.html", context)

    def post(self, request):
        form = ProductFilterForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            filter = form.save(commit=False)
            filter.merchant = request.user.merchant
            filter.save()
            return redirect('filters')

        context = {
            'form': form,
            'is_edit': False
        }
        return render(request, "products/filters/filter_form.html", context)

class ProductFiltersView(View):
    def get(self, request):
        filters = ProductFilter.objects.all()
        return render(request, 'products/filters/filters.html', {'filters': filters})

class ProductFilterFormView(View):
    def get(self, request, id=None):
        if id:
            try:
                filters = ProductFilter.objects.get(id=id)
                form = ProductFilterForm(instance=filters)
                context = {
                    'form': form,
                    'filters': filters,
                    'is_edit': True
                }
            except ProductFilter.DoesNotExist:
                return redirect('404')
        else:
            form = ProductFilterForm()
            context = {
                'form': form,
                'is_edit': False
            }

        return render(request, "products/filters/filter_form.html", context)




class ProductOptionsActionView(View):
    def post(self, request):
        selected_ids = json.loads(request.POST.get('selected_ids', '[]'))
        action = request.POST.get('action')
        if action == 'delete':
            ProductOption.objects.filter(id__in=selected_ids).delete()
        return HttpResponseRedirect(reverse('options'))

class ProductOptionsView(View):
    def get(self, request):
        options = ProductOption.objects.all()
        return render(request, 'products/options/options.html', {'options': options})

class AddProductOptionView(View):
    def get(self, request, id=None):
        if id:
            try:
                options = ProductOption.objects.get(id=id)
                form = ProductOptionform(instance=options)
                context = {
                    'form': form,
                    'options': options,
                    'is_edit': True
                }
            except ProductOption.DoesNotExist:
                return redirect('404')
        else:
            form = ProductOptionform()
            context = {
                'form': form,
                'is_edit': False
            }

        return render(request, "products/options/option_form.html", context)

class ProductOptionFormView(View):
    def get(self, request, id=None):
        if id:
            try:
                options = ProductOption.objects.get(id=id)
                form = ProductOptionform(instance=options)
                context = {
                    'form': form,
                    'options': options,
                    'is_edit': True
                }
            except ProductOption.DoesNotExist:
                return redirect('404')
        else:
            form = ProductOptionform()
            context = {
                'form': form,
                'is_edit': False
            }

        return render(request, "products/options/option_form.html", context)


class Theme1View(View):
    def get(self,request,slug):
        try:
            theme = get_object_or_404(Theme, slug=slug)
            return render(request, f"themes/{slug}/main.html", {'theme':theme})
        except Theme.DoesNotExist:
            return redirect('404')

class ThemesView(View):
    def get(self, request):
        themes = Theme.objects.all()
        new_themes = Theme.objects.filter(createdAt__gte=timezone.now() - timedelta(days=7))
        free_themes = Theme.objects.filter(price=0)
        popular_themes = Theme.objects.all()
        context = {"themes": themes, "new_themes": new_themes, "free_themes": free_themes, "popular_themes": popular_themes}

        return render(request, "themes/main/themes.html", context)

class ThemeFormView(TemplateView):
    template_name = "themes/main/theme_form.html"

class ThemInfoView(View):
    def get(self, request, id):
        theme = Theme.objects.get(id=id)
        return render(request, "themes/main/theme_info.html", {"theme":theme})

class TermsView(TemplateView):
    template_name = "config/terms/terms.html"

class ConditionsView(TemplateView):
    template_name = "config/terms/conditions.html"

class PrivacyView(TemplateView):
    template_name = "config/terms/privacy.html"

class ComplaintsView(TemplateView):
    template_name = "config/terms/complaints.html"

class LicenseView(TemplateView):
    template_name = "config/terms/license.html"

class ReturnPolicyView(TemplateView):
    template_name = "config/terms/return_policy.html"


class PaymentView(TemplateView):
    template_name = "config/main/payment.html"


class ShippingView(TemplateView):
    template_name = "config/shipping/shipping.html"

class ShippingConceptView(TemplateView):
    template_name = "config/shipping/concept.html"



class TaxView(TemplateView):
    template_name = "config/advanced/tax.html"

class TeamAlertsView(TemplateView):
    template_name = "config/advanced/team_alerts.html"

class MembersView(TemplateView):
    template_name = "config/advanced/members.html"

class QuestionsView(TemplateView):
    template_name = "config/advanced/questions/questions.html"




class WorkingHoursView(TemplateView):
    template_name = "config/main/working_hours.html"




class AnalyticsView(TemplateView):
    template_name = "analytics/main.html"

class ReportsView(TemplateView):
    template_name = "analytics/reports/main.html"

class ProductReportView(TemplateView):
    template_name = "analytics/reports/products.html"

class SalesReportView(TemplateView):
    template_name = "analytics/reports/sales.html"

class CustomerReportView(TemplateView):
    template_name = "analytics/reports/customers.html"

class ShippingReportView(TemplateView):
    template_name = "analytics/reports/shipping.html"

class PaymentReportView(TemplateView):
    template_name = "analytics/reports/payment.html"

class StockReportView(TemplateView):
    template_name = "analytics/reports/stock.html"

class CouponReportView(TemplateView):
    template_name = "analytics/reports/coupons.html"

class OrderReportView(TemplateView):
    template_name = "analytics/reports/orders.html"

class OrdersView(CustomListView):
    context_object_name = 'orders'
    queryset = Order.objects.all()
    template_name = "products/orders/orders.html"

class AbandonedCartsView(View):
    def get(self, request):
        orders = Order.objects.all()
        return render(request, "products/orders/abandoned_carts.html", {"orders":orders})

class OrderView(View):
    def get(self, request, id):
        order = get_object_or_404(Order, id=id)
        return render(request, "products/orders/order.html", {"order":order})

class StoreWebsite(View):
    def get(self, request, slug):
        store = get_object_or_404(Store.objects.select_related('theme'), domain=slug)
        theme = store.theme
        theme_name = store.theme.theme.title
        theme_path = f"themes/{theme_name}/main.html"
        context = {
            'color_test': theme.secondary,
            'bg': theme.primary,
            "theme":theme,
            "theme_path":theme_path
        }
        return render(request, "pages/main.html", context=context)



class AutoDiscountsView(TemplateView):
    template_name = "sales/auto_discount/auto_dsicounts.html"

class AddAutoDiscountView(TemplateView):
    template_name = "sales/auto_discount/auto_discount_form.html"

class AutoDiscountFormView(TemplateView):
    template_name = "sales/auto_discount/auto_discount_form.html"


class DiscountsView(TemplateView):
    template_name = "sales/discount/discounts.html"

class AddDiscountView(TemplateView):
    template_name = "sales/discount/discount_form.html"

class DiscountFormView(TemplateView):
    template_name = "sales/discount/discount_form.html"


class OffersView(TemplateView):
    template_name = "sales/offers/offers.html"

class AddOfferView(TemplateView):
    template_name = "sales/offers/offer-form.html"

class OfferFormView(TemplateView):
    template_name = "sales/offers/offer-form.html"


class CouponsView(TemplateView):
    template_name = "sales/coupon/coupons.html"

class AddCouponView(TemplateView):
    template_name = "sales/coupon/coupon-form.html"

class CouponsFormView(TemplateView):
    template_name = "sales/coupon/coupon-form.html"



class SalesPackagesView(TemplateView):
    template_name = "sales/sales_packages/sales_packages.html"

class AddSalesPackageView(TemplateView):
    template_name = "sales/sales_packages/sales_packages_form.html"

class SalesPackageFormView(TemplateView):
    template_name = "sales/sales_packages/sales_packages_form.html"



class SalesCampaignsView(TemplateView):
    template_name = "sales/sales_campaign/sales_campaign.html"

class AddSalesCampaignView(TemplateView):
    template_name = "sales/sales_campaign/sales_campaign_form.html"

class SalesCampaignFormView(TemplateView):
    template_name = "sales/sales_campaign/sales_campaign_form.html"





class ThemeProductsView(View):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/products.html", {"theme":theme})

class CartView(View):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/cart.html", {"theme":theme})

class WishlistView(View):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/wishlist.html", {"theme":theme})

class CheckoutView(View):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/checkout.html", {"theme":theme})


class ThemeProductView(View):
    def get(self ,request, slug, id):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/product.html", {"theme":theme})


class ThemeCheckoutView(View):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug)
        if theme:
            return render(request, f"themes/{theme.name}/checkout.html", {"theme":theme})