from rest_framework import serializers
from api.models import Category, Product, ProductImage, Size
from api.serializers import ProductImageSerializer, ProductSerializer, CategorySerializer, SizeSerializer
from django.core.cache import cache

class CompositionSeriallizer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields ='__all__'


class AdminCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'



class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url']

    def validate(self, data):
        if not data.get('image') and not data.get('image_url'):
            raise serializers.ValidationError("Either 'image' or 'image_url' must be provided.")
        return data


class AdminProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    size = serializers.PrimaryKeyRelatedField(queryset=Size.objects.all(), many=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'images', 'category', 'size', 'price', 'description']
    # when it is called delete the cache

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        size_data = validated_data.pop('size', [])

        product = Product.objects.create(**validated_data)
        product.size.set(size_data)

        for image_data in images_data:
            product_image = ProductImage.objects.create(**image_data)
            product.images.add(product_image)
        
        # delete the cache
        cache.delete('products')
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        size_data = validated_data.pop('size', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if size_data is not None:
            instance.size.set(size_data)

        if images_data is not None:
            # Clear old images and add new ones
            instance.images.clear()
            for image_data in images_data:
                image = ProductImage.objects.create(**image_data)
                instance.images.add(image)

        instance.save()
        return instance



class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    size = SizeSerializer(many=True)
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = '__all__'
    
    def get_images(self, obj):
        return obj.images.all().values('id', 'image', 'image_url')
