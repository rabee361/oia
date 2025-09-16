from django.db import models


class Unit(models.Model):
    name = models.CharField(max_length=50)

class UnitConversion(models.Model):
    unit1 = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name='unit1')
    unit2 = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name='unit2')
    value = models.FloatField(default=0.0)

class Currency(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    parts_name = models.CharField(max_length=100)
    parts = models.FloatField()

class CurrencyConversion(models.Model):
    currency1 = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='currency1')
    currency2 = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='currency2')
    value = models.FloatField(default=0.0)
    exchange_date = models.DateField(auto_now_add=True)