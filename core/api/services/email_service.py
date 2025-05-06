from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class EmailService:
    @staticmethod
    def send_contact_email(contact):
        """
        Send email notification for contact form submissions
        """
        try:
            subject = f'New Contact Form Submission from {contact.name}'
            message = f'''
            Name: {contact.name}
            Email: {contact.email}
            Message: {contact.message}
            '''
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Email sending failed: {str(e)}")
            return False

    @staticmethod
    def send_inquiry_email(inquiry):
        """
        Send email notification for product inquiries
        """
        try:
            subject = f'New Product Inquiry from {inquiry.name}'
            
            # Create a list of products in the inquiry
            products_list = "\n".join([
                f"- {item.product.style_number}" 
                for item in inquiry.items.all()
            ])
            
            message = f'''
            New Product Inquiry:
            
            Name: {inquiry.name}
            Email: {inquiry.email}
            Message: {inquiry.message}
            
            Products Inquired:
            {products_list}
            '''
            
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Inquiry email sending failed: {str(e)}")
            return False

    @staticmethod
    def send_order_receipt(order, customer_email=None):
        """
        Send order receipt notification to admin and optionally to customer
        """
        try:
            # Create a formatted list of items in the order
            items_list = []
            
            for item in order.items.all():
                product = item.product
                item_total = product.price * item.quantity
                
                items_list.append(
                    f"- {product.title} x {item.quantity} = ৳{item_total:,}"
                )
            
            items_formatted = "\n".join(items_list)
            
            # Admin notification
            admin_subject = f'New Order Received - Order #{str(order.id)[:8]}'
            admin_message = f'''
            A new order has been received:
            
            Order ID: {str(order.id)[:8]}
            Customer: {order.customer_name}
            Phone: {order.customer_phone}
            Address: {order.customer_address}
            Total Amount: ৳{order.total_price:,}
            
            Items Ordered:
            {items_formatted}
            '''
            
            # Send to admin email
            admin_email_sent = send_mail(
                admin_subject,
                admin_message,
                settings.EMAIL_HOST_USER,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            
            # Send to customer if email is provided
            customer_email_sent = True
            if customer_email:
                customer_subject = f'Your Order Confirmation - Order #{str(order.id)[:8]}'
                customer_message = f'''
                Dear {order.customer_name},
                
                Thank you for your order! We've received your order and it's being processed.
                
                Order Details:
                Order ID: {str(order.id)[:8]}
                Date: {order.created_at.strftime('%B %d, %Y')}
                
                Shipping Address:
                {order.customer_address}
                
                Contact:
                {order.customer_phone}
                
                Your Items:
                {items_formatted}
                
                Total Amount: ৳{order.total_price:,}
                
                We will contact you shortly to confirm your order. If you have any questions,
                please feel free to contact us.
                
                Thank you for shopping with us!
                
                Regards,
                Khadijah Customer Service
                '''
                
                customer_email_sent = send_mail(
                    customer_subject,
                    customer_message,
                    settings.EMAIL_HOST_USER,
                    [customer_email],
                    fail_silently=False,
                )
            
            return admin_email_sent and customer_email_sent
        except Exception as e:
            print(f"Order receipt email sending failed: {str(e)}")
            return False 