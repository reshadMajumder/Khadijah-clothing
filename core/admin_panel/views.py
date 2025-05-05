from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminCategorySerializer, AdminProductSerializer,SizeSerializer
from django.http import Http404
from api.models import Category, Product, Size,ContactUs,Order,OrderItem
from api.serializers import ContactUsSerializer, OrderItemSerializer,OrderSerializer

from django.shortcuts import get_object_or_404


# Create your views here.

from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import json
from django.core.cache import cache
from api.views import CategoryList


    

class SizeView(APIView):
    '''
    login required. use access_token: Bearer <token>
    get: fetch all compositions
    
    post: create a new composition {"material":"name"}
    put:<uuid:pk> update a composition {"material":"name"}
    delete:<uuid:pk> delete a composition
    '''
    permission_classes=[permissions.IsAuthenticated]
    def get(self,request):
        try:
            sizes=Size.objects.all()
            serializer= SizeSerializer(sizes,many=True)
            return Response(
                {
                    'status': True,
                    'message': 'Zizes fetched successfully',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'message': 'Error fetching compositions',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def post(self,request):
        serializer=SizeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'status': True,
                    'message': 'Size created successfully',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request,pk):
        try:
            size=Size.objects.get(pk=pk)
            serializer=SizeSerializer(size,data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        'status': True,
                        'message': 'Size updated successfully',
                        'data': serializer.data
                    },
                    status=status.HTTP_200_OK
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Size.DoesNotExist:
            return Response(
                {
                    'status': False,
                    'message': 'Size not found',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'message': 'Error updating size',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def delete(self,request,pk):
        try:
            size=Size.objects.get(pk=pk)
            size.delete()
            return Response(
                {
                    'status': True,
                    'message': 'Size deleted successfully',
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Size.DoesNotExist:    
            return Response(
                {
                    'status': False,
                    'message': 'Composition not found',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'message': 'Error deleting composition',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )





class CategoryView(APIView):
    """
    API view to manage categories.

    Methods:
    - GET: Retrieve a list of categories.
    - POST: Create a new category.
    - PUT: Update an existing category by ID.
    - DELETE: Delete a category by ID.
    """
    permission_classes = [permissions.IsAuthenticated]


    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def invalidate_category_cache(self):
        """Helper method to invalidate category cache"""
        cache_key = CategoryList.get_cache_key(CategoryList())
        cache.delete(cache_key)

    def get(self, request):
        """
        Retrieve a list of all categories.

        Returns:
            Response: A list of categories with HTTP status 200.
        """
        try:
            categories = Category.objects.all()
            serializer = AdminCategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """
        Create a new category.

        Args:
            request (Request): The request object containing category data.

        Returns:
            Response: The created category data with HTTP status 201 or error details with HTTP status 400.
        """
        serializer = AdminCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            self.invalidate_category_cache()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        """
        Update an existing category by ID.
        """
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create a mutable copy of the data without copying the file
        data = {}
        data['name'] = request.data.get('name')
        
        # Handle image separately
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']
        
        # Handle subcategories
        if 'subcategories' in request.data:
            try:
                subcategories = request.data['subcategories']
                if isinstance(subcategories, str):
                    data['subcategories'] = json.loads(subcategories)
                else:
                    data['subcategories'] = subcategories
            except json.JSONDecodeError:
                return Response(
                    {'error': 'Invalid subcategories data'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = AdminCategorySerializer(category, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            self.invalidate_category_cache()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a category by ID.

        Args:
            pk (str): The ID of the category to delete.

        Returns:
            Response: HTTP status 204 on successful deletion or error details with HTTP status 404.
        """
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            self.invalidate_category_cache()
            return Response(
                {
                    'status': True,
                    'message': 'Category deleted successfully',
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProductListCreate(APIView):
    """   
    To get products of a category use category uuid.
    to post use this format:
    "style_number": "P12345",
    "gauge": "100",
    "end": "round",
    "weight": "200g",
    "description": "High-quality product",
    "composition": ["uuid-of-composition-1", "uuid-of-composition-2"],
    "category": "uuid-of-category",
    "sub_category": "uuid-of-subcategory",
    "image": "image.jpg",
    "images": [{ "image": "image1.jpg"},{ "image": "image2.jpg"} ]

    """
    permission_classes = [permissions.IsAuthenticated]

    def invalidate_product_cache(self):
        """Helper method to invalidate product cache"""
        cache.delete('product_list')

    def get(self, request, pk=None):
        if pk:
            products = Product.objects.filter(category_id=pk)
        else:
            products = Product.objects.all()
        serializer = AdminProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AdminProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            self.invalidate_product_cache()  # Clear cache after creation
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetail(APIView):
    """
    API view to handle the details of a single product.

    This view allows for retrieving, updating, and deleting a product
    based on its primary key (pk).

    Methods:
    - get_object(pk): Retrieves a product by its primary key.
    - get(request, pk): Returns the details of a product.
    - put(request, pk): Updates the details of a product.
    - delete(request, pk): Deletes a product.
    """
    
    permission_classes = [permissions.IsAuthenticated]

    def invalidate_product_cache(self, pk=None):
        """Helper method to invalidate product cache"""
        cache.delete('product_list')
        if pk:
            cache.delete(f'product_detail_{pk}')

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = AdminProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        serializer = AdminProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            self.invalidate_product_cache(pk)  # Clear both caches
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        product.delete()
        self.invalidate_product_cache(pk)  # Clear both caches
        return Response(
            {'message': 'Product deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )




class ContactUsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        contacts = ContactUs.objects.all()
        serializer = ContactUsSerializer(contacts, many=True)
        return Response(serializer.data)
    
    def delete(self, request, pk):
        contact = get_object_or_404(ContactUs, id=pk)
        contact.delete()
        return Response({
            'status': 'success',
            'message': 'Contact form deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class OrderView(APIView):
    """
    API View for managing user inquiries.
    
    Methods:
    - GET: Retrieve all inquiries of the user with product details.
    - DELETE: Delete a specific inquiry by its ID.
    """

   

    def get(self, request, pk=None):
        """
        Retrieve all inquiries or a specific inquiry by ID User must be authenticated.
        
        Parameters:
        - inquiry_id: Optional. If provided, fetch the specific inquiry.
        
        Returns:
        - Success: Inquiry details or list of inquiries
        - Error: Inquiry not found
        """
        if pk:
            # Fetch a specific inquiry
            order = get_object_or_404(Order, id=pk)
            serializer = OrderSerializer(order)
            return Response({
                "status": True,
                "message": "Inquiry details fetched successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        else:
            # Fetch all inquiries
            orders = Order.objects.all()
            serializer = OrderSerializer(orders, many=True)
            return Response({
                "status": True,
                "message": "All inquiries fetched successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        Delete a specific inquiry by its ID.
        
        Parameters:
        - inquiry_id: ID of the inquiry to delete
        
        Returns:
        - Success: Inquiry deleted successfully
        - Error: Inquiry not found
        """
        order = get_object_or_404(Order, id=pk)
        order.delete()
        return Response({
            "status": True,
            "message": "Inquiry deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)
        
  
    