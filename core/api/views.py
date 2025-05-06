from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.db.models import Prefetch
from .models import Product, ProductImage, Size, Category, ContactUs, Order, OrderItem,Stuff,Review
from .serializers import (
    ProductSerializer, 
    ProductDetailSerializer, 
    CategorySerializer,
    ContactUsSerializer, 
    OrderSerializer,
    OrderItemSerializer,
    SizeSerializer,
    StuffSerializers,
    ReviewSerializer,


)

from .services.email_service import EmailService
from django.db import connection
from django.db import reset_queries
import time
from django.core.cache import cache

class CategoryList(APIView):
    """
    Get all categories with their subcategories
    """
    def get_cache_key(self):
        return 'category_list_cache_key'

    def get(self, request):
        try:
            cache_key = self.get_cache_key()
            cached_data = cache.get(cache_key)
            
            if cached_data:
                return Response(cached_data)
            
            categories = Category.objects.prefetch_related('products').all()
            serializer = CategorySerializer(categories, many=True, context={'request': request})
            response_data = {
                'status': 'success',
                'message': 'Categories fetched successfully',
                'categories': serializer.data
            }
            
            # Cache for 5 minutes
            cache.set(cache_key, response_data, 300)
            
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductList(APIView):
    def get(self, request):
        try:
            cache_key = 'product_list'
            products = cache.get(cache_key)
            
            if products is None:
                products = Product.objects.select_related('category').prefetch_related(
                    Prefetch('size', queryset=Size.objects.only('id', 'size')),
                    Prefetch('images', queryset=ProductImage.objects.only('id', 'image', 'image_url'))
                ).order_by('-created_at')
                cache.set(cache_key, products, timeout=300)  # Cache for 5 minutes
            
            # Reset query log
            reset_queries()
            
            # Start time
            start = time.time()
            
            # Convert to list to execute the query
            products_list = list(products)
            
            # Print query count and time
            query_count = len(connection.queries)
            end = time.time()
            
            print(f"Number of queries: {query_count}")
            print(f"Time taken: {end - start:.2f} seconds")
            
            # Print actual queries for analysis
            for query in connection.queries:
                print(f"Query: {query['sql']}")
            
            serializer = ProductSerializer(
                products_list, 
                many=True, 
                context={'request': request}
            )
            
            return Response({
                'status': 'success',
                'message': 'Products fetched successfully',
                'products': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# use cache to get first 10 products faster

class FeaturedProducts(APIView):
    def get(self, request):
        try:
            cache_key = 'product_list'
            products = cache.get(cache_key)
            
            if products is None:
                products = Product.objects.select_related('category').prefetch_related(
                    Prefetch('size', queryset=Size.objects.only('id', 'size')),
                    Prefetch('images', queryset=ProductImage.objects.only('id', 'image', 'image_url'))
                ).order_by('-created_at')[:10]
                cache.set(cache_key, products, timeout=300)  # Cache for 5 minutes
            
            # Reset query log
            reset_queries()
            
            # Start time
            start = time.time()
            
            # Convert to list to execute the query
            products_list = list(products)[:8]
            
            # Print query count and time
            query_count = len(connection.queries)
            end = time.time()
            
            print(f"Number of queries: {query_count}")
            print(f"Time taken: {end - start:.2f} seconds")
            
            # Print actual queries for analysis
            for query in connection.queries:
                print(f"Query: {query['sql']}")
            
            serializer = ProductSerializer(
                products_list, 
                many=True, 
                context={'request': request}
            )
            
            return Response({
                'status': 'success',
                'message': 'Products fetched successfully',
                'products': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

   
    

class ProductDetail(APIView):
    """
    Get product details by ID
    """
    def get(self, request, pk):
        try:
            cache_key = f'product_detail_{pk}'
            product = cache.get(cache_key)
            
            if product is None:
                product = get_object_or_404(
                    Product.objects.select_related('category').prefetch_related(
                        Prefetch('images', queryset=ProductImage.objects.all()),
                        Prefetch('size', queryset=Size.objects.all())
                    ),
                    id=pk
                )
                cache.set(cache_key, product, timeout=300)  # Cache for 5 minutes
            
            serializer = ProductDetailSerializer(product, context={'request': request})
            return Response({
                'status': 'success',
                'message': 'Product details fetched successfully',
                'product': serializer.data
            }, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({
                'status': 'error',
                'message': f'Product not found with id: {pk}'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class SizeView(APIView):
    def get(self, request):
        sizes = Size.objects.all()
        serializer = SizeSerializer(sizes, many=True)
        return Response({
            'status': 'success',
            'message': 'Sizes fetched successfully',
            'sizes': serializer.data
        }, status=status.HTTP_200_OK)

class ContactUsView(APIView):
    """
    API view to handle contact form submissions
    """
    def post(self, request):
        serializer = ContactUsSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()
            
            # Send email using the service
            email_sent = EmailService.send_contact_email(contact)
            
            response_data = {
                'status': 'success',
                'message': 'Contact form submitted successfully',
                'data': serializer.data
            }
            
            if not email_sent:
                response_data['warning'] = 'Form submitted but notification email failed'
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        return Response(
            {
                'status': 'error', 
                'message': 'Invalid data provided',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    

class OrderView(APIView):
    """
    API View for managing user inquiries.
    
    Methods:
    - POST: Create a new order with product items.

    """

    def post(self, request):
        """
        Create a new inquiry.
        
        Request Data:
        - name: Name of the user
        - email: User's email
        - subject: order subject
        - message: order message
        - items: ["product_id_1", "product_id_2"]

        
        Returns:
        - Success: Inquiry created successfully
        - Error: Validation or other issues
        """
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            # Save the inquiry
            order = serializer.save()
            
            # Get customer email from request data
            customer_email = request.data.get('email')
            
            # Send receipt email to both admin and customer
            email_sent = EmailService.send_order_receipt(order, customer_email)
            
            response_data = OrderSerializer(order).data
            
            # Handle email sending failures
            if not email_sent:
                response_data['warning'] = 'Order created but email notification failed'
            
            return Response({
                "status": True,
                "message": "Order created successfully",
                "data": response_data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": False,
            "message": "Invalid data",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



class StuffView(APIView):

    def get(self, request):
        stuff = Stuff.objects.all()
        serializer = StuffSerializers(stuff, many=True, context={'request': request})
        return Response({
            'status': 'success',
            'message': 'Team members fetched successfully',
            'team': serializer.data
        }, status=status.HTTP_200_OK)
    

class ReviewView(APIView):
    def get(self, request):
        """Get all approved reviews for public display"""
        reviews = Review.objects.filter(approved=True)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Submit a new review (will be unapproved by default)"""
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
