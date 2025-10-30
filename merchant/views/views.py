
from multiprocessing import get_context
from django.http.response import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView, ListView
from django.views import View
from django.contrib.auth import login, logout
from ..filters import *
from django.contrib import messages
from utils.views import CustomListView, BaseView
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
from django.db.models import  Q




class DashboardView(BaseView):
    def get(self, request):
        return render(request,"dashboard.html")


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
        return redirect('merchant-login')

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

class VerifyOtpView(View): 
    def get(self, request):
        # Check if user email is in session
        email = request.session.get('signup_email')
        # if not email:
        #     messages.error(request, 'يرجى إعادة المحاولة من البداية')
        #     return redirect('merchant-signup')
        form = VerifyOTPForm()
        return render(request, "auth/verify_otp.html", {"form": form, "email": email})

    def post(self, request):
        email = request.session.get('signup_email')
        # if not email:
        #     messages.error(request, 'يرجى إعادة المحاولة من البداية')
        #     return redirect('merchant-signup')
        form = VerifyOTPForm(request.POST)
        if form.is_valid():
            try:
                user = form.save(email)
                if user:
                    messages.success(request, 'تم التحقق من البريد الإلكتروني بنجاح')
                    return redirect('merchant-register')
            except forms.ValidationError as e:
                form.add_error(None, str(e))

        return render(request, "auth/verify_otp.html", {"form": form, "email": email})

class EmailChangePasswordView(View):
    def get(self, request):
        return render(request, "auth/email_change_password.html")

class ChangePasswordView(View):
    def get(self, request):
        return render(request, "auth/change_password.html")

class RegisterView(View):
    def get(self, request):
        # Check if user email exists in session
        email = request.session.get('signup_email')
        # if not email:
        #     return redirect('merchant-signup')
        form = RegisterMerchantForm()
        return render(request, "auth/register.html", {"form": form})

    def post(self, request):
        try:
            email = request.session.get('signup_email')
            if not email:
                return redirect('merchant-signup')

            user = User.objects.get(email=email)
            form = RegisterMerchantForm(request.POST)

            if form.is_valid():
                merchant = form.save(user)
                # Clear session after successful registration
                request.session.pop('signup_email', None)
                return redirect('merchant-dasboard')
            return render(request, "auth/register.html", {"form": form})
        except User.DoesNotExist:
            return redirect('merchant-signup')














class ConfigurationView(BaseView):
    def get(self, request):
        return render(request, "config/main/configuration.html")

class PlansView(BaseView):
    def get(self, request):
        plans = Plan.objects.all()
        context = {
            'plans': plans
        }
        return render(request, "config/subscription/plans.html", context=context)

class PlanConfigView(BaseView):
    def get(self, request):
        return render(request, "config/subscription/plans.html")

class CurrencyView(BaseView):
    def get(self, request):
        return render(request, "config/main/currencies.html")

class WarehousesView(BaseView):
    def get(self, request):
        return render(request, "config/warehouses/management/warehouse_management.html")

class AddWarehouseView(BaseView):
    def get(self, request):
        return render(request, "config/warehouses/management/warehouse_form.html")

class WarehouseFormView(BaseView):
    def get(self, request):
        return render(request, "config/warehouses/management/warehouse_form.html")

class AccountView(BaseView):
    def get(self, request):
        return render(request, "config/main/account.html")

class ProductsView(BaseView):
    model = Product
    context_object_name = 'products'
    filter_class = CustomProductFilter
    template_name = "products/products.html"

    def get(self, request):
        # Get base queryset for merchant's products
        queryset = Product.objects.filter(merchant=request.tenant, isDeleted=False)
        
        # Apply filters using CustomProductFilter
        product_filter = self.filter_class(request.GET, queryset=queryset)
        filtered_products = product_filter.qs
        
        # Get categories for the dropdown
        categories = ProductCategory.objects.filter(merchant=request.tenant)
        
        context = {
            'products': filtered_products,
            'categories': categories,
            'filter': product_filter,
        }
        
        return render(request, self.template_name, context)







class CustomersView(CustomListView):
    model = Customer
    context_object_name = 'customers'
    template_name = "customers/customers.html"

class CustomerView(BaseView):
    def get(self, request):
        return render(request, "customers/customer_form.html")

