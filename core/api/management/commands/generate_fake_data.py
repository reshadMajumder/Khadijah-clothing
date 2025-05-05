# from django.core.management.base import BaseCommand
# from django.utils import timezone
# from api.models import (
#     Product, 
#     ProductImage, 
#     Composition, 
#     Category, 
#     SubCategory,
#     ContactUs, 
#     Inquiry, 
#     InquiryItems
# )
# from faker import Faker
# import random
# from datetime import timedelta
# import uuid

# fake = Faker()

# class Command(BaseCommand):
#     help = 'Generates fake data for testing'

#     def handle(self, *args, **kwargs):
#         self.stdout.write('Generating fake data...')

#         # Create Compositions (Materials)
#         compositions = []
#         material_types = [
#             'Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 
#             'Leather', 'Denim', 'Nylon', 'Cashmere', 'Modal'
#         ]
#         for material in material_types:
#             composition = Composition.objects.create(material=material)
#             compositions.append(composition)
#         self.stdout.write(f'Created {len(compositions)} compositions')

#         # Create Product Images
#         product_images = []
#         image_urls = [
#             'https://img.freepik.com/free-photo/male-belt-sweater-accessories-clothes_1203-6421.jpg',
#             'https://img.freepik.com/free-photo/brown-leather-shoes_1203-8175.jpg',
#             'https://img.freepik.com/free-photo/men-shirt_1203-8356.jpg',
#             'https://img.freepik.com/free-photo/shirt-hangers_1203-8389.jpg',
#             'https://img.freepik.com/free-photo/overhead-view-womans-casual-outfits_93675-133151.jpg'
#         ]
#         for url in image_urls:
#             # Create a temporary file name for the image
#             image_name = f"product_images/{uuid.uuid4()}.jpg"
#             image = ProductImage.objects.create(image=image_name)
#             product_images.append(image)
#         self.stdout.write(f'Created {len(product_images)} product images')

#         # Create Categories and SubCategories
#         categories_data = {
#             'mens': {
#                 'name': 'MENS PRODUCTS',
#                 'subcategories': [
#                     {'name': 'Mens Sweater', 'slug': 'mens-sweater', 'icon': '🧥'},
#                     {'name': 'Mens T-Shirt', 'slug': 'mens-tshirt', 'icon': '👕'},
#                     {'name': 'Mens Hoodie', 'slug': 'mens-hoodie', 'icon': '🧥'},
#                 ]
#             },
#             'ladies': {
#                 'name': 'LADIES PRODUCTS',
#                 'subcategories': [
#                     {'name': 'Ladies Sweater', 'slug': 'ladies-sweater', 'icon': '🧥'},
#                     {'name': 'Ladies T-Shirt', 'slug': 'ladies-tshirt', 'icon': '👚'},
#                     {'name': 'Ladies Pants', 'slug': 'ladies-pants', 'icon': '👖'},
#                 ]
#             },
#             'boys': {
#                 'name': 'BOYS PRODUCTS',
#                 'subcategories': [
#                     {'name': 'Boys Sweater', 'slug': 'boys-sweater', 'icon': '🧥'},
#                     {'name': 'Boys T-Shirt', 'slug': 'boys-tshirt', 'icon': '👕'},
#                     {'name': 'Boys Denim', 'slug': 'boys-denim', 'icon': '👖'},
#                 ]
#             }
#         }

#         categories = {}
#         for cat_key, cat_data in categories_data.items():
#             # Create Category
#             category = Category.objects.create(
#                 name=cat_data['name']
#             )
            
#             # Create SubCategories
#             for sub_data in cat_data['subcategories']:
#                 subcategory = SubCategory.objects.create(
#                     name=sub_data['name']
#                 )
#                 category.subcategories.add(subcategory)
            
#             categories[cat_key] = category

#         self.stdout.write(f'Created {len(categories)} categories with subcategories')

#         # Create Products
#         products = []
#         sample_types = ['Development', '1st Fit', '2nd Fit', 'PP Sample', 'Production']
#         gauges = ['7GG', '12GG', '14GG', '16GG']
#         ends = ['Single', 'Double', 'Triple']
#         weights = ['150GSM', '180GSM', '200GSM', '220GSM', '250GSM']

#         for category in categories.values():
#             for _ in range(10):  # 10 products per category
#                 product = Product.objects.create(
#                     style_number=f"STY-{random.randint(1000, 9999)}",
#                     gauge=random.choice(gauges),
#                     end=random.choice(ends),
#                     weight=random.choice(weights),
#                     description=fake.paragraph(),
#                     category=category,
#                     image=random.choice(image_urls)
#                 )
                
#                 # Add random compositions
#                 for _ in range(random.randint(1, 3)):
#                     product.composition.add(random.choice(compositions))
                
#                 # Add random product images
#                 for _ in range(random.randint(1, 4)):
#                     product.images.add(random.choice(product_images))
                
#                 products.append(product)

#         self.stdout.write(f'Created {len(products)} products')

#         # Create Contact Us entries
#         for _ in range(10):
#             ContactUs.objects.create(
#                 name=fake.name(),
#                 email=fake.email(),
#                 subject=fake.sentence(),
#                 message=fake.text(),
#                 is_read=random.choice([True, False]),
#                 created_at=timezone.now() - timedelta(days=random.randint(1, 30))
#             )
#         self.stdout.write('Created 10 contact us entries')

#         # Create Inquiries with Items
#         for _ in range(10):
#             inquiry = Inquiry.objects.create(
#                 name=fake.name(),
#                 email=fake.email(),
#                 subject=fake.sentence(),
#                 message=fake.text(),
#                 is_read=random.choice([True, False])
#             )
            
#             # Add random products to inquiry
#             for product in random.sample(products, k=random.randint(1, 3)):
#                 inquiry_item = InquiryItems.objects.create(product=product)
#                 inquiry.items.add(inquiry_item)

#         self.stdout.write('Created 10 inquiries with items')
#         self.stdout.write(self.style.SUCCESS('Successfully generated fake data')) 