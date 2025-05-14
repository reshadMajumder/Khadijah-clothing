from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import (
    Product, 
    ProductImage, 
    Category,
    Size,
    ContactUs, 
    Order, 
    OrderItem,
    Stuff,
    Review,
)



class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'image']

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url']
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size']

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']



class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    size = SizeSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'images', 'price', 'category', 'size']

    def get_image(self, obj):
        return ProductImageSerializer(obj.image).data

class ProductDetailSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'images', 'price', 'category', 'size', 'description']

    def get_size(self, obj):
        return [{'id': s.id, 'size': s.size} for s in obj.size.all()]
    
    def get_category(self, obj):
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            
        }
    
    def get_images(self, obj):
        return [{'id': i.id, 'image': i.image, 'image_url': i.image_url} for i in obj.images.all()]
    


    

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = ['id', 'name', 'email', 'message']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    size = SizeSerializer(read_only=True)
    size_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'size', 'size_id']
    
    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        product = get_object_or_404(Product, id=product_id)
        
        size = None
        size_id = validated_data.pop('size_id', None)
        if size_id:
            size = get_object_or_404(Size, id=size_id)
            
        return OrderItem.objects.create(product=product, size=size, **validated_data)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_data = serializers.ListField(
        child=serializers.JSONField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_phone', 'customer_address',
            'items', 'items_data', 'total_price', 'is_confirmed',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items_data', [])
        order = Order.objects.create(**validated_data)
        
        total_price = 0
        for item_data in items_data:
            product = get_object_or_404(Product, id=item_data['product_id'])
            quantity = item_data.get('quantity', 1)
            
            # Get the size if provided
            size = None
            if 'size_id' in item_data and item_data['size_id']:
                size = get_object_or_404(Size, id=item_data['size_id'])
            
            order_item = OrderItem.objects.create(
                product=product,
                quantity=quantity,
                size=size
            )
            order.items.add(order_item)
            total_price += product.price * quantity if product.price else 0
        
        order.total_price = total_price
        order.save()
        return order
    
    
    
class StuffSerializers(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Stuff
        fields = ['id', 'name', 'position', 'image', 'created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request is not None:
                representation['image'] = request.build_absolute_uri(instance.image.url)
            else:
                representation['image'] = instance.image.url
        else:
            representation['image'] = None
        return representation


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'name', 'message', 'rating', 'approved', 'created_at', 'updated_at']
