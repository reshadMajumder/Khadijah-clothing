from django.db import models
from uuid import uuid4
# Create your models here.
class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    image = models.ImageField(upload_to='product_images/',null=True, blank=True)
    image_url = models.URLField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.image.name) if self.image else 'No Image'


class Size(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    size = models.CharField(max_length=100)

    def __str__(self):
        return self.size


    

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    image = models.ImageField(upload_to='category_images/',null=True, blank=True)
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    title = models.CharField(max_length=50)
    price = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    size = models.ManyToManyField(
        Size, 
        related_name='product_sizes',
        db_index=True
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products',
        db_index=True,
        null=True,
        blank=True

    )

    images = models.ManyToManyField(
        ProductImage,
        related_name='product_images',
        db_index=True,
        blank=True
    )

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['title', 'category']),
        ]


class Stuff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='stuff_images/',null=True, blank=True)
    position = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ContactUs(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.email} - {self.subject}"
    class Meta:
        verbose_name = 'Contact Us'
        verbose_name_plural = 'Contact Us'



class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField(default=1)
    def __str__(self):
        return f"{self.product.title}"

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    customer_name = models.CharField(max_length=200)
    customer_phone = models.CharField(max_length=200)
    customer_address = models.TextField()
    items = models.ManyToManyField(OrderItem, related_name='orders', blank=True)
    total_price = models.IntegerField(default=0)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.customer_name}-{self.customer_phone}"
    
    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
 



