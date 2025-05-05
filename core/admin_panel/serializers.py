from rest_framework import serializers
from api.models import Category, Product, ProductImage, Size
from api.serializers import ProductImageSerializer, ProductSerializer, CategorySerializer, SizeSerializer


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
        fields = ['id', 'image', 'image_url']  # Only include necessary fields


class AdminProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    images = ProductImageSerializer(many=True, required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    size = serializers.PrimaryKeyRelatedField(queryset=Size.objects.all(), many=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'image', 'image_url', 'category', 'size', 'price', 'description', 
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        size_data = validated_data.pop('size', [])
        
        # Create the product instance
        product = Product.objects.create(**validated_data)

        # Add composition objects to the ManyToMany field
        product.size.set(size_data)

        # Handle images
        for image_data in images_data:
            product_image = ProductImage.objects.create(**image_data)
            product.images.add(product_image)

        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        size_data = validated_data.pop('size', [])

        # Update basic fields
        instance.title = validated_data.get('title', instance.title)
        instance.price = validated_data.get('price', instance.price)
        instance.description = validated_data.get('description', instance.description)

        # Set many-to-many relationship for composition
        instance.size.set(size_data)

        # Update foreign keys
        instance.category = validated_data.get('category', instance.category)

        # Handle single image
        if 'image' in validated_data:
            instance.image = validated_data['image']

        # Handle Many-to-many field for images
        if images_data:
            instance.images.clear()
            for image_data in images_data:
                product_image = ProductImage.objects.create(**image_data)
                instance.images.add(product_image)

        instance.save()
        return instance
