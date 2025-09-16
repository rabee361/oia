from django.contrib import admin
from .models import Unit, UnitConversion, Currency, CurrencyConversion


class UnitConversionInline(admin.TabularInline):
    model = UnitConversion
    fk_name = 'unit1'
    extra = 1
    verbose_name = "Unit Conversion"
    verbose_name_plural = "Unit Conversions"


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
    list_filter = ['name']
    ordering = ['name']
    inlines = [UnitConversionInline]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


class CurrencyConversionInline(admin.TabularInline):
    model = CurrencyConversion
    fk_name = 'currency1'
    extra = 1
    verbose_name = "Currency Conversion"
    verbose_name_plural = "Currency Conversions"


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'symbol', 'parts', 'parts_name']
    search_fields = ['name', 'symbol']
    list_filter = ['name', 'symbol']
    ordering = ['name']
    list_editable = ['parts']
    inlines = [CurrencyConversionInline]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


@admin.register(UnitConversion)
class UnitConversionAdmin(admin.ModelAdmin):
    list_display = ['id', 'unit1', 'unit2', 'value']
    search_fields = ['unit1__name', 'unit2__name']
    list_filter = ['unit1', 'unit2']
    ordering = ['unit1', 'unit2']
    list_editable = ['value']
    autocomplete_fields = ['unit1', 'unit2']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('unit1', 'unit2')


@admin.register(CurrencyConversion)
class CurrencyConversionAdmin(admin.ModelAdmin):
    list_display = ['id', 'currency1', 'currency2', 'value']
    search_fields = ['currency1__name', 'currency2__name', 'currency1__symbol', 'currency2__symbol']
    list_filter = ['currency1', 'currency2']
    ordering = ['currency1', 'currency2']
    list_editable = ['value']
    autocomplete_fields = ['currency1', 'currency2']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('currency1', 'currency2')