class DeletedProductsView(BaseView):
    def get(self, request):
        products = Product.objects.filter(isDeleted=True)
        return render(request, "products/deleted_products.html", {"products": products})

class AddProductView(BaseView):
    def get(self, request):
        return render(request, "products/product.html")

class ProductFormView(BaseView):
    def get(self, request):
        return render(request, "products/product.html")
    
class ProductActionView(BaseView):
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

class AddCategoryView(BaseView):
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

class CategoryFormView(BaseView):
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

class CategoryActionView(BaseView):
    def post(self, request):
        selected_ids = json.loads(request.POST.get('selected_ids', '[]'))
        action = request.POST.get('action')
        if action == 'delete':
            ProductCategory.objects.filter(id__in=selected_ids).delete()
        return HttpResponseRedirect(reverse('categories'))





class ProductFiltersActionView(BaseView):
    def post(self, request):
        selected_ids = json.loads(request.POST.get('selected_ids', '[]'))
        action = request.POST.get('action')
        if action == 'delete':
            ProductFilter.objects.filter(id__in=selected_ids).delete()
        return HttpResponseRedirect(reverse('filters'))

class AddProductFilterView(BaseView):
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

class ProductFiltersView(BaseView):
    def get(self, request):
        filters = ProductFilter.objects.all()
        return render(request, 'products/filters/filters.html', {'filters': filters})

class ProductFilterFormView(BaseView):
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




class ProductOptionsActionView(BaseView):
    def post(self, request):
        selected_ids = json.loads(request.POST.get('selected_ids', '[]'))
        action = request.POST.get('action')
        if action == 'delete':
            ProductOption.objects.filter(id__in=selected_ids).delete()
        return HttpResponseRedirect(reverse('options'))

class ProductOptionsView(BaseView):
    def get(self, request):
        options = ProductOption.objects.all()
        return render(request, 'products/options/options.html', {'options': options})

class AddProductOptionView(BaseView):
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

class ProductOptionFormView(BaseView):
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


class Theme1View(BaseView):
    def get(self,request,slug):
        try:
            theme = get_object_or_404(Theme, slug=slug)
            return render(request, f"themes/{slug}/main.html", {'theme':theme})
        except Theme.DoesNotExist:
            return redirect('404')

class ThemesView(BaseView):
    def get(self, request):
        themes = Theme.objects.all()
        new_themes = Theme.objects.filter(createdAt__gte=timezone.now() - timedelta(days=7))
        free_themes = Theme.objects.filter(price=0)
        popular_themes = Theme.objects.all()
        context = {"themes": themes, "new_themes": new_themes, "free_themes": free_themes, "popular_themes": popular_themes}

        return render(request, "themes/main/themes.html", context)

class ThemeFormView(BaseView):
    def get(self, request):
        return render(request, "themes/main/theme_form.html")

class ThemInfoView(BaseView):
    def get(self, request, id):
        theme = Theme.objects.get(id=id)
        return render(request, "themes/main/theme_info.html", {"theme":theme})

class TermsView(BaseView):
    def get(self, request):
        return render(request, "config/terms/terms.html")

class ConditionsView(BaseView):
    def get(self, request):
        return render(request, "config/terms/conditions.html")

class PrivacyView(BaseView):
    def get(self, request):
        return render(request, "config/terms/privacy.html")

class ComplaintsView(BaseView):
    def get(self, request):
        return render(request, "config/terms/complaints.html")

class LicenseView(BaseView):
    def get(self, request):
        return render(request, "config/terms/license.html")

class ReturnPolicyView(BaseView):
    def get(self, request):
        return render(request, "config/terms/return_policy.html")

class PaymentView(BaseView):
    def get(self, request):
        return render(request, "config/main/payment.html")

class ShippingView(BaseView):
    def get(self, request):
        return render(request, "config/shipping/shipping.html")

class ShippingConceptView(BaseView):
    def get(self, request):
        return render(request, "config/shipping/concept.html")

class TaxView(BaseView):
    def get(self, request):
        return render(request, "config/advanced/tax.html")

class TeamAlertsView(BaseView):
    def get(self, request):
        return render(request, "config/advanced/team_alerts.html")

class MembersView(BaseView):
    def get(self, request):
        return render(request, "config/advanced/members.html")

class QuestionsView(BaseView):
    def get(self, request):
        return render(request, "config/advanced/questions/questions.html")

