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
            subject = f'New Contact Form Submission: {contact.subject}'
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
            Subject: {inquiry.subject}
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
            return False 