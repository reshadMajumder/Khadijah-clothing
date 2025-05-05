from django.contrib import admin
from django.urls import path
from .views import ProductList, ProductDetail, ContactUsView, OrderView, CategoryList, SizeView, FeaturedProducts, StuffView




urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<uuid:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('sizes/', SizeView.as_view(), name='size-list'),
    path('contact-us/', ContactUsView.as_view(), name='contact-us'),
    path('order/', OrderView.as_view(), name='order'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('featured-products/', FeaturedProducts.as_view(), name='featured-products'),
    path('team/', StuffView.as_view(), name='team'),
    path('stuff/', StuffView.as_view(), name='stuff'),
] 