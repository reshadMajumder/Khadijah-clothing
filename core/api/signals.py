from django.db.models.signals import pre_save
from django.dispatch import receiver
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
from api.models import Product, ProductImage

@receiver(pre_save, sender=Product)
def optimize_image(sender, instance, **kwargs):
    # The Product model no longer has a direct image field
    # It uses a ManyToMany relationship with ProductImage
    
    # The image optimization will be handled after the product is saved
    # and when ProductImage instances are created/updated
    pass

@receiver(pre_save, sender=ProductImage)
def optimize_product_image(sender, instance, **kwargs):
    if instance.image:
        # Open the uploaded image
        img = Image.open(instance.image)
        
        # Convert to RGB if image is in RGBA mode
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # Set maximum dimensions
        max_size = (800, 800)  # You can adjust these dimensions
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Create a BytesIO object to store the optimized image
        output = BytesIO()
        
        # Save the image with optimal quality (80% is usually a good balance)
        img.save(output, format='JPEG', quality=80, optimize=True)
        output.seek(0)
        
        # Replace the image field with optimized version
        instance.image = InMemoryUploadedFile(
            output,
            'ImageField',
            f"{instance.image.name.split('.')[0]}.jpg",
            'image/jpeg',
            sys.getsizeof(output),
            None
        )

    # Handle additional images if they exist
    if hasattr(instance, 'images'):
        for image in instance.images.all():
            if image.image:
                img = Image.open(image.image)
                if img.mode == 'RGBA':
                    img = img.convert('RGB')
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                output = BytesIO()
                img.save(output, format='JPEG', quality=80, optimize=True)
                output.seek(0)
                image.image = InMemoryUploadedFile(
                    output,
                    'ImageField',
                    f"{image.image.name.split('.')[0]}.jpg",
                    'image/jpeg',
                    sys.getsizeof(output),
                    None
                )
                image.save() 