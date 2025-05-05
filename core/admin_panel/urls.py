from django.urls import path
from .views import CategoryView, ProductListCreate,ProductDetail,SizeView,ContactUsView,OrderView

urlpatterns = [
    path('categories/', CategoryView.as_view(), name='category-get-post'),
    path('categories/<str:pk>/', CategoryView.as_view(), name='category-detail-update-delete'),
    path('products/', ProductListCreate.as_view(), name='product-get-post'),
    path('categorised-products/<uuid:pk>/', ProductListCreate.as_view(), name='get-post-products-inside-category'),# fetch product by category id
    path('products/<uuid:pk>/', ProductDetail.as_view(), name='update-delete-get_specific-product'),# get single product update delete
    path('sizes/', SizeView.as_view(), name='Get-Post-sizes'),
    path('sizes/<uuid:pk>/', SizeView.as_view(), name='update-delete-sizes'),
    path('contact-us/', ContactUsView.as_view(), name='Get-contactus'),
    path('concact-us/<uuid:pk>/', ContactUsView.as_view(), name='delete-contactus'),
    path('orders/', OrderView.as_view(), name='Get-orders'),
    path('orders/<uuid:pk>/', OrderView.as_view(), name='Get-orders'),
    


]
