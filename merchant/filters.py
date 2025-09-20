from django_filters import FilterSet, CharFilter, ChoiceFilter, RangeFilter
from .models import *
from django.db.models import Q, F

class CustomProductFilter(FilterSet):
    # Custom search filter for product names and codes
    name = CharFilter(method='filter_search', label='Search')
    
    # Status filter mapping HTML values to model values
    # status = ChoiceFilter(
    #     field_name='isActive',
    #     choices=[
    #         ('active', 'Active'),
    #         ('inactive', 'Inactive'),
    #     ],
    #     method='filter_status'
    # )
    
    # Price range filter
    # price_range = ChoiceFilter(
    #     method='filter_price_range',
    #     choices=[
    #         ('0-50', '0 - 50'),
    #         ('50-100', '50 - 100'),
    #         ('100-500', '100 - 500'),
    #         ('500+', '500+'),
    #     ]
    # )
    
    # Sale status filter
    # sale_status = ChoiceFilter(
    #     method='filter_sale_status',
    #     choices=[
    #         ('sale', 'On Sale'),
    #         ('no_sale', 'Not On Sale'),
    #     ]
    # )
    
    def filter_search(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(ar_name__icontains=value) | 
                Q(en_name__icontains=value)
            )
        return queryset
    
    # def filter_status(self, queryset, name, value):
    #     if value == 'active':
    #         return queryset.filter(isActive=True)
    #     elif value == 'inactive':
    #         return queryset.filter(isActive=False)
    #     return queryset
    
    # def filter_price_range(self, queryset, name, value):
    #     if value == '0-50':
    #         return queryset.filter(cost__range=(0, 50))
    #     elif value == '50-100':
    #         return queryset.filter(cost__range=(50, 100))
    #     elif value == '100-500':
    #         return queryset.filter(cost__range=(100, 500))
    #     elif value == '500+':
    #         return queryset.filter(cost__gt=500)
    #     return queryset
    
    # def filter_sale_status(self, queryset, name, value):
    #     # Assuming products on sale have a price different from cost
    #     # You can modify this logic based on your actual sale implementation
    #     if value == 'sale':
    #         return queryset.filter(price__lt=F('cost'))
    #     elif value == 'no_sale':
    #         return queryset.filter(price__gte=F('cost'))
    #     return queryset
    
    class Meta:
        model = Product
        # fields = ['category', 'name', 'status', 'price_range', 'sale_status']
        fields = ['category', 'name']