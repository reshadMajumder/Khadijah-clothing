from django.contrib import admin

# Register your models here.
from .models import Product, ProductImage, Size, ContactUs, Order, OrderItem, Category,Stuff

class OrderItemInline(admin.TabularInline):
    model = Order.items.through
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'customer_phone', 'total_price', 'created_at', 'is_confirmed']
    list_filter = ['is_confirmed', 'created_at']
    search_fields = ['customer_name', 'customer_phone', 'customer_address']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [OrderItemInline]
    exclude = ('items',)  # Hide the items field since we're using inline

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'product']
    search_fields = ['product__title']

admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Size)
admin.site.register(ContactUs)
admin.site.register(Category)
admin.site.register(Stuff)