class WorkingHoursView(BaseView):
    def get(self, request):
        return render(request, "config/main/working_hours.html")

class AnalyticsView(BaseView):
    def get(self, request):
        return render(request, "analytics/main.html")

class ReportsView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/main.html")

class ProductReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/products.html")

class SalesReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/sales.html")

class CustomerReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/customers.html")

class ShippingReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/shipping.html")

class PaymentReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/payment.html")

class StockReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/stock.html")

class CouponReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/coupons.html")

class OrderReportView(BaseView):
    def get(self, request):
        return render(request, "analytics/reports/orders.html")

class OrdersView(CustomListView):
    context_object_name = 'orders'
    queryset = Order.objects.all()
    template_name = "products/orders/orders.html"

class AbandonedCartsView(BaseView):
    def get(self, request):
        orders = Order.objects.all()
        return render(request, "products/orders/abandoned_carts.html", {"orders":orders})

class OrderView(BaseView):
    def get(self, request, id):
        order = get_object_or_404(Order, id=id)
        return render(request, "products/orders/order.html", {"order":order})

class StoreWebsite(BaseView):
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



class AutoDiscountsView(CustomListView):
    model = AutoDiscount
    context_object_name = 'auto_discounts'
    template_name = "sales/auto_discount/auto_dsicounts.html"

class AddAutoDiscountView(BaseView):
    def get(self, request):
        return render(request, "sales/auto_discount/auto_discount_form.html")

class AutoDiscountFormView(BaseView):
    def get(self, request):
        return render(request, "sales/auto_discount/auto_discount_form.html")

class DiscountsView(BaseView):
    def get(self, request):
        return render(request, "sales/discount/discounts.html")

class AddDiscountView(BaseView):
    def get(self, request):
        return render(request, "sales/discount/discount_form.html")

class DiscountFormView(BaseView):
    def get(self, request):
        return render(request, "sales/discount/discount_form.html")

class OffersView(BaseView):
    def get(self, request):
        return render(request, "sales/offers/offers.html")

class AddOfferView(BaseView):
    def get(self, request):
        return render(request, "sales/offers/offer-form.html")

class OfferFormView(BaseView):
    def get(self, request):
        return render(request, "sales/offers/offer-form.html")

class CouponsView(BaseView):
    def get(self, request):
        return render(request, "sales/coupon/coupons.html")

class AddCouponView(BaseView):
    def get(self, request):
        return render(request, "sales/coupon/coupon-form.html")

class CouponsFormView(BaseView):
    def get(self, request):
        return render(request, "sales/coupon/coupon-form.html")

class SalesPackagesView(CustomListView):
    model = SalePackage
    context_object_name = 'sale_packages'
    template_name = "sales/sales_packages/sales_packages.html"

class AddSalesPackageView(BaseView):
    def get(self, request):
        return render(request, "sales/sales_packages/sales_packages_form.html")

class SalesPackageFormView(BaseView):
    def get(self, request):
        return render(request, "sales/sales_packages/sales_packages_form.html")

class SalesCampaignsView(CustomListView):
    model = SaleCampaign
    context_object_name = 'sale_campaigns'
    template_name = "sales/sales_campaign/sales_campaign.html"

class AddSalesCampaignView(BaseView):
    def get(self, request):
        return render(request, "sales/sales_campaign/sales_campaign_form.html")

class SalesCampaignFormView(BaseView):
    def get(self, request):
        return render(request, "sales/sales_campaign/sales_campaign_form.html")



class ThemeProductsView(BaseView):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/products.html", {"theme":theme})

class CartView(BaseView):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/cart.html", {"theme":theme})

class WishlistView(BaseView):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/wishlist.html", {"theme":theme})

class CheckoutView(BaseView):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/checkout.html", {"theme":theme})


class ThemeProductView(BaseView):
    def get(self ,request, slug, id):
        theme = get_object_or_404(Theme, slug=slug)
        if theme:
            return render(request, f"themes/{theme.slug}/product.html", {"theme":theme})


class ThemeCheckoutView(BaseView):
    def get(self ,request, slug):
        theme = get_object_or_404(Theme, slug)
        if theme:
            return render(request, f"themes/{theme.name}/checkout.html", {"theme":theme